import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data passed from previous page
  const { userId, email, mode } = location.state || {}; 

  // Redirect if someone tries to open this page directly
  if (!userId || !mode) {
    navigate('/login');
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();

    if (mode === 'signup') {
      // --- SIGNUP MODE ---
      try {
        const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { userId, otp });
        localStorage.setItem('userInfo', JSON.stringify(res.data)); // Login
        navigate('/'); // Go to Dashboard
      } catch (err) {
        alert(err.response?.data?.message || 'Invalid OTP');
      }
    } else if (mode === 'reset') {
      // --- PASSWORD RESET MODE ---
      // We don't call API here because the backend 'reset-password' needs the NEW password too.
      // We just pass the Valid OTP to the next screen.
      navigate('/reset-password', { state: { userId, otp } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-legacy-cream">
      <div className="bg-white p-10 shadow-2xl border-t-4 border-legacy-gold w-full max-w-md">
        <h2 className="font-serif text-2xl text-legacy-green mb-2 text-center">Security Verification</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the code sent to <span className="font-bold text-legacy-green">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6" autoComplete="off">
          
          {/* FAKE INPUTS TO TRAP BROWSER AUTOFILL */}
          <div style={{ position: 'absolute', left: '-9999px' }}>
            <input type="text" name="fake_trap_user" tabIndex="-1" />
            <input type="password" name="fake_trap_pass" tabIndex="-1" />
          </div>

          <input 
            type="text" 
            placeholder="000000" 
            className="w-full border p-3 text-center text-3xl tracking-[0.5em] font-mono focus:border-legacy-green outline-none" 
            onChange={e => setOtp(e.target.value)} 
            maxLength={6} 
            autoComplete="off"
            name="unique_otp_field_v2"
          />
          
          <button className="w-full bg-legacy-green text-white py-3 text-xs uppercase tracking-widest hover:bg-legacy-gold transition cursor-pointer">
            {mode === 'signup' ? 'Verify & Login' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;