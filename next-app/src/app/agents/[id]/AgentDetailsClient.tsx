'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Bot, Zap, Star, ShieldCheck, Play, Code, Search, MessageSquare, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MagneticButton from '@/components/ui/MagneticButton';

interface Agent {
  _id: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  systemInstruction: string;
  baseModel: string;
  avgRating: number;
  reviewCount: number;
  isVerified: boolean;
  isPremium: boolean;
}

export default function AgentDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await axios.get(`/api/agents/${id}`);
        setAgent(res.data.data.agent);
      } catch (err) {
        console.error('Error fetching agent:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [id]);

  const handleDeploy = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    
    setDeploying(true);
    try {
      const res = await axios.post(`/api/agents/${id}/deploy`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${agent?.name} deployed successfully!\n\nAPI Key: ${res.data.data.deployment.apiKey}\nEndpoint: ${res.data.data.deployment.endpointUrl}\n\nPlease save this key securely.`);
    } catch (err: unknown) {
      alert(err.response?.data?.error || 'Deployment failed');
    } finally {
      setDeploying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!agent) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-2xl font-black text-white">Agent Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                  <div className="flex items-center gap-6">
                     <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400">
                        <Bot size={48} />
                     </div>
                     <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{agent.name}</h1>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{agent.category} agent</span>
                           {agent.isVerified && <ShieldCheck className="text-indigo-400" size={16} />}
                        </div>
                     </div>
                  </div>
                  {agent.isPremium && (
                    <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                       <Zap size={14} fill="currentColor" /> Premium Elite
                    </div>
                  )}
               </div>

               <p className="text-xl text-white/60 leading-relaxed mb-12">{agent.description}</p>

               <div className="space-y-8">
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                     <Terminal size={20} className="text-indigo-500" /> Core Capabilities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {agent.capabilities.map((cap, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                           <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                           <span className="font-bold text-white/80">{cap}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl -z-0"></div>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl">
               <h3 className="text-2xl font-black uppercase tracking-tight mb-8">System Instruction Template</h3>
               <div className="bg-black/60 border border-white/5 p-8 rounded-2xl font-mono text-sm text-indigo-300 leading-relaxed overflow-auto max-h-60">
                  {agent.systemInstruction}
               </div>
            </div>
          </div>

          {/* Sidebar: Deployment */}
          <div className="lg:col-span-1 space-y-8">
             <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl sticky top-32">
                <div className="flex justify-between items-center mb-8">
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Deployment Cost</div>
                   <div className="text-3xl font-black">{agent.isPremium ? 'PRO' : 'FREE'}</div>
                </div>

                <div className="space-y-6 mb-10">
                   <Feature icon={<Code size={16}/>} text="API Endpoints included" />
                   <Feature icon={<Search size={16}/>} text="Unlimited Search access" />
                   <Feature icon={<Play size={16}/>} text="Instant Execution" />
                </div>
                
                <MagneticButton 
                  onClick={handleDeploy}
                  disabled={deploying}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
                >
                  {deploying ? 'Deploying Nexus...' : <div className="flex items-center gap-2"><Zap size={20} fill="currentColor" /> Deploy Agent</div>}
                </MagneticButton>

                <div className="mt-8 pt-8 border-t border-white/10">
                   <div className="flex justify-between items-center text-sm">
                      <span className="opacity-40">Global Rating</span>
                      <div className="flex items-center gap-1 text-yellow-500 font-black">
                         <Star size={14} fill="currentColor" /> {agent.avgRating}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Feature = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-3 text-sm font-bold text-white/60">
     <div className="text-indigo-400">{icon}</div>
     <span>{text}</span>
  </div>
);
