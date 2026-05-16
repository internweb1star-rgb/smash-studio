import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import api from '../api/axios';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/contact/analytics');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">...</div>;

  const cards = [
    { name: 'Total Inquiries', value: stats?.totalInquiries || 0, icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'New Leads', value: stats?.newInquiries || 0, icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
    { name: 'System Load', value: 'Low', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Avg. Response', value: '2.4h', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  return (
    <div className="space-y-8">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="glass-card p-6 relative group overflow-hidden">
            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              <card.icon className={card.color} size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-sm font-medium">{card.name}</span>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-white">{card.value}</span>
                <span className="text-green-400 text-xs flex items-center mb-1">
                  <ArrowUpRight size={14} /> +12%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Transmission Velocity</h3>
            <select className="bg-dark/50 border border-white/10 rounded-lg text-xs px-3 py-1 text-slate-400">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.recentLeads || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#35A8F2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#35A8F2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="_id" 
                  stroke="#475569" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#35A8F2' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#35A8F2" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-primary shrink-0">
                  <Activity size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm text-slate-200 truncate">New inquiry from <b>Nexus Corp</b></p>
                  <span className="text-xs text-slate-500">2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 text-xs font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors uppercase tracking-widest">
            View Protocol Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
