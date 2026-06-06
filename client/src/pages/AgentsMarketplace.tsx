import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { Bot, Search, Filter, Shield, Star, Zap, ChevronRight } from 'lucide-react';

interface Agent {
  _id: string;
  name: string;
  description: string;
  category: string;
  avgRating: number;
  isPremium: boolean;
  capabilities: string[];
}

const AgentsMarketplace = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAgents = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/agents`, { params: { search } });
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
    <div className="min-h-screen bg-dark py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
            Agent <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Discover and deploy specialized autonomous AI agents tailored for your specific industry and workflow.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search for Coding, Marketing, or Research agents..." 
              className="w-full bg-glass border border-glass-border rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-primary transition-all text-lg shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="glass-morphism px-8 py-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-glass-border transition-all">
            <Filter size={20} /> Advanced Filters
          </button>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full text-center py-20">
               <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
             </div>
          ) : agents.map((agent) => (
            <div key={agent._id} className="glass-morphism p-8 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Bot size={32} />
                </div>
                {agent.isPremium && (
                  <div className="bg-yellow-500/10 text-yellow-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> Premium
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{agent.name}</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-2">{agent.description}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {agent.capabilities.slice(0, 3).map((cap, i) => (
                  <span key={i} className="text-[10px] font-bold bg-glass-border px-3 py-1 rounded-lg uppercase opacity-60">
                    {cap}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-glass-border pt-6">
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star size={14} fill="currentColor" /> {agent.avgRating.toFixed(1)}
                </div>
                <button className="btn-primary py-2 px-6 rounded-xl font-bold text-sm flex items-center gap-2">
                  Deploy Agent <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentsMarketplace;
