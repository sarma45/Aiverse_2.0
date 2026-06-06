'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import MagneticButton from '@/components/ui/MagneticButton';
import axios from 'axios';
import { LayoutDashboard, Eye, MousePointer2, MessageSquare, Plus, Zap } from 'lucide-react';
import RevenueChart from '@/components/analytics/RevenueChart';

interface Tool {
  _id: string;
  name: string;
  category: string;
  views: number;
  clicks: number;
  avgRating: number;
  isFeatured: boolean;
  isVerified: boolean;
}

export default function CreatorDashboard() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [stats, setStats] = useState({ totalViews: 0, totalClicks: 0, totalTools: 0 });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');
      try {
        const res = await axios.get(`/api/creator/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTools(res.data.data.tools);
        setStats(res.data.data.stats);
        setRevenueData(res.data.data.revenueData);
      } catch (err) {
        console.error('Creator stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10 pt-32">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <LayoutDashboard color="white" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Creator Hub</h1>
          </div>
          <MagneticButton 
            onClick={() => router.push('/submit-tool')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20"
          >
             <Plus size={20} /> Submit New Tool
          </MagneticButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
           <div className="lg:col-span-2">
              <RevenueChart data={revenueData} />
           </div>
           <div className="space-y-6">
              <StatCard icon={<Eye className="text-blue-400" />} label="Total Views" value={stats.totalViews} />
              <StatCard icon={<MousePointer2 className="text-green-400" />} label="Total Clicks" value={stats.totalClicks} />
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
          <div className="p-8 border-b border-white/10">
            <h3 className="text-2xl font-bold uppercase tracking-tight">Your AI Arsenal</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest opacity-40">Tool</th>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest opacity-40">Analytics</th>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest opacity-40">Status</th>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest opacity-40 text-right">Boost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tools.map((tool) => (
                <tr key={tool._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="font-bold text-lg mb-1">{tool.name}</div>
                    <div className="text-[10px] opacity-40 uppercase font-black tracking-widest">{tool.category}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Eye size={14} className="opacity-40" /> {tool.views}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <MousePointer2 size={14} className="opacity-40" /> {tool.clicks}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    {tool.isVerified ? (
                      <span className="bg-green-400/10 text-green-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">LIVE</span>
                    ) : (
                      <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">PENDING</span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    {tool.isFeatured ? (
                      <span className="inline-flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest">
                        <Zap size={16} fill="currentColor" /> Featured
                      </span>
                    ) : (
                      <button className="text-[10px] font-black uppercase tracking-widest bg-indigo-600/10 text-indigo-400 px-4 py-2 rounded-lg hover:bg-indigo-600/20 transition-all border border-indigo-500/20">
                        <Zap size={12} /> Boost (₹499)
                      </button>
                    )}
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
  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:border-indigo-500/20 transition-all group">
    <div className="flex items-center justify-between mb-4">
       <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</div>
       <div className="bg-white/5 p-2 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
    </div>
    <div className="text-4xl font-black">{value}</div>
  </div>
);
