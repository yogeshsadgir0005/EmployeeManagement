import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, BookOpen, Gift, Trash2, Edit2, Save, X } from 'lucide-react';
import Toast from '../components/Toast';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [activeTab, setActiveTab] = useState('salary'); 
  const [toast, setToast] = useState(null);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({});

  const [editingSalaryId, setEditingSalaryId] = useState(null);
  const [editingTrainingId, setEditingTrainingId] = useState(null);
  const [editingRewardId, setEditingRewardId] = useState(null);

  const [hikeForm, setHikeForm] = useState({ amount: '', reason: '' });
  const [trainForm, setTrainForm] = useState({ title: '', cost: '' });
  const [rewardForm, setRewardForm] = useState({ title: '', giftValue: '', notes: '' });

  useEffect(() => { fetchEmp(); }, []);

  useEffect(() => {
    setEditingSalaryId(null);
    setEditingTrainingId(null);
    setEditingRewardId(null);
    setHikeForm({ amount: '', reason: '' });
    setTrainForm({ title: '', cost: '' });
    setRewardForm({ title: '', giftValue: '', notes: '' });
  }, [activeTab]);

  const fetchEmp = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
      setEmp(res.data);
      setEditProfileForm(res.data);
    } catch (err) { console.error(err); }
  };

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  const handleUpdateProfile = async () => {
    await axios.put(`http://localhost:5000/api/employees/${id}`, editProfileForm);
    setIsEditingProfile(false);
    fetchEmp();
    showToast('Profile updated successfully');
  };

  const handleDeleteEmployee = async () => {
    if(confirm("Terminate this employee record permanently?")) {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      navigate('/');
    }
  };

  const handleSubDocSubmit = async (type, form, setForm, editId, setEditId, urlSuffix) => {
    try {
      const payload = { ...form };
      if (type === 'training') payload.completionDate = new Date();
      if (type === 'reward') payload.dateGiven = new Date();

      if (editId) {
        await axios.put(`http://localhost:5000/api/employees/${id}/${urlSuffix}/${editId}`, payload);
        showToast('Record updated');
      } else {
        await axios.post(`http://localhost:5000/api/employees/${id}/${urlSuffix}`, payload);
        showToast('New entry added');
      }
      setEditId(null);
      if(type === 'salary') setForm({ amount: '', reason: '' });
      if(type === 'training') setForm({ title: '', cost: '' });
      if(type === 'reward') setForm({ title: '', giftValue: '', notes: '' });
      fetchEmp();
    } catch (err) {
      showToast('Operation failed', 'error');
    }
  };

  const loadForEdit = (rec, type) => {
    if (type === 'salary') { setHikeForm({ amount: rec.amount, reason: rec.reason }); setEditingSalaryId(rec._id); }
    if (type === 'training') { setTrainForm({ title: rec.title, cost: rec.cost }); setEditingTrainingId(rec._id); }
    if (type === 'reward') { setRewardForm({ title: rec.title, giftValue: rec.giftValue, notes: rec.notes || '' }); setEditingRewardId(rec._id); }
  };

  const deleteSubDoc = async (recordId, urlSuffix) => {
    if(confirm("Are you sure?")) {
      await axios.delete(`http://localhost:5000/api/employees/${id}/${urlSuffix}/${recordId}`);
      fetchEmp();
      showToast('Record deleted');
    }
  };

  if (!emp) return <div className="p-10 flex items-center justify-center min-h-screen text-gray-500 animate-pulse">Retrieving Record...</div>;

  return (
    <div className="pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header className="flex justify-between items-end mb-16 animate-fade-in">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-legacy-gold"></span>
            {/* Darkened Label */}
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Personnel Record</h2>
          </div>
          
          {isEditingProfile ? (
            <div className="bg-white p-6 shadow-premium rounded-sm border-l-4 border-legacy-gold w-full max-w-2xl animate-fade-in">
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">First Name</label>
                    <input className="w-full border-b border-gray-200 py-2 font-serif text-2xl text-legacy-green focus:outline-none focus:border-legacy-green transition-colors bg-transparent" value={editProfileForm.firstName} onChange={e => setEditProfileForm({...editProfileForm, firstName: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Last Name</label>
                    <input className="w-full border-b border-gray-200 py-2 font-serif text-2xl text-legacy-green focus:outline-none focus:border-legacy-green transition-colors bg-transparent" value={editProfileForm.lastName} onChange={e => setEditProfileForm({...editProfileForm, lastName: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-legacy-green bg-transparent text-gray-700" value={editProfileForm.designation} onChange={e => setEditProfileForm({...editProfileForm, designation: e.target.value})} />
                <input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-legacy-green bg-transparent text-gray-700" value={editProfileForm.department} onChange={e => setEditProfileForm({...editProfileForm, department: e.target.value})} />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 text-xs uppercase tracking-widest text-gray-500 hover:text-gray-800 transition">Cancel</button>
                <button onClick={handleUpdateProfile} className="bg-legacy-green text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-black transition shadow-lg">Save Changes</button>
              </div>
            </div>
          ) : (
            <div>
              {/* Darkened Name Color */}
              <h1 className="text-6xl font-serif text-legacy-green tracking-tight">{emp.lastName}, <span className="text-gray-500">{emp.firstName}</span></h1>
              <div className="flex items-center gap-4 mt-4 text-sm font-bold tracking-wide text-gray-600 uppercase">
                <span>{emp.designation}</span>
                <span className="w-1 h-1 bg-legacy-gold rounded-full"></span>
                <span>{emp.department}</span>
                <button onClick={() => setIsEditingProfile(true)} className="ml-4 text-legacy-gold hover:text-legacy-green transition opacity-50 hover:opacity-100">
                  <Edit2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-right">
           <button onClick={handleDeleteEmployee} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-700 transition-colors">
              <span>Terminate</span>
              <Trash2 size={14} className="group-hover:scale-110 transition-transform"/>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-4 space-y-8">
           <div className="sticky top-10">
            <div key={activeTab} className="bg-white p-8 shadow-premium rounded-sm relative overflow-hidden animate-page-enter">
                <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-500 ${
                    activeTab === 'salary' ? 'bg-legacy-gold' : 
                    activeTab === 'training' ? 'bg-emerald-600' : 'bg-indigo-500'
                }`}></div>
                
                <h3 className="font-serif text-2xl text-legacy-green mb-8 flex items-center gap-3">
                  {activeTab === 'salary' && <TrendingUp size={20} className="text-legacy-gold"/>}
                  {activeTab === 'training' && <BookOpen size={20} className="text-emerald-600"/>}
                  {activeTab === 'rewards' && <Gift size={20} className="text-indigo-500"/>}
                  {activeTab === 'salary' ? 'Compensation' : activeTab === 'training' ? 'Training Log' : 'Rewards'}
                </h3>

                {activeTab === 'salary' && !editingSalaryId && (
                    <div className="mb-8 p-4 bg-legacy-cream border border-gray-200 rounded-sm">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Current Base</p>
                        <p className="text-4xl font-serif text-legacy-green">${emp.currentSalary.toLocaleString()}</p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* INPUT LABELS DARKENED TO gray-500 */}
                    {activeTab === 'salary' && (
                        <>
                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 group-focus-within:text-legacy-green transition-colors">New Amount</label>
                                <input type="number" className="w-full border-b border-gray-300 py-2 text-lg focus:outline-none focus:border-legacy-green bg-transparent transition-colors text-gray-800" 
                                    value={hikeForm.amount} onChange={e => setHikeForm({...hikeForm, amount: e.target.value})} placeholder="0.00" />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 group-focus-within:text-legacy-green transition-colors">Reason</label>
                                <input type="text" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-legacy-green bg-transparent transition-colors text-gray-800" 
                                    value={hikeForm.reason} onChange={e => setHikeForm({...hikeForm, reason: e.target.value})} placeholder="e.g. Annual Appraisal" />
                            </div>
                            <button onClick={() => handleSubDocSubmit('salary', hikeForm, setHikeForm, editingSalaryId, setEditingSalaryId, 'hike')} 
                                className="w-full mt-4 bg-legacy-green text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-black transition-colors shadow-lg font-bold">
                                {editingSalaryId ? 'Update Record' : 'Process Hike'}
                            </button>
                        </>
                    )}

                    {activeTab === 'training' && (
                        <>
                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 group-focus-within:text-legacy-green transition-colors">Module Title</label>
                                <input type="text" className="w-full border-b border-gray-300 py-2 text-lg focus:outline-none focus:border-legacy-green bg-transparent transition-colors text-gray-800" 
                                    value={trainForm.title} onChange={e => setTrainForm({...trainForm, title: e.target.value})} />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 group-focus-within:text-legacy-green transition-colors">Cost ($)</label>
                                <input type="number" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-legacy-green bg-transparent transition-colors text-gray-800" 
                                    value={trainForm.cost} onChange={e => setTrainForm({...trainForm, cost: e.target.value})} />
                            </div>
                             <button onClick={() => handleSubDocSubmit('training', trainForm, setTrainForm, editingTrainingId, setEditingTrainingId, 'training')} 
                                className="w-full mt-4 bg-white border border-gray-300 text-legacy-green py-4 text-xs uppercase tracking-[0.2em] hover:border-legacy-green transition-colors font-bold">
                                {editingTrainingId ? 'Save Changes' : 'Log Training'}
                            </button>
                        </>
                    )}

                    {activeTab === 'rewards' && (
                        <>
                           <div className="group">
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 group-focus-within:text-legacy-green transition-colors">Reward Title</label>
                                <input type="text" className="w-full border-b border-gray-300 py-2 text-lg focus:outline-none focus:border-legacy-green bg-transparent transition-colors text-gray-800" 
                                    value={rewardForm.title} onChange={e => setRewardForm({...rewardForm, title: e.target.value})} />
                            </div>
                             <div className="group">
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 group-focus-within:text-legacy-green transition-colors">Value ($)</label>
                                <input type="number" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-legacy-green bg-transparent transition-colors text-gray-800" 
                                    value={rewardForm.giftValue} onChange={e => setRewardForm({...rewardForm, giftValue: e.target.value})} />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 group-focus-within:text-legacy-green transition-colors">Notes</label>
                                <input type="text" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-legacy-green bg-transparent transition-colors text-gray-800" 
                                    value={rewardForm.notes} onChange={e => setRewardForm({...rewardForm, notes: e.target.value})} />
                            </div>
                             <button onClick={() => handleSubDocSubmit('reward', rewardForm, setRewardForm, editingRewardId, setEditingRewardId, 'reward')} 
                                className="w-full mt-4 bg-linear-to-r from-indigo-500 to-purple-600 text-white py-4 text-xs uppercase tracking-[0.2em] hover:shadow-lg transition-all font-bold">
                                {editingRewardId ? 'Update Gift' : 'Issue Reward'}
                            </button>
                        </>
                    )}
                </div>
              </div>
           </div>
        </div>

        <div className="col-span-8">
           <div className="flex gap-8 mb-10 border-b border-gray-200 pb-1">
              {['salary', 'training', 'rewards'].map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab)} 
                    /* TABS DARKENED TO text-gray-400/600 */
                    className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 relative ${
                       activeTab === tab ? 'text-legacy-green' : 'text-gray-400 hover:text-gray-600'
                    }`}>
                    {tab} History
                    <span className={`absolute bottom-0 left-0 w-full h-2px bg-legacy-green transition-transform duration-300 origin-left ${
                        activeTab === tab ? 'scale-x-100' : 'scale-x-0'
                    }`}></span>
                 </button>
              ))}
           </div>

           <div className="bg-white min-h-400px animate-fade-in">
              {/* TABLE HEADERS DARKENED TO text-gray-600 */}
              <div className="grid grid-cols-12 pb-4 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                  <div className="col-span-3">Date</div>
                  <div className="col-span-5">{activeTab === 'salary' ? 'Reason' : activeTab === 'training' ? 'Module' : 'Item'}</div>
                  <div className="col-span-3 text-right">{activeTab === 'rewards' ? 'Value' : activeTab === 'training' ? 'Cost' : 'Amount'}</div>
                  <div className="col-span-1"></div>
              </div>

              <div className="space-y-4 mt-6">
                 {activeTab === 'salary' && emp.salaryHistory.slice().reverse().map(rec => (
                     <Row key={rec._id} date={rec.effectiveDate} title={rec.reason} amount={rec.amount} 
                        onEdit={() => loadForEdit(rec, 'salary')} onDelete={() => deleteSubDoc(rec._id, 'hike')} />
                 ))}
                 {activeTab === 'training' && emp.trainingHistory.map(rec => (
                     <Row key={rec._id} date={rec.completionDate} title={rec.title} amount={rec.cost} 
                        onEdit={() => loadForEdit(rec, 'training')} onDelete={() => deleteSubDoc(rec._id, 'training')} />
                 ))}
                 {activeTab === 'rewards' && emp.rewards.map(rec => (
                     <Row key={rec._id} date={rec.dateGiven} title={rec.title} amount={rec.giftValue} subtitle={rec.notes}
                        onEdit={() => loadForEdit(rec, 'reward')} onDelete={() => deleteSubDoc(rec._id, 'reward')} />
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ date, title, amount, subtitle, onEdit, onDelete }) => (
    <div className="group grid grid-cols-12 py-4 border-b border-gray-100 hover:bg-gray-50/80 transition-colors items-center">
        {/* ROW TEXT DARKENED TO text-gray-600 */}
        <div className="col-span-3 text-sm text-gray-600 font-mono">{new Date(date).toLocaleDateString()}</div>
        <div className="col-span-5">
            <p className="text-sm font-bold text-legacy-green">{title}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1 italic">{subtitle}</p>}
        </div>
        <div className="col-span-3 text-right font-serif text-lg text-legacy-green">
            ${amount.toLocaleString()}
        </div>
        <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="text-gray-400 hover:text-legacy-gold transition"><Edit2 size={12}/></button>
            <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition"><Trash2 size={12}/></button>
        </div>
    </div>
);

export default EmployeeDetails;