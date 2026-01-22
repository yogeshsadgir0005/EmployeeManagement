import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://employeemanagement-8c1x.onrender.com/api/auth/forgot-password', { email });
      
      navigate('/verify-otp', { 
        state: { 
          userId: res.data.userId, 
          email: email, 
          mode: 'reset' 
        } 
      });
    } catch (err) { alert('Email not found'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-legacy-cream">
      <div className="bg-white p-10 shadow-2xl border-t-4 border-gray-400 w-full max-w-md">
        <h2 className="font-serif text-2xl text-legacy-green mb-6 text-center">Credential Recovery</h2>
        
        <form onSubmit={sendOtp} className="space-y-4">
          <input 
            placeholder="Registered Email" 
            type="email" 
            className="w-full border p-3 text-sm focus:outline-none focus:border-legacy-green" 
            onChange={e => setEmail(e.target.value)} 
          />
          <button className="w-full bg-legacy-green text-white py-3 text-xs uppercase tracking-widest hover:bg-legacy-gold transition cursor-pointer">
            Send Verification Code
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-xs text-gray-400 hover:text-legacy-green">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
