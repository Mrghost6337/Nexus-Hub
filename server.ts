import express from 'express';
import { createServer as createViteServer } from 'vite';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import Database from 'better-sqlite3';
import { google } from 'googleapis';
import bcrypt from 'bcryptjs';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const firestore = admin.firestore();

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const app = express();
const PORT = 3000;

app.set('trust proxy', 1); // Respect X-Forwarded-Proto header
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'nexus-hub-secret-key',
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for secure cookies behind a proxy
    cookie: {
      secure: true, // Always true in AI Studio as it's served over HTTPS
      sameSite: 'none',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Database setup (Using SQLite as a stand-in for PostgreSQL in this preview environment)
const db = new Database('nexus-hub.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    name TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: ensure password_hash exists if the table was already created
try {
  db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
} catch (e) {
  // Column already exists
}

db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY,
    bio TEXT,
    title TEXT,
    company TEXT,
    language TEXT DEFAULT 'en',
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS connected_services (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    provider TEXT,
    access_token TEXT,
    refresh_token TEXT,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT,
    receiver_id TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    contact_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (contact_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS calendar_events (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    description TEXT,
    start_time DATETIME,
    end_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT,
    url TEXT,
    size INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS ai_insights (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth Routes
app.post('/api/auth/firebase', async (req, res) => {
  try {
    const { idToken, name: displayName } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'ID Token is required' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const picture = decodedToken.picture;
    const name = displayName || decodedToken.name || email?.split('@')[0] || 'User';

    // Sync with Firestore
    const userRef = firestore.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        email,
        name,
        avatarUrl: picture || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await userRef.collection('profile').doc('public').set({
        language: 'en'
      });
    } else {
      await userRef.update({
        name: name,
        avatarUrl: picture || userDoc.data()?.avatarUrl || '',
      });
    }

    req.session.userId = uid;
    res.json({ success: true });
  } catch (error) {
    console.error('Firebase Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/auth/url', (req, res) => {
  const provider = req.query.provider as string;
  let url = '';
  
  if (provider === 'google') {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.APP_URL}/auth/callback`
    );

    url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/gmail.readonly'
      ]
    });
  }
  
  res.json({ url });
});

app.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code || typeof code !== 'string') {
      throw new Error('No code provided');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.APP_URL}/auth/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const userInfo = await oauth2.userinfo.get();
    
    const { id, email, name, picture } = userInfo.data;

    if (!id || !email) {
      throw new Error('Failed to get user info from Google');
    }

    // Upsert user
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: string } | undefined;
    
    let userId = existingUser?.id;
    
    if (!userId) {
      userId = id;
      db.prepare('INSERT INTO users (id, email, name, avatar_url) VALUES (?, ?, ?, ?)').run(userId, email, name || '', picture || '');
      db.prepare('INSERT INTO profiles (user_id) VALUES (?)').run(userId);
    } else {
      db.prepare('UPDATE users SET name = ?, avatar_url = ? WHERE id = ?').run(name || '', picture || '', userId);
    }

    // Upsert connected service
    const existingService = db.prepare('SELECT id FROM connected_services WHERE user_id = ? AND provider = ?').get(userId, 'google') as { id: string } | undefined;
    if (existingService) {
      db.prepare('UPDATE connected_services SET access_token = ?, refresh_token = ? WHERE user_id = ? AND provider = ?')
        .run(tokens.access_token || '', tokens.refresh_token || '', userId, 'google');
    } else {
      db.prepare('INSERT INTO connected_services (id, user_id, provider, access_token, refresh_token) VALUES (?, ?, ?, ?, ?)')
        .run(`google_${userId}`, userId, 'google', tokens.access_token || '', tokens.refresh_token || '');
    }

    // Set session
    req.session.userId = userId;

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/dashboard';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('Authentication failed');
  }
});

// Get current user
app.get('/api/user', async (req, res) => {
  console.log(`GET /api/user - Session ID: ${req.sessionID}, User ID: ${req.session.userId}`);
  if (!req.session.userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const userDoc = await firestore.collection('users').doc(req.session.userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userData = userDoc.data();
    res.json({
      id: userDoc.id,
      name: userData?.name,
      email: userData?.email,
      avatar_url: userData?.avatarUrl,
    });
  } catch (error) {
    console.error('Get user firestore error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to logout' });
      return;
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
