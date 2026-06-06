'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Database, ShoppingCart, User, Shield, HardDrive, FileJson, Download, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

interface Dataset {
  _id: string;
  name: string;
  description: string;
  size: string;
  format: string;
  category: string;
  price: number;
  url: string;
  author: { name: string };
  isVerified: boolean;
}

export default function DatasetDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/marketplace/datasets/${id}`);
        setDataset(res.data.data.dataset);
      } catch (err) {
        console.error('Error fetching dataset details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAcquire = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    
    if (dataset?.price === 0) {
      setHasPurchased(true);
      return;
    }

    try {
       const res = await axios.post('/api/marketplace/order', { assetId: id, assetType: 'dataset' }, {
          headers: { Authorization: `Bearer ${token}` }
       });
       alert('Redirecting to secure payment for dataset...');
    } catch (err) {
       alert('Acquisition failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!dataset) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-2xl font-black text-white">Dataset Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4 pt-32">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden mb-12">
           <div className="flex justify-between items-start mb-8">
              <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400">
                 <Database size={48} />
              </div>
              <div className="text-4xl font-black">{dataset.price === 0 ? 'FREE' : `₹${dataset.price}`}</div>
           </div>

           <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">{dataset.name}</h1>
           <div className="flex items-center gap-3 mb-8">
              {dataset.isVerified && <Shield className="text-indigo-400" size={16} />}
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{dataset.category} Vault</span>
           </div>

           <p className="text-xl text-white/60 leading-relaxed mb-12">{dataset.description}</p>

           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              <DataSpec icon={<HardDrive size={18}/>} label="Storage Size" value={dataset.size} />
              <DataSpec icon={<FileJson size={18}/>} label="Data Format" value={dataset.format} />
              <DataSpec icon={<User size={18}/>} label="Curated By" value={dataset.author.name} />
           </div>

           {!hasPurchased ? (
             <button 
               onClick={handleAcquire}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-3"
             >
               <ShoppingCart size={24} /> {dataset.price === 0 ? 'Download for Free' : 'Purchase Access'}
             </button>
           ) : (
             <div className="space-y-8 animate-reveal">
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-green-400 font-bold text-center uppercase tracking-widest text-sm flex items-center justify-center gap-3">
                   <Check size={20} /> Vault Access Unlocked
                </div>
                <a 
                  href={dataset.url} download
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all"
                >
                   <Download size={24} className="text-indigo-500" /> Download Proprietary Data
                </a>
             </div>
           )}

           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl -z-0"></div>
        </div>
      </div>
    </div>
  );
}

const DataSpec = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-xl">
     <div className="text-indigo-400 mb-3">{icon}</div>
     <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</div>
     <div className="text-sm font-bold truncate">{value}</div>
  </div>
);
