import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Trash2, 
  Send,
  Loader2
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Team = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { user: currentUser } = useAuth();

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/admin/invite', { name, email, role });
      setMessage({ type: 'success', text: `Invitation sent to ${email} successfully.` });
      setName('');
      setEmail('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send invitation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 glass-card border-red-500/20">
        <ShieldAlert size={64} className="text-red-500 mb-6 animate-pulse" />
        <h2 className="text-2xl font-bold text-white mb-2">ACCESS RESTRICTED</h2>
        <p className="text-slate-500 max-w-md">Your authorization level is insufficient to access the Personnel Management module. Protocol requires Super Admin clearance.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* INVITE FORM */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Issue Personnel Invitation</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Authorized Deployment Only</p>
          </div>
        </div>

        <form onSubmit={handleInvite} className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 ml-1">Full Identity Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Chen"
              className="w-full bg-dark/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 ml-1">Secure Contact Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@smashstudio.co"
              className="w-full bg-dark/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 ml-1">Authorization Clearance</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-dark/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-primary/50"
            >
              <option value="admin">Admin (System Operations)</option>
              <option value="editor">Editor (CMS Management Only)</option>
              <option value="super_admin">Super Admin (Full Root Access)</option>
            </select>
          </div>

          {message.text && (
            <div className={`px-4 py-3 rounded-xl text-sm flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${message.type === 'success' ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              {message.text}
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-dark font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(53,168,242,0.2)] hover:shadow-[0_0_25px_rgba(53,168,242,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} />}
            Transmit Invitation Token
          </button>
        </form>
      </div>

      {/* TEAM OVERVIEW */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-2">Team Architecture</h3>
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-8">Active Personnel Directory</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                {currentUser?.name?.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{currentUser?.name} (You)</span>
                <span className="text-[10px] text-slate-500 font-mono">{currentUser?.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">{currentUser?.role}</span>
            </div>
          </div>
          
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-xs text-slate-600 uppercase tracking-widest font-mono">No other synchronized operators found.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
