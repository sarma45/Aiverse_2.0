'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import { Shield, Check, X, Trash2, ExternalLink, IndianRupee, Users, Zap, TrendingUp } from 'lucide-react';

interface Tool {
  _id: string;
  name: string;
  category: string;
  isVerified: boolean;
  url: string;
}

export default function AdminDashboard() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTools = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`/api/tools`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTools(res.data.data.tools);
    } catch (err) {
      console.error('Admin fetch error:', err);
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.data.stats);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchTools(), fetchStats()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleVerify = async (id: string, status: boolean) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`/api/tools/${id}`, { isVerified: status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTools();
    } catch (err) {
      alert('Verification failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/tools/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTools();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10 pt-32">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Shield color="white" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Admin Control Center</h1>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard icon={<IndianRupee className="text-green-400" />} label="Total Revenue" value={`₹${stats.totalRevenue}`} />
            <StatCard icon={<Users className="text-blue-400" />} label="Total Users" value={stats.totalUsers} />
            <StatCard icon={<TrendingUp className="text-indigo-400" />} label="Pro Subs" value={stats.proUsers} />
            <StatCard icon={<Zap className="text-yellow-400" />} label="Featured Tools" value={stats.featuredTools} />
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest opacity-40">Tool Name</th>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest opacity-40">Category</th>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest opacity-40">Status</th>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest opacity-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tools.map((tool) => (
                <tr key={tool._id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-6 font-bold text-lg">{tool.name}</td>
                  <td className="p-6 opacity-40 uppercase text-xs font-black tracking-widest">{tool.category}</td>
                  <td className="p-6">
                    {tool.isVerified ? (
                      <span className="flex items-center gap-1 text-green-400 font-bold text-xs uppercase tracking-widest">
                        <Check size={14} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-400 font-bold text-xs uppercase tracking-widest">
                        <X size={14} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex gap-3 justify-end">
                      <button 
                        onClick={() => handleVerify(tool._id, !tool.isVerified)}
                        className={`p-3 rounded-xl transition-all active:scale-90 ${tool.isVerified ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20' : 'bg-green-400/10 text-green-400 hover:bg-green-400/20'}`}
                        title={tool.isVerified ? 'Unverify' : 'Verify'}
                      >
                        {tool.isVerified ? <X size={18} /> : <Check size={18} />}
                      </button>
                      <a 
                        href={tool.url} target="_blank" rel="noopener noreferrer"
                        className="p-3 bg-blue-400/10 text-blue-400 rounded-xl hover:bg-blue-400/20 transition-all active:scale-90"
                        title="Visit"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <button 
                        onClick={() => handleDelete(tool._id)}
                        className="p-3 bg-red-400/10 text-red-400 rounded-xl hover:bg-red-400/20 transition-all active:scale-90"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl hover:border-indigo-500/20 transition-colors">
    <div className="mb-4 bg-white/5 p-3 w-fit rounded-xl border border-white/5">{icon}</div>
    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</div>
    <div className="text-3xl font-black">{value}</div>
  </div>
);
