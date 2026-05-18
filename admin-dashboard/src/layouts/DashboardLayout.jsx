import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  UserPlus, 
  Layers, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Analytics', path: '/', icon: LayoutDashboard },
    { name: 'Inquiries', path: '/leads', icon: MessageSquare },
    { name: 'Team/Invite', path: '/users', icon: UserPlus, roles: ['super_admin'] },
    { name: 'Portfolio', path: '/cms', icon: Layers },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const filteredNav = navItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="flex min-h-screen bg-dark text-slate-200 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={cn(
          "glass border-r border-white/5 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 lg:static",
          isCollapsed ? "w-20" : "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {(!isCollapsed || isMobileMenuOpen) && (
            <div className="font-bebas text-2xl tracking-tight text-primary">
              SMASH <span className="text-white">STUDIO</span>
            </div>
          )}
          <button 
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsMobileMenuOpen(false);
              } else {
                setIsCollapsed(!isCollapsed);
              }
            }}
            className="p-1 hover:bg-white/5 rounded-md transition-colors"
          >
            {window.innerWidth < 1024 ? <X size={20} /> : (isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />)}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/20 shadow-[0_0_15px_rgba(53,168,242,0.2)]" 
                    : "hover:bg-white/5 text-slate-400"
                )}
              >
                <Icon size={22} />
                {(!isCollapsed || isMobileMenuOpen) && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={22} />
            {(!isCollapsed || isMobileMenuOpen) && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-slate-400"
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-base lg:text-lg font-bold text-white capitalize truncate max-w-[150px] lg:max-w-none">
                {filteredNav.find(n => n.path === location.pathname)?.name || 'Dashboard'}
              </h1>
              <p className="text-[10px] lg:text-xs text-slate-500">System Status: Operational</p>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors p-2">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_#35A8F2]"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l border-white/10">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-white">{user?.name}</span>
                <span className="text-xs text-primary uppercase font-mono tracking-wider">{user?.role}</span>
              </div>
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 overflow-auto flex-1 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
