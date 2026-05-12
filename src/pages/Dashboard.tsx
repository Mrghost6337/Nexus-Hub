import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Users, MessageSquare, Phone, Calendar, 
  FileText, Link2, Bot, Bell, Search, Settings, 
  LogOut, ChevronRight, Plus, Layers
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router';

const MENU_ITEMS = [
  { id: 'ai', label: 'AI Assistant', icon: Bot, color: 'text-purple-400' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-blue-400' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'text-green-400' },
  { id: 'contacts', label: 'Contacts', icon: Users, color: 'text-orange-400' },
  { id: 'calls', label: 'Calls', icon: Phone, color: 'text-pink-400' },
  { id: 'files', label: 'Files', icon: FileText, color: 'text-yellow-400' },
  { id: 'services', label: 'Connected Services', icon: Link2, color: 'text-cyan-400' },
  { id: 'profile', label: 'Profile', icon: User, color: 'text-gray-400' },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('ai');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data
    fetch('/api/user')
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) {
            navigate('/login');
            return null;
          }
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch user (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        if (data) setUser(data);
      })
      .catch(err => {
        console.error('Dashboard user fetch error:', err);
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col z-20"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight">Nexus Hub</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left group",
                activeTab === item.id 
                  ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                  : "text-white/50 hover:bg-white/5 hover:text-white/90"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", activeTab === item.id ? item.color : "text-white/40 group-hover:text-white/70")} />
              <span className="font-medium text-sm">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="activeTabIndicator" className="ml-auto w-1 h-4 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white/90 transition-all duration-300 w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-black to-black -z-10" />
        
        {/* Header */}
        <header className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative">
              <Bell className="w-4 h-4 text-white/70" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Settings className="w-4 h-4 text-white/70" />
            </button>
            <div className="h-8 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{user?.name || 'Loading...'}</p>
                <p className="text-xs text-white/50">Pro Plan</p>
              </div>
              <img 
                src={user?.avatar_url || 'https://picsum.photos/seed/demo/200'} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-white/20"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {activeTab === 'ai' && <AIAssistantView user={user} />}
              {activeTab === 'calendar' && <CalendarView />}
              {activeTab === 'services' && <ServicesView />}
              {/* Add other views as needed, defaulting to a placeholder */}
              {!['ai', 'calendar', 'services'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-full text-white/30">
                  <Layers className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Coming Soon</p>
                  <p className="text-sm">This module is currently under development.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function AIAssistantView({ user }: { user: any }) {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Good morning, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-white/50">Here is your AI-generated daily briefing.</p>
        </div>
        <button className="glass-button-primary py-2 px-4 text-sm">
          <Bot className="w-4 h-4" /> Ask AI
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-panel p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Calendar className="w-4 h-4" />
            <h3 className="font-semibold">Today's Schedule</h3>
          </div>
          
          {[
            { time: '10:00 AM', title: 'Sync with Design Team', type: 'Meet', color: 'bg-blue-500/20 text-blue-400' },
            { time: '01:30 PM', title: 'Investor Pitch Prep', type: 'Focus', color: 'bg-purple-500/20 text-purple-400' },
            { time: '04:00 PM', title: 'Review Q3 Metrics', type: 'Review', color: 'bg-green-500/20 text-green-400' },
          ].map((event, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-20 text-sm font-medium text-white/60">{event.time}</div>
              <div className="flex-1 font-medium">{event.title}</div>
              <div className={cn("px-3 py-1 rounded-full text-xs font-semibold", event.color)}>
                {event.type}
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Users className="w-4 h-4" />
            <h3 className="font-semibold">Suggested Connections</h3>
          </div>
          
          {[
            { name: 'Sarah Jenkins', role: 'VP Engineering @ TechFlow', match: '98%' },
            { name: 'Michael Chen', role: 'Founder @ DataSync', match: '94%' },
            { name: 'Emma Watson', role: 'Product Lead @ Innovate', match: '89%' },
          ].map((person, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />
              <div className="flex-1 overflow-hidden">
                <div className="font-medium text-sm truncate">{person.name}</div>
                <div className="text-xs text-white/40 truncate">{person.role}</div>
              </div>
              <div className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                {person.match}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 text-white/70 mb-6">
          <MessageSquare className="w-4 h-4" />
          <h3 className="font-semibold">Recent Insights</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-white/70">Discord Summary</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              The engineering team discussed the new API rate limits. Action item: Update the documentation by Friday.
            </p>
          </div>
          
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center">
                <FileText className="w-3 h-3 text-red-400" />
              </div>
              <span className="text-sm font-medium text-white/70">Email Analysis</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              3 new investor inquiries received. AI drafted responses are ready for your review in the drafts folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarView() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <button className="glass-button-primary py-2 px-4 text-sm">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>
      <div className="glass-panel flex-1 flex items-center justify-center text-white/40">
        Calendar Grid Placeholder
      </div>
    </div>
  );
}

function ServicesView() {
  const services = [
    { name: 'Google Workspace', icon: 'G', status: 'Connected', color: 'bg-blue-500' },
    { name: 'Discord', icon: 'D', status: 'Connected', color: 'bg-indigo-500' },
    { name: 'Apple iCloud', icon: 'A', status: 'Connect', color: 'bg-gray-500' },
    { name: 'Microsoft 365', icon: 'M', status: 'Connect', color: 'bg-blue-600' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Connected Services</h1>
      <p className="text-white/50 mb-4">Manage your external integrations to power the AI assistant.</p>
      
      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service, i) => (
          <div key={i} className="glass-panel p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white", service.color)}>
                {service.icon}
              </div>
              <div>
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-xs text-white/40">Sync emails, calendar, and contacts</p>
              </div>
            </div>
            <button className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
              service.status === 'Connected' 
                ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white" 
                : "bg-white text-black border-white hover:bg-gray-200"
            )}>
              {service.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
