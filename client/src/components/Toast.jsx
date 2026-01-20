import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto close after 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-10 right-10 z-50 animate-fade-in">
      <div className={`flex items-center gap-4 px-6 py-4 rounded-lg shadow-2xl border ${
        type === 'success' 
          ? 'bg-#142E29 text-white border-green-800' 
          : 'bg-red-50 text-red-900 border-red-100'
      }`}>
        {type === 'success' ? <CheckCircle size={20} className="text-legacy-gold" /> : <AlertCircle size={20} />}
        <div>
          <h4 className="font-medium text-sm tracking-wide">{type === 'success' ? 'Success' : 'Error'}</h4>
          <p className="text-xs opacity-90">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100"><X size={16} /></button>
      </div>
    </div>
  );
};

export default Toast;