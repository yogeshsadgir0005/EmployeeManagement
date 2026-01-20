import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Personnel from './pages/Personnel';
import Settings from './pages/Settings';
import EmployeeDetails from './pages/EmployeeDetails';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import OtpVerify from './pages/auth/OtpVerify';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword'; // <--- IMPORT THIS

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* --- ADD THIS ROUTE --- */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><Layout><Personnel /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="/employee/:id" element={<ProtectedRoute><Layout><EmployeeDetails /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;