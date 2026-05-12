import { Link } from 'react-router';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Layers } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/user')
      .then(res => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center"
    >
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-tight">Nexus Hub</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 px-8 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
        <a href="#about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">About</a>
        <a href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</a>
        <a href="#pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Pricing</a>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <Link to="/dashboard" className="glass-button-primary py-2 px-5 text-sm">
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden md:block">
              Sign In
            </Link>
            <Link to="/login" className="glass-button-primary py-2 px-5 text-sm">
              Start Now
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
