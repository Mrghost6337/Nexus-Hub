import { motion } from 'motion/react';
import { Navigation } from '@/src/components/Navigation';
import { ArrowRight, Bot, Calendar, MessageSquare, Cloud, CheckCircle2, Layers } from 'lucide-react';
import { Link } from 'react-router';

export function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-black to-black -z-10" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium tracking-wide text-white/80">Nexus AI 2.0 is live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-bold tracking-tighter max-w-5xl mx-auto leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
        >
          The AI powered networking platform
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light tracking-wide"
        >
          Connect, organize, and grow your startup network with intelligent automation and unified communication.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/login" className="glass-button-primary text-lg px-8 py-4 w-full sm:w-auto">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#about" className="glass-button text-lg px-8 py-4 w-full sm:w-auto text-white/80">
            Learn More
          </a>
        </motion.div>

        {/* Hero Image Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 w-full max-w-6xl mx-auto relative perspective-[2000px]"
        >
          <div className="glass-panel aspect-video w-full rounded-[2rem] border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col transform rotate-x-[5deg] scale-95">
            {/* Mockup Header */}
            <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-64 h-6 rounded-md bg-white/5 border border-white/10" />
              </div>
            </div>
            {/* Mockup Content */}
            <div className="flex-1 flex p-6 gap-6 bg-black/40">
              <div className="w-64 rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-4">
                <div className="h-8 w-32 bg-white/10 rounded-lg" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-3/4 bg-white/5 rounded" />
                <div className="h-4 w-5/6 bg-white/5 rounded" />
              </div>
              <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="h-10 w-48 bg-white/10 rounded-xl" />
                  <div className="h-10 w-10 bg-white/10 rounded-full" />
                </div>
                <div className="flex-1 rounded-xl bg-white/5 border border-white/5" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Unified Intelligence</h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
            Nexus Hub brings your entire professional life into one beautiful, AI-powered workspace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-10 flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold">Seamless Networking</h3>
            <p className="text-white/60 leading-relaxed">
              Connect with founders and professionals effortlessly. Our platform organizes your contacts, tracks interactions, and suggests meaningful connections based on your industry and goals.
            </p>
          </div>
          <div className="glass-panel p-10 flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold">AI Assistant</h3>
            <p className="text-white/60 leading-relaxed">
              Your personal AI analyzes chats, emails, and meetings to automatically create daily schedules, suggest follow-ups, and summarize long conversations.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Powerful Features</h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
            Everything you need to manage your professional network.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Calendar, title: 'AI Scheduling', desc: 'Automatically find the perfect time for meetings across different timezones.' },
            { icon: Layers, title: 'Network Discovery', desc: 'Discover relevant professionals and startup founders in your industry.' },
            { icon: MessageSquare, title: 'Unified Comms', desc: 'All your messages from Discord, Email, and Teams in one inbox.' },
            { icon: Cloud, title: 'Cloud Integrations', desc: 'Connect Google Drive, OneDrive, and iCloud seamlessly.' },
            { icon: Bot, title: 'Smart Summaries', desc: 'Get instant summaries of long email threads and meeting transcripts.' },
            { icon: CheckCircle2, title: 'Task Automation', desc: 'Let AI extract action items from your conversations automatically.' },
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-8 hover:bg-white/10 transition-colors duration-500 group cursor-default">
              <feature.icon className="w-8 h-8 text-white/70 mb-6 group-hover:text-white transition-colors" />
              <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Simple Pricing</h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
            Choose the plan that fits your networking needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic */}
          <div className="glass-panel p-10 flex flex-col">
            <h3 className="text-2xl font-semibold mb-2">Basic</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold">€6.99</span>
              <span className="text-white/50">/ month</span>
            </div>
            <ul className="flex flex-col gap-4 mb-10 flex-1">
              {['Basic networking', 'Unified inbox (2 accounts)', 'Standard AI assistant', 'Community access'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-white/40" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/login" className="glass-button w-full justify-center">Get Started</Link>
          </div>

          {/* Pro */}
          <div className="glass-panel p-10 flex flex-col relative border-white/30 bg-white/10 scale-105 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              Most Popular
            </div>
            <h3 className="text-2xl font-semibold mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold">€12.99</span>
              <span className="text-white/50">/ month</span>
            </div>
            <ul className="flex flex-col gap-4 mb-10 flex-1">
              {['Advanced networking', 'Unlimited unified inbox', 'Pro AI assistant (GPT-4)', 'Priority support', 'Custom integrations'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/90">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/login" className="glass-button-primary w-full justify-center">Get Pro</Link>
          </div>

          {/* Business Pro */}
          <div className="glass-panel p-10 flex flex-col">
            <h3 className="text-2xl font-semibold mb-2">Business Pro</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold">€24.99</span>
              <span className="text-white/50">/ month</span>
            </div>
            <ul className="flex flex-col gap-4 mb-10 flex-1">
              {['Everything in Pro', 'Team collaboration', 'Enterprise AI models', 'Dedicated account manager', 'SLA guarantee'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="w-5 h-5 text-white/40" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/login" className="glass-button w-full justify-center">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-white/50" />
            <span className="font-semibold text-white/50">Nexus Hub</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-sm text-white/40">
            © 2026 Nexus Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
