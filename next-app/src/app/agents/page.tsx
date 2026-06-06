'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bot, Search, Filter, Star, Zap, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

interface Agent {
  _id: string;
  name: string;
  description: string;
  category: string;
  avgRating: number;
  isPremium: boolean;
  capabilities: string[];
}

export default function AgentsMarketplace() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchAgents = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/agents`, { params: { search } });
      setAgents(res.data.data.agents);
    } catch (err) {
      console.error('Agents fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAgents(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
            Agent <span className="text-indigo-500">Marketplace</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Discover and deploy specialized autonomous AI agents tailored for your specific industry and workflow.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for Coding, Marketing, or Research agents..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-indigo-500 transition-all text-lg shadow-xl backdrop-blur-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white/5 border border-white/10 px-8 py-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-xl">
            <Filter size={20} /> Advanced Filters
          </button>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full text-center py-20">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
             </div>
          ) : agents.map((agent) => (
            <div key={agent._id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden backdrop-blur-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Bot size={32} />
                </div>
                {agent.isPremium && (
                  <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> Premium
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{agent.name}</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2">{agent.description}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {agent.capabilities.slice(0, 3).map((cap, i) => (
                  <span key={i} className="text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-lg uppercase tracking-widest text-white/40">
                    {cap}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div className="flex items-center gap-1 text-yellow-500 font-black">
                  <Star size={14} fill="currentColor" /> {agent.avgRating.toFixed(1)}
                </div>
                <button 
                  onClick={() => router.push(`/agents/${agent._id}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-all active:scale-95"
                >
                  Deploy Agent <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-2xl -z-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
