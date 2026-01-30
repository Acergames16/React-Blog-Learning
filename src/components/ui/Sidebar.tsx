import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { NavItem } from '../../features/navigation/navConfig';
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
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo Section - Darker for visibility */}
      <div className="p-10 mb-8">
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-8 space-y-8">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-4 transition-all duration-300 ${
                isActive ? 'text-black' : 'text-zinc-500 hover:text-black'
              }`}
            >
              {/* Increased strokeWidth to 1.5 for better visibility */}
              <Icon 
                size={18} 
                strokeWidth={isActive ? 2 : 1.5} 
                className={`${isActive ? 'text-black' : 'text-zinc-400 group-hover:text-black transition-colors'}`} 
              />
              
              {/* Changed from light to medium and bumped gray from 300 to 500 */}
              <span className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-all ${
                isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
              }`}>
                {item.name}
              </span>

              {/* Thicker indicator line */}
              {isActive && (
                <div className="ml-auto h-[2px] w-4 bg-black animate-in fade-in slide-in-from-left-2 duration-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-8 py-10 space-y-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full text-zinc-500 hover:text-black transition-all duration-300 group"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Logout</span>
        </button>

        <div className="pt-8 border-t border-gray-100">
          <p className="text-[9px] text-zinc-400 uppercase tracking-[0.4em] leading-loose font-medium">
            Archive <br />
            System v1.0
          </p>
        </div>
      </div>
    </aside>
  );
};