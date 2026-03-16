import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Search, Bell, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 selection:bg-terracotta-500/30">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-80 min-h-screen flex flex-col">
        {/* Premium Navbar */}
        <header className="h-24 glass sticky top-0 z-30 border-b border-white/5 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all shadow-lg"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center flex-1 max-w-md relative group">
              <Search className="absolute left-5 text-slate-600 group-focus-within:text-terracotta-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search modules, paths, or focus tracks..." 
                className="w-full bg-slate-800/40 border border-white/10 rounded-2xl py-3 pl-14 pr-6 text-sm font-medium focus:border-terracotta-500/30 focus:bg-slate-800/80 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-terracotta-500/10 border border-terracotta-500/20 text-terracotta-500 cursor-pointer group shadow-xl shadow-terracotta-500/5 transition-all"
            >
              <Sparkles size={18} className="animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase">AI Engine Optimized</span>
            </motion.div>
            
            <div className="h-10 w-px bg-white/5" />
            
            <button className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all relative">
              <Bell size={22} />
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-terracotta-500 ring-4 ring-slate-900" />
            </button>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
