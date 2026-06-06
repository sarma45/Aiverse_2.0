'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Cpu, Globe, Star, ShieldCheck, ExternalLink, Activity, Layers, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

interface AiModel {
  _id: string;
  name: string;
  description: string;
  developer: string;
  category: string;
  parameters: string;
  contextWindow: string;
  license: string;
  url: string;
  avgRating: number;
  reviewCount: number;
  isVerified: boolean;
}

export default function ModelDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [model, setModel] = useState<AiModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/models/${id}`);
        setModel(res.data.data.model);
      } catch (err) {
        console.error('Error fetching model details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!model) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-2xl font-black text-white">Model Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4 pt-32">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                  <div className="flex items-center gap-6">
                     <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400">
                        <Cpu size={48} />
                     </div>
                     <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{model.name}</h1>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{model.category} Model</span>
                           {model.isVerified && <ShieldCheck className="text-indigo-400" size={16} />}
                        </div>
                     </div>
                  </div>
                  <div className="bg-white/5 border border-white/5 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                     <Globe size={14} className="text-indigo-500" /> {model.developer}
                  </div>
               </div>

               <p className="text-xl text-white/60 leading-relaxed mb-12">{model.description}</p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SpecItem icon={<Activity size={20}/>} label="Parameters" value={model.parameters || 'N/A'} />
                  <SpecItem icon={<Layers size={20}/>} label="Context Window" value={model.contextWindow || 'N/A'} />
                  <SpecItem icon={<Database size={20}/>} label="License" value={model.license || 'N/A'} />
                  <SpecItem icon={<Star size={20}/>} label="Avg Rating" value={model.avgRating.toFixed(1)} />
               </div>

               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl -z-0"></div>
            </div>

            <div className="flex gap-6">
               <a 
                 href={model.url} target="_blank" rel="noopener noreferrer"
                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-3"
               >
                 Launch Model <ExternalLink size={20} />
               </a>
            </div>
          </div>

          <div className="lg:col-span-1">
             {/* Potential Sidebar for benchmarks or related tools */}
             <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
                <h3 className="text-xl font-black uppercase tracking-tight mb-8">Technical Specs</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center text-sm">
                      <span className="opacity-40">Verification</span>
                      <span className="font-bold text-green-400 uppercase tracking-widest text-[10px]">Active</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="opacity-40">Reviews</span>
                      <span className="font-bold">{model.reviewCount}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SpecItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex items-center gap-6 group hover:border-indigo-500/20 transition-colors">
     <div className="bg-white/5 p-4 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <div>
        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</div>
        <div className="text-xl font-bold">{value}</div>
     </div>
  </div>
);
