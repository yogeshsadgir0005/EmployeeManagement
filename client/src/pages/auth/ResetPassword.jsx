import React, { useState, useEffect } from 'react'; // <--- Import useEffect
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, otp } = location.state || {};

  // --- THE FIX: Wrap redirect in useEffect ---
  useEffect(() => {
    if (!userId || !otp) {
      navigate('/login');
    }
  }, [userId, otp, navigate]);

  // Don't render the form if missing data (avoids flash of content)
  if (!userId || !otp) return null; 

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://employeemanagement-8c1x.onrender.com/api/auth/reset-password', { userId, otp, newPassword });
      alert('Password Updated. Please Login.');
      navigate('/login');
    } catch (err) { 
      alert(err.response?.data?.message || 'Error resetting password'); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-legacy-cream">
      <div className="bg-white p-10 shadow-2xl border-t-4 border-legacy-green w-full max-w-md">
        <h2 className="font-serif text-2xl text-legacy-green mb-6 text-center">Set New Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input 
            placeholder="New Password" 
            type="password" 
            className="w-full border p-3 text-sm" 
            onChange={e => setNewPassword(e.target.value)} 
          />
          <button className="w-full bg-legacy-green text-white py-3 text-xs uppercase tracking-widest hover:bg-legacy-gold transition cursor-pointer">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
