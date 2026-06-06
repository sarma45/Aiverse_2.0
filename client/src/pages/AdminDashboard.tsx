import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { Shield, Check, X, Trash2, ExternalLink, IndianRupee, Users, Zap, TrendingUp, CreditCard } from 'lucide-react';

interface Tool {
  _id: string;
  name: string;
  category: string;
  isVerified: boolean;
  url: string;
}

const AdminDashboard = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTools = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_BASE}/tools`, {
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
      const res = await axios.get(`${API_BASE}/admin/stats`, {
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
      await axios.patch(`${API_BASE}/tools/${id}`, { isVerified: status }, {
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
      await axios.delete(`${API_BASE}/tools/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTools();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="p-20 text-center text-white">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-dark p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Shield color="white" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Admin Control Center</h1>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard icon={<IndianRupee className="text-green-500" />} label="Total Revenue" value={`₹${stats.totalRevenue}`} />
            <StatCard icon={<Users className="text-blue-500" />} label="Total Users" value={stats.totalUsers} />
            <StatCard icon={<TrendingUp className="text-primary" />} label="Pro Subs" value={stats.proUsers} />
            <StatCard icon={<Zap className="text-yellow-500" />} label="Featured Tools" value={stats.featuredTools} />
          </div>
        )}

        <div className="glass-morphism rounded-[2rem] overflow-hidden border border-glass-border">
          <table className="w-full text-left">
            <thead className="bg-glass-border">
              <tr>
                <th className="p-6 font-bold uppercase text-xs opacity-60">Tool Name</th>
                <th className="p-6 font-bold uppercase text-xs opacity-60">Category</th>
                <th className="p-6 font-bold uppercase text-xs opacity-60">Status</th>
                <th className="p-6 font-bold uppercase text-xs opacity-60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {tools.map((tool) => (
                <tr key={tool._id} className="hover:bg-glass/10 transition-colors">
                  <td className="p-6 font-bold">{tool.name}</td>
                  <td className="p-6 opacity-60 uppercase text-sm">{tool.category}</td>
                  <td className="p-6">
                    {tool.isVerified ? (
                      <span className="flex items-center gap-1 text-green-500 font-bold text-sm">
                        <Check size={14} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                        <X size={14} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleVerify(tool._id, !tool.isVerified)}
                        className={`p-2 rounded-lg transition-colors ${tool.isVerified ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                        title={tool.isVerified ? 'Unverify' : 'Verify'}
                      >
                        {tool.isVerified ? <X size={18} /> : <Check size={18} />}
                      </button>
                      <a 
                        href={tool.url} target="_blank" rel="noopener noreferrer"
                        className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                        title="Visit"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <button 
                        onClick={() => handleDelete(tool._id)}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
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
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="glass-morphism p-8 rounded-[2rem] border border-glass-border">
    <div className="mb-4 bg-glass p-3 w-fit rounded-xl">{icon}</div>
    <div className="text-sm font-bold uppercase tracking-widest opacity-40 mb-1">{label}</div>
    <div className="text-3xl font-black">{value}</div>
  </div>
);

export default AdminDashboard;
