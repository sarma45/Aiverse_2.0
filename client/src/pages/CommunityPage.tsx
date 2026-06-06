import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { MessageSquare, Users, TrendingUp, Search, Plus, User, Calendar, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Thread {
  _id: string;
  title: string;
  content: string;
  author: { name: string };
  category: string;
  views: number;
  createdAt: string;
}

const CommunityPage = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/community/threads`, {
          params: category !== 'all' ? { category } : {}
        });
        setThreads(res.data.data.threads);
      } catch (err) {
        console.error('Community fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, [category]);

  return (
    <div className="min-h-screen bg-dark py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter">
              AI <span className="text-gradient">Community</span>
            </h1>
            <p className="text-xl text-text-muted">The nexus for AI enthusiasts, researchers, and creators.</p>
          </div>
          <button 
            onClick={() => navigate('/community/new')}
            className="btn-primary flex items-center gap-2 px-10 py-5 rounded-2xl font-black text-lg shadow-xl"
          >
            <Plus size={24} /> Start Discussion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-morphism p-8 rounded-[2.5rem] border border-glass-border">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-primary" /> Categories
              </h3>
              <div className="space-y-2">
                {['all', 'general', 'tools', 'agents', 'workflows', 'news', 'showcase'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-6 py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${category === cat ? 'bg-primary text-white shadow-lg' : 'bg-glass-border hover:bg-white/10 opacity-60'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-morphism p-8 rounded-[2.5rem] border border-glass-border">
              <h3 className="text-xl font-bold mb-4">Stats</h3>
              <div className="flex justify-between items-center py-4 border-b border-glass-border">
                <span className="opacity-60 text-sm">Active Users</span>
                <span className="font-black text-primary">12.4k</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-glass-border">
                <span className="opacity-60 text-sm">Threads</span>
                <span className="font-black text-primary">{threads.length}+</span>
              </div>
            </div>
          </div>

          {/* Discussion List */}
          <div className="lg:col-span-3 space-y-6">
             {loading ? (
               <div className="text-center py-20 animate-pulse">
                 <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                 <p className="text-text-muted">Syncing with the hive mind...</p>
               </div>
             ) : threads.length > 0 ? (
               threads.map((thread) => (
                 <div 
                   key={thread._id} 
                   onClick={() => navigate(`/community/thread/${thread._id}`)}
                   className="glass-morphism p-8 rounded-[2.5rem] border border-glass-border hover:border-primary/50 transition-all group cursor-pointer"
                 >
                   <div className="flex justify-between items-start mb-4">
                     <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                       {thread.category}
                     </span>
                     <div className="flex items-center gap-4 text-xs opacity-40">
                       <span className="flex items-center gap-1"><Eye size={14} /> {thread.views}</span>
                       <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(thread.createdAt).toLocaleDateString()}</span>
                     </div>
                   </div>
                   <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{thread.title}</h3>
                   <p className="text-text-muted line-clamp-2 leading-relaxed mb-6">{thread.content}</p>
                   
                   <div className="flex items-center justify-between border-t border-glass-border pt-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-glass-border rounded-full flex items-center justify-center">
                          <User size={20} className="opacity-40" />
                        </div>
                        <span className="font-bold text-sm">{thread.author.name}</span>
                     </div>
                     <button className="flex items-center gap-2 text-primary font-bold text-sm">
                       Join Discussion <Plus size={18} />
                     </button>
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-40 bg-glass rounded-[4rem] border border-dashed border-glass-border">
                 <MessageSquare className="mx-auto mb-6 opacity-20" size={64} />
                 <p className="text-xl text-text-muted">No discussions found in this category.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
