import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://employeemanagement-8c1x.onrender.com/api/auth/login', formData);
      localStorage.setItem('userInfo', JSON.stringify(res.data)); 
      navigate('/'); 
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-legacy-cream">
      <div className="bg-white p-10 shadow-2xl border-t-4 border-legacy-green w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-legacy-green tracking-tighter">Legacy<span className="text-legacy-gold">HR</span>.</h1>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-legacy-green transition-colors"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-legacy-green transition-colors"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              autoComplete="current-password"
            />
          </div>

          <button className="w-full bg-legacy-green text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-[#142e28] transition-colors cursor-pointer">
            Access Dashboard
          </button>
        </form>

        <div className="mt-6 flex justify-between text-xs text-gray-400">
         
          
          {/* --- THE FIX: Point to ForgotPassword, NOT ResetPassword --- */}
          <Link to="/forgot-password" className="hover:text-legacy-gold transition">Lost Credential?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
