'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Terminal, ShoppingCart, User, Star, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

interface Prompt {
  _id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  price: number;
  author: { name: string };
  avgRating: number;
  reviewCount: number;
}

export default function PromptDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/marketplace/prompts/${id}`);
        setPrompt(res.data.data.prompt);
        // In a real app, check if user has purchased this asset
      } catch (err) {
        console.error('Error fetching prompt details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAcquire = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    
    if (prompt?.price === 0) {
      setHasPurchased(true);
      return;
    }

    try {
       const res = await axios.post('/api/marketplace/order', { assetId: id, assetType: 'prompt' }, {
          headers: { Authorization: `Bearer ${token}` }
       });
       // Razorpay flow logic here
       alert('Redirecting to secure payment...');
    } catch (err) {
       alert('Acquisition failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!prompt) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-2xl font-black text-white">Prompt Not Found</div>;

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
                 <Terminal size={48} />
              </div>
              <div className="text-4xl font-black">{prompt.price === 0 ? 'FREE' : `₹${prompt.price}`}</div>
           </div>

           <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">{prompt.title}</h1>
           <p className="text-xl text-white/60 leading-relaxed mb-10">{prompt.description}</p>

           <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                 <User size={18} className="opacity-40" />
              </div>
              <div>
                 <div className="font-bold text-sm uppercase tracking-widest">{prompt.author.name}</div>
                 <div className="text-[10px] opacity-40 uppercase font-black tracking-widest">Engineering Specialist</div>
              </div>
           </div>

           {!hasPurchased ? (
             <button 
               onClick={handleAcquire}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-3"
             >
               <ShoppingCart size={24} /> {prompt.price === 0 ? 'Acquire for Free' : 'Purchase Prompt'}
             </button>
           ) : (
             <div className="space-y-8 animate-reveal">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 font-bold text-center uppercase tracking-widest text-xs">
                   Access Granted
                </div>
                <div className="relative group">
                   <pre className="bg-black/60 border border-white/5 p-8 rounded-2xl font-mono text-indigo-300 whitespace-pre-wrap overflow-auto max-h-96">
                      {prompt.content}
                   </pre>
                   <button 
                     onClick={handleCopy}
                     className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                   >
                     {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                   </button>
                </div>
             </div>
           )}

           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl -z-0"></div>
        </div>
      </div>
    </div>
  );
}
