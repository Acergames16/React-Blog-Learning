import React, { useState } from 'react';
import  supabase  from '../api/supabase';
import {Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // 1. Call Supabase Sign Up
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // 2. Success! 
      // alert("Registration successful! Please check your email for a confirmation link.");
      navigate('/');
    }
  };

  return (
<div className='flex flex-col items-center min-h-screen justify-center bg-gray-100'>
 <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
      <h1 className='text-center text-xl'>Create Account</h1>

      {errorMsg && <p className='text-sm' >{errorMsg}</p>}

      <form onSubmit={handleRegister}>
        {/* Username Field */}
   

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
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? 
        <span>
          <Link to="/login" style={{ marginLeft: '5px', color: '#007bff' }}>Login here</Link>
        </span>
      </p>
    </div>
    </div>
  );
};

export default RegisterPage;