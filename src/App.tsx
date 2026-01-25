import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthListener } from './feature/auth/AuthListener';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MyBlogsPage from './pages/MyBlogsPage';
import FeaturedPage from './pages/FeaturedPage';
import PostViewPage from './pages/PostViewPage';

function App() {
  return (
    <Router>
      
      <AuthListener />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
       
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/featured" element={<ProtectedRoute><FeaturedPage /></ProtectedRoute>} />
        <Route path="/my-blog" element={<ProtectedRoute><MyBlogsPage /></ProtectedRoute>} />
        <Route path="/view/:id" element={<ProtectedRoute><PostViewPage /></ProtectedRoute>} />

        {/* <Route path='*' element ={<div> 404 not found</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;