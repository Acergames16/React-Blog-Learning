import { Link, useLocation, useNavigate } from 'react-router-dom';
import type{ NavItem } from '../../features/navigation/navConfig';
import logo from '../../assets/logo.png';
import { LogoutUser } from '../../features/auth/AuthAction';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { LogOut } from 'lucide-react';


interface SidebarProps {
  items: NavItem[];
}




export const Sidebar = ({ items }: SidebarProps) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(LogoutUser());
    navigate('/');
  };
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-8 mb-4">
        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                isActive 
                  ? 'text-black font-semibold' // Active: Bold text, no background for ultra-minimalist
                  : 'text-gray-400 hover:text-gray-900' // Inactive: Muted gray
              }`}
            >
              {/* StrokeWidth 1.5 gives that thin, elegant SaaS look */}
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-sm tracking-tight">{item.name}</span>
              
              {/* Minimalist Active Indicator: A tiny black dot or line */}
              {isActive && <div className="ml-auto w-1 h-1 bg-black rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer-like bottom area */}


      <div className="p-4 border-t border-gray-50 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 group"
        >
          <LogOut size={18} strokeWidth={1.5} className="group-hover:text-red-500 transition-colors" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      <div className="p-6 border-t border-gray-50">
        <p className="text-[10px] text-gray-300 uppercase tracking-widest font-medium">
          System v1.0
        </p>
      </div>
    </aside>
  );
};