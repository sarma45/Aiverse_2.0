'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, TrendingUp, Plus, User, Calendar, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

interface Thread {
  _id: string;
  title: string;
  content: string;
  author: { name: string };
  category: string;
  views: number;
  createdAt: string;
}

export default function CommunityPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/community/threads`, {
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
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter">
              AI <span className="text-indigo-500">Community</span>
            </h1>
            <p className="text-xl text-white/60">The nexus for AI enthusiasts, researchers, and creators.</p>
          </div>
          <button 
            onClick={() => router.push('/community/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={24} /> Start Discussion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-indigo-500" /> Categories
              </h3>
              <div className="space-y-2">
                {['all', 'general', 'tools', 'agents', 'workflows', 'news', 'showcase'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-6 py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${category === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Discussion List */}
          <div className="lg:col-span-3 space-y-6">
             {loading ? (
               <div className="text-center py-20 animate-pulse">
                 <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                 <p className="text-white/40">Syncing with the hive mind...</p>
               </div>
             ) : threads.length > 0 ? (
               threads.map((thread) => (
                 <div 
                   key={thread._id} 
                   onClick={() => router.push(`/community/thread/${thread._id}`)}
                   className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:border-indigo-500/50 transition-all group cursor-pointer backdrop-blur-xl"
                 >
                   <div className="flex justify-between items-start mb-4">
                     <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                       {thread.category}
                     </span>
                     <div className="flex items-center gap-4 text-xs opacity-40">
                       <span className="flex items-center gap-1"><Eye size={14} /> {thread.views}</span>
                       <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(thread.createdAt).toLocaleDateString()}</span>
                     </div>
                   </div>
                   <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-400 transition-colors">{thread.title}</h3>
                   <p className="text-white/60 line-clamp-2 leading-relaxed mb-6">{thread.content}</p>
                   
                   <div className="flex items-center justify-between border-t border-white/10 pt-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                          <User size={20} className="opacity-40" />
                        </div>
                        <span className="font-bold text-sm">{thread.author.name}</span>
                     </div>
                     <button className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                       Join Discussion <Plus size={18} />
                     </button>
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10 backdrop-blur-xl">
                 <MessageSquare className="mx-auto mb-6 opacity-20" size={64} />
                 <p className="text-xl text-white/40">No discussions found in this category.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
