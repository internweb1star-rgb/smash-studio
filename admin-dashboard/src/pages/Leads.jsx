import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  MoreHorizontal,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Ban,
  Trash2
} from 'lucide-react';
import api from '../api/axios';
import { cn } from '../lib/utils';

const Leads = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contact/all', {
        params: { page, limit: 10, status: statusFilter, search }
      });
      setInquiries(res.data.data.inquiries);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error('Fetch inquiries failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [page, statusFilter, search]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/contact/${id}`, { status });
      fetchInquiries();
    } catch (err) {
      console.error('Update status failed', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('PROTOCOL ALERT: Are you sure you want to permanently purge this transmission? This cannot be undone.')) return;
    try {
      await api.delete(`/contact/${id}`);
      fetchInquiries();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Contacted': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Closed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Spam': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 glass-card p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark/40 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-500 shrink-0" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none bg-dark/40 border border-white/5 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary/50"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
              <option value="Spam">Spam</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 uppercase font-mono text-[11px] tracking-widest text-slate-500">
                <th className="px-6 py-4 font-semibold">Lead Identity</th>
                <th className="px-6 py-4 font-semibold">Requirement Details</th>
                <th className="px-6 py-4 font-semibold">Classification</th>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Protocol Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500 animate-pulse">Scanning database...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No transmissions found matching parameters.</td></tr>
              ) : (
                inquiries.map((item) => (
                  <tr key={item._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{item.name}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Mail size={12} /> {item.email}
                        </span>
                        {item.domain && (
                          <span className="text-[10px] uppercase font-mono text-primary/70 mt-1">{item.domain}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-400 line-clamp-2 max-w-md">{item.message}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStatusStyle(item.status)
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 mt-1">
                          <Clock size={12} /> {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button 
                          title="Mark Contacted"
                          onClick={() => updateStatus(item._id, 'Contacted')}
                          className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-slate-500 hover:text-purple-400 transition-all"
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button 
                          title="Mark Closed"
                          onClick={() => updateStatus(item._id, 'Closed')}
                          className="p-2 rounded-lg bg-white/5 hover:bg-green-500/20 text-slate-500 hover:text-green-400 transition-all"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button 
                          title="Mark Spam"
                          onClick={() => updateStatus(item._id, 'Spam')}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                        >
                          <Ban size={16} />
                        </button>
                        <button 
                          title="Purge Record"
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-600/20 text-slate-500 hover:text-red-500 transition-all ml-2 border-l border-white/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-mono">
            DISPLAYING {inquiries.length} OF {totalPages * 10} RECORDS
          </p>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-xs font-bold disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              PREVIOUS
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-xs font-bold disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;
