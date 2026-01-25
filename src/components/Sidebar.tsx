import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import supabase from '../api/supabase';
import { useAppDispatch } from '../app/hooks';
import { setAuth } from '../feature/auth/authSlice';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    dispatch(setAuth(null));
    navigate('/');
  };

  const navItems = [
    { label: 'Featured', href: '/featured', icon: '✨' },
    { label: 'My Blog', href: '/my-blog', icon: '📝' },
  ];

  return (
    <aside className="w-64 h-screen bg-violet-900 text-white flex flex-col p-6 shadow-2xl sticky top-0">
      <div className="mb-10 px-2">
        <h2 className="text-2xl font-bold tracking-tight text-violet-100">
          Blog<span className="text-violet-4both00">App</span>
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-violet-700 text-white shadow-inner' 
                  : 'text-violet-300 hover:bg-violet-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-violet-800/50">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-violet-300 hover:bg-red-500/20 hover:text-red-400 transition-all font-medium"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;