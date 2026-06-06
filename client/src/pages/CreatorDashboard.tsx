import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';
import { LayoutDashboard, BarChart3, Eye, MousePointer2, MessageSquare, Plus, ExternalLink, Zap } from 'lucide-react';

interface Tool {
  _id: string;
  name: string;
  category: string;
  views: number;
  clicks: number;
  avgRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isVerified: boolean;
}

const CreatorDashboard = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTools = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/tools/creator`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTools(res.data.data.tools);
    } catch (err) {
      console.error('Creator fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureTool = async (toolId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // 1. Create Order
      const orderRes = await axios.post(`${API_BASE}/payments/order`, { amount: 499 }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const options = {
        key: 'rzp_test_mock', // Use env in production
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'AIVERSE Intelligence',
        description: 'Featured Tool Promotion',
        order_id: orderRes.data.id,
        handler: async (response: any) => {
          try {
            // 2. Verify Payment and Update Tool Status
            await axios.post(`${API_BASE}/payments/verify`, {
              ...response,
              toolId // Pass toolId to tell backend which tool to feature
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            alert('Congratulations! Your tool is now featured.');
            fetchTools(); // Refresh stats
          } catch (err) {
            alert('Payment Verification Failed');
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').name,
          email: JSON.parse(localStorage.getItem('user') || '{}').email,
        },
        theme: { color: '#6366f1' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment Error:', err);
      alert('Could not initialize payment. Please try again.');
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const totalViews = tools.reduce((acc, t) => acc + t.views, 0);
  const totalClicks = tools.reduce((acc, t) => acc + t.clicks, 0);

  if (loading) return <div className="p-20 text-center text-white">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-dark p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <LayoutDashboard color="white" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Creator Hub</h1>
          </div>
          <button 
            onClick={() => navigate('/submit-tool')}
            className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl font-bold"
          >
            <Plus size={20} /> Submit New Tool
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Eye className="text-blue-500" />} label="Total Views" value={totalViews} />
          <StatCard icon={<MousePointer2 className="text-green-500" />} label="Total Clicks" value={totalClicks} />
          <StatCard icon={<MessageSquare className="text-yellow-500" />} label="Avg Rating" value={(tools.reduce((acc, t) => acc + t.avgRating, 0) / (tools.length || 1)).toFixed(1)} />
          <StatCard icon={<Zap className="text-primary" />} label="Tools Live" value={tools.length} />
        </div>

        <div className="glass-morphism rounded-[2rem] overflow-hidden border border-glass-border">
          <div className="p-8 border-b border-glass-border">
            <h3 className="text-2xl font-bold">Your AI Arsenal</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-glass-border">
              <tr>
                <th className="p-6 font-bold uppercase text-xs opacity-60">Tool</th>
                <th className="p-6 font-bold uppercase text-xs opacity-60">Analytics</th>
                <th className="p-6 font-bold uppercase text-xs opacity-60">Status</th>
                <th className="p-6 font-bold uppercase text-xs opacity-60">Revenue Boost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {tools.length > 0 ? tools.map((tool) => (
                <tr key={tool._id} className="hover:bg-glass/10 transition-colors">
                  <td className="p-6">
                    <div className="font-bold text-lg mb-1">{tool.name}</div>
                    <div className="text-xs opacity-40 uppercase tracking-widest">{tool.category}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Eye size={14} className="opacity-40" /> {tool.views}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MousePointer2 size={14} className="opacity-40" /> {tool.clicks}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-yellow-500">
                        <MessageSquare size={14} fill="currentColor" /> {tool.avgRating.toFixed(1)}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    {tool.isVerified ? (
                      <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold">LIVE</span>
                    ) : (
                      <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold">PENDING</span>
                    )}
                  </td>
                  <td className="p-6">
                    {tool.isFeatured ? (
                      <span className="flex items-center gap-2 text-primary font-bold">
                        <Zap size={16} fill="currentColor" /> Featured
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleFeatureTool(tool._id)}
                        className="text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2"
                      >
                        <Zap size={14} /> Feature this Tool (₹499)
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center opacity-40">
                    No tools submitted yet. Start your journey as an AI creator today!
                  </td>
                </tr>
              )}
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

export default CreatorDashboard;
