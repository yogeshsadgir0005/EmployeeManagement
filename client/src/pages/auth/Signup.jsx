import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      // Navigate to separate OTP page with state
      navigate('/verify-otp', { 
        state: { 
          userId: res.data.userId, 
          email: formData.email, 
          mode: 'signup' 
        } 
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error signing up');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-legacy-cream">
      <div className="bg-white p-10 shadow-2xl border-t-4 border-legacy-green w-full max-w-md">
        <h2 className="font-serif text-2xl text-legacy-green mb-6 text-center">Manager Registration</h2>
        
        <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
          <input 
            placeholder="Full Name" 
            className="w-full border p-3 text-sm" 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          <input 
            placeholder="Email Address" 
            type="email" 
            className="w-full border p-3 text-sm" 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            placeholder="Password" 
            type="password" 
            className="w-full border p-3 text-sm" 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
          <button className="w-full bg-legacy-green text-white py-3 text-xs uppercase tracking-widest hover:bg-legacy-gold transition cursor-pointer">
            Proceed
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-xs text-gray-400 hover:text-legacy-green">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;