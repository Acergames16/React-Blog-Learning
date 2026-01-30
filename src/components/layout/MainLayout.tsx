import { Outlet } from 'react-router-dom';
import { Sidebar } from '../ui/Sidebar';
import { APP_NAVIGATION } from '../../features/navigation/navConfig';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Passing the array to our elegant sidebar */}
      <Sidebar items={APP_NAVIGATION} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto p-12">
          {/* This is where Feed, MyBlogs, or Settings will render */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};