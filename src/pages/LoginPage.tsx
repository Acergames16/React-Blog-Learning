import React from 'react'
import supabase from '../api/supabase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const LoginPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        // 1. Call Supabase Sign In
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            // 2. Success! Redirect or show success message
            navigate('/');
        }
    };
  return (
<div className='flex flex-col items-center min-h-screen justify-center bg-gray-100'>
 <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
      <h1 className='text-center text-xl'>Login</h1>

      {errorMsg && <p className='text-sm' >{errorMsg}</p>}

      <form onSubmit={handleLogin}>
        {/* Email Field */}
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input
            type="email"
            className='w-full block p-2 mt-1 bg-green-50 border border-gray-300 rounded'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className='mb-10'>
          <label>Password</label>
          <input
            type="password"
            className='w-full block p-2 mt-1 bg-green-50 border border-gray-300 rounded'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className='w-full p-2 bg-green-500 text-white rounded hover:bg-green-600'
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className='text-center text-sm mt-4'>
        Don't have an account yet? 
        <span>
          <Link to="/register" style={{ marginLeft: '5px', color: '#007bff' }}> Register here!</Link>
        </span>
      </p>
    </div>
    </div>
  )
}

export default LoginPage