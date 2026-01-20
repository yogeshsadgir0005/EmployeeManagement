import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo')) || { name: 'Admin', email: 'admin@legacy.com' };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
           <h2 className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-1">Configuration</h2>
           <h1 className="text-4xl font-serif text-legacy-green">System Settings</h1>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm p-8">
        <h3 className="font-serif text-xl text-legacy-green mb-6 border-b border-gray-100 pb-4">Admin Profile</h3>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-legacy-cream rounded-full flex items-center justify-center text-legacy-green border border-legacy-gold">
            <span className="font-serif text-3xl">{user.name.charAt(0)}</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-800">{user.name}</h4>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 border border-green-200 uppercase tracking-wider">
              <Shield size={10} /> Verified Manager
            </span>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-gray-100">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold uppercase tracking-widest text-xs border border-red-100 hover:bg-red-50 px-6 py-3 transition cursor-pointer"
          >
            <LogOut size={16} /> Sign Out Securely
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;