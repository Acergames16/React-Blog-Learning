import { useAppSelector } from '../app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const HomePage = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-violet-50 text-violet-600">
      Loading...
    </div>
  );

  // LOGGED IN VIEW
  if (user) {
    return (
      <Layout>
        <div className="max-w-4xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.user_metadata?.username || user.email}!
            </h1>
            <p className="text-gray-500">Here is what's happening in the community.</p>
          </header>

          <div className="grid gap-6">
            
            <div className="p-12 border-2 border-dashed border-violet-200 rounded-3xl bg-white flex flex-col items-center">
               <span className="text-4xl mb-4">🏠</span>
               <p className="text-violet-400 font-medium">Share your thoughts with the world.</p>
               <button 
               onClick={()=>navigate("/my-blog")}
               className="mt-4 px-4 py-2 bg-violet-100 text-violet-700 rounded-lg font-semibold hover:bg-violet-200 transition-colors">
                 Create your first post
               </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // LOGGED OUT VIEW (Landing Page)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-violet-50 px-4">
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-2xl border border-violet-100 max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-violet-900 mb-4 text-center">
          Blog App
        </h1>
        <p className="text-violet-600 text-lg mb-8 text-center">
          Share your thoughts with the world. Please log in or register to start posting.
        </p>
        <div className="flex gap-4 w-full">
          <Link 
            to="/login" 
             className="flex-1 text-center px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all shadow-lg"
          >
            Login
          </Link>
          <Link 
            to="/register" 
             className="flex-1 text-center px-6 py-3 bg-white text-violet-600 font-bold border-2 border-violet-600 rounded-xl hover:bg-violet-50 transition-all"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;