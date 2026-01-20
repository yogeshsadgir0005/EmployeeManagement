import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, DollarSign, Users, Trash2, Edit2 } from 'lucide-react';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmpId, setCurrentEmpId] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', designation: '', department: '', currentSalary: '' });

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch (err) { console.error(err); }
  };

  const openCreateModal = () => {
    setFormData({ firstName: '', lastName: '', email: '', designation: '', department: '', currentSalary: '' });
    setIsEditing(false); setShowModal(true);
  };

  const openEditModal = (emp) => {
    setFormData({ firstName: emp.firstName, lastName: emp.lastName, email: emp.email, designation: emp.designation, department: emp.department, currentSalary: emp.currentSalary });
    setCurrentEmpId(emp._id); setIsEditing(true); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) await axios.put(`http://localhost:5000/api/employees/${currentEmpId}`, formData);
      else await axios.post('http://localhost:5000/api/employees', formData);
      setShowModal(false); fetchEmployees();
    } catch (err) { alert("Operation failed."); }
  };

  const handleDelete = async (id, name) => {
    if(confirm(`Terminate ${name}?`)) {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
    }
  };

  const totalPayroll = employees.reduce((acc, curr) => acc + curr.currentSalary, 0);
  const avgSalary = employees.length ? totalPayroll / employees.length : 0;

  return (
    <div>
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Overview</h2>
          <h1 className="text-5xl font-serif text-legacy-green">Executive Dashboard</h1>
        </div>
        <button onClick={openCreateModal} className="bg-legacy-green text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 duration-200">
          <Plus size={16} /> New Hire
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-16">
        {/* Added staggered delays for a cascading effect */}
        <div className="bg-white p-8 shadow-premium border-l-4 border-legacy-gold animate-page-enter" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center gap-3 text-gray-400 mb-2"><Users size={20} /> <span className="text-xs uppercase font-bold tracking-widest">Headcount</span></div>
          <p className="text-4xl font-serif text-legacy-green">{employees.length}</p>
        </div>
        <div className="bg-white p-8 shadow-premium border-l-4 border-legacy-green animate-page-enter" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center gap-3 text-gray-400 mb-2"><DollarSign size={20} /> <span className="text-xs uppercase font-bold tracking-widest">Monthly Payroll</span></div>
          <p className="text-4xl font-serif text-legacy-green">${totalPayroll.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 shadow-premium border-l-4 border-legacy-green animate-page-enter" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center gap-3 text-gray-400 mb-2"><TrendingUp size={20} /> <span className="text-xs uppercase font-bold tracking-widest">Avg. Compensation</span></div>
          <p className="text-4xl font-serif text-legacy-green">${Math.round(avgSalary).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white shadow-premium rounded-sm animate-page-enter" style={{animationDelay: '0.4s'}}>
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-xs uppercase text-gray-600 font-bold tracking-widest border-b border-gray-200">
            <tr>
              <th className="p-6">Name</th>
              <th className="p-6">Role</th>
              <th className="p-6">Department</th>
              <th className="p-6 text-right">Salary</th>
              <th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {employees.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-500 font-medium">No active personnel records found.</td></tr>
            ) : (
              employees.map(emp => (
                <tr key={emp._id} className="hover:bg-gray-50/80 transition border-b border-gray-100 last:border-0 group">
                  <td className="p-6 font-serif text-lg text-legacy-green">{emp.lastName}, <span className="text-gray-500">{emp.firstName}</span></td>
                  <td className="p-6 font-medium text-gray-600">{emp.designation}</td>
                  <td className="p-6"><span className="bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-600 border border-gray-200">{emp.department}</span></td>
                  <td className="p-6 text-right font-mono text-legacy-green font-bold">${emp.currentSalary.toLocaleString()}</td>
                  <td className="p-6 text-center flex items-center justify-center gap-4">
                    <Link to={`/employee/${emp._id}`} className="text-[10px] font-bold text-legacy-green border-b border-legacy-green hover:text-legacy-gold hover:border-legacy-gold transition uppercase tracking-widest">PROFILE</Link>
                    <button onClick={() => openEditModal(emp)} className="text-gray-400 hover:text-legacy-gold transition cursor-pointer"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(emp._id, emp.lastName)} className="text-gray-400 hover:text-red-500 transition cursor-pointer"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-backdrop">
          {/* Added 'animate-modal-enter' here */}
          <div className="bg-white p-10 w-500px shadow-2xl border-t-4 border-legacy-gold animate-modal-enter">
            <h3 className="font-serif text-3xl text-legacy-green mb-8">{isEditing ? 'Update Personnel' : 'Onboard Talent'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <input placeholder="First Name" className="border-b border-gray-300 py-3 w-full text-sm outline-none focus:border-legacy-green bg-transparent" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                <input placeholder="Last Name" className="border-b border-gray-300 py-3 w-full text-sm outline-none focus:border-legacy-green bg-transparent" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              </div>
              <input placeholder="Email" type="email" className="border-b border-gray-300 py-3 w-full text-sm outline-none focus:border-legacy-green bg-transparent" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <div className="grid grid-cols-2 gap-6">
                <input placeholder="Designation" className="border-b border-gray-300 py-3 w-full text-sm outline-none focus:border-legacy-green bg-transparent" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required />
                <input placeholder="Department" className="border-b border-gray-300 py-3 w-full text-sm outline-none focus:border-legacy-green bg-transparent" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
              </div>
              <input placeholder="Base Salary ($)" type="number" className="border-b border-gray-300 py-3 w-full text-sm outline-none focus:border-legacy-green bg-transparent" value={formData.currentSalary} onChange={e => setFormData({...formData, currentSalary: e.target.value})} required />
              
              <div className="flex justify-end gap-4 mt-8 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-500 hover:text-black cursor-pointer text-xs uppercase tracking-widest font-bold">Cancel</button>
                <button type="submit" className="bg-legacy-green text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-black transition cursor-pointer font-bold shadow-lg active:scale-95 duration-200">
                  {isEditing ? 'Save Changes' : 'Confirm Hire'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;