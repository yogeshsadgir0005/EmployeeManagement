import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, Users } from 'lucide-react';

const Personnel = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmpId, setCurrentEmpId] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', designation: '', department: '', currentSalary: '' });

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://employeemanagement-8c1x.onrender.com/api/employees');
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
      if (isEditing) await axios.put(`https://employeemanagement-8c1x.onrender.com/api/employees/${currentEmpId}`, formData);
      else await axios.post('https://employeemanagement-8c1x.onrender.com/api/employees', formData);
      setShowModal(false); fetchEmployees();
    } catch (err) { alert("Operation failed."); }
  };

  const handleDelete = async (id, name) => {
    if(confirm(`Terminate ${name}?`)) {
      await axios.delete(`https://employeemanagement-8c1x.onrender.com/api/employees/${id}`);
      fetchEmployees();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-1">Directory</h2>
          <h1 className="text-4xl font-serif text-legacy-green">Personnel Management</h1>
        </div>
        <button onClick={openCreateModal} className="bg-legacy-green text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#142e28] transition flex items-center gap-2 cursor-pointer shadow-sm">
          <Plus size={16} /> New Hire
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-widest border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Department</th>
              <th className="p-4 font-medium text-right">Salary</th>
              <th className="p-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {employees.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-gray-400">No records found.</td></tr> : employees.map(emp => (
              <tr key={emp._id} className="hover:bg-legacy-cream transition border-b border-gray-100 last:border-0 group">
                <td className="p-4 font-serif text-lg text-legacy-green">{emp.lastName}, {emp.firstName}</td>
                <td className="p-4">{emp.designation}</td>
                <td className="p-4"><span className="bg-gray-100 px-2 py-1 text-xs uppercase tracking-wide border border-gray-200">{emp.department}</span></td>
                <td className="p-4 text-right font-mono text-legacy-green">${emp.currentSalary.toLocaleString()}</td>
                <td className="p-4 text-center flex items-center justify-center gap-3">
                  <Link to={`/employee/${emp._id}`} className="text-xs font-bold text-legacy-green border-b border-legacy-green hover:text-legacy-gold transition uppercase mr-2">Profile</Link>
                  <button onClick={() => openEditModal(emp)} className="text-gray-400 hover:text-legacy-gold transition cursor-pointer"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(emp._id, emp.lastName)} className="text-gray-400 hover:text-red-500 transition cursor-pointer"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 w-500px shadow-2xl border-t-4 border-legacy-gold">
            <h3 className="font-serif text-2xl text-legacy-green mb-6">{isEditing ? 'Update Record' : 'Onboard Talent'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First Name" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-legacy-green" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                <input placeholder="Last Name" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-legacy-green" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              </div>
              <input placeholder="Email" type="email" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-legacy-green" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Designation" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-legacy-green" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required />
                <input placeholder="Department" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-legacy-green" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
              </div>
              <input placeholder="Base Salary ($)" type="number" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-legacy-green" value={formData.currentSalary} onChange={e => setFormData({...formData, currentSalary: e.target.value})} required />
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-500 hover:text-red-500 cursor-pointer text-sm">Cancel</button>
                <button type="submit" className="bg-legacy-green text-white px-8 py-2 uppercase tracking-widest text-xs hover:bg-legacy-gold transition cursor-pointer font-bold">{isEditing ? 'Save Changes' : 'Confirm Hire'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personnel;
