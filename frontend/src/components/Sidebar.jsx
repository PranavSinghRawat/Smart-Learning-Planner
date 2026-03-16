import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Target, 
  Clock, 
  BarChart3,
  LogOut,
  X,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/dashboard', name: 'Engine Room', icon: LayoutDashboard },
    { path: '/exams', name: 'Milestones', icon: Target },
    { path: '/subjects', name: 'Modules', icon: BookOpen },
    { path: '/goals', name: 'Career Paths', icon: BarChart3 },
    { path: '/plan/today', name: "Today's Track", icon: Zap },
    { path: '/progress', name: 'Analytics', icon: Clock },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      <aside className={`fixed top-0 left-0 h-full w-80 glass z-50 transform transition-transform duration-500 ease-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-white/5`}>
        <div className="flex flex-col h-full p-8">
          {/* Logo Section */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-100 tracking-tighter italic">
                Smart<span className="text-terracotta-500 not-italic">Planner</span>
              </span>
              <span className="text-[9px] font-black tracking-[0.3em] text-slate-500 uppercase mt-1">Human-Centric AI</span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={({ isActive }) => `
                  flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-terracotta-500 text-white shadow-xl shadow-terracotta-500/20' 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}
                `}
              >
                <item.icon size={22} className="transition-transform group-hover:scale-110" />
                <span className="font-bold tracking-tight">{item.name}</span>
                {item.name === "Today's Track" && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
            <div className="flex items-center gap-4 px-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-terracotta-500 font-black text-xl italic">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-slate-100 font-black tracking-tight">{user?.name}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck size={10} className="text-sage-500" /> Professional Node
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 font-bold group"
            >
              <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
