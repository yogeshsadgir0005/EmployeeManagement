import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={`group flex items-center space-x-4 px-8 py-4 transition-all duration-500 ease-out border-r-2 ${
        isActive 
          ? 'border-legacy-gold bg-linear-to-r from-white to-#FDFCF8' 
          : 'border-transparent hover:bg-white/50 text-gray-500 hover:text-legacy-green' 
      }`}>
        <Icon size={18} className={`transition-transform duration-500 ${isActive ? 'text-legacy-green scale-110' : 'group-hover:scale-110'}`} />
        <span className={`text-sm font-medium tracking-widest uppercase transition-colors ${isActive ? 'text-legacy-green' : ''}`}>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-legacy-cream font-sans selection:bg-legacy-gold selection:text-white">
      <aside className="w-72 fixed h-full z-20 bg-#FDFCF8/95 backdrop-blur-md border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-10 pb-12">
            <h1 className="font-serif text-3xl font-bold text-legacy-green tracking-tighter">
           H F<span className="text-legacy-gold">.</span>
            </h1>
            <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.3em] font-bold">Humanity Founders</p>
          </div>
          <nav className="space-y-1">
            <NavItem to="/" icon={LayoutDashboard} label="Overview" />
            <NavItem to="/employees" icon={Users} label="Personnel" />
            <NavItem to="/settings" icon={Settings} label="Admin" />
          </nav>
        </div>
        
        <div className="p-8 border-t border-gray-200">
           <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-legacy-green text-white flex items-center justify-center font-serif text-xs">A</div>
              <div>
                <p className="text-xs font-bold text-legacy-green uppercase tracking-wide">Admin User</p>
                <p className="text-[10px] text-gray-500 font-medium">View Profile</p>
              </div>
           </div>
        </div>
      </aside>

      {/* KEY CHANGE: The 'key' prop triggers the animation on every route change */}
      <main className="flex-1 ml-72 p-12">
        <div key={location.pathname} className="max-w-7xl mx-auto animate-page-enter">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;