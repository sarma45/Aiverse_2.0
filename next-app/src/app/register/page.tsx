'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import { User, Mail, Lock, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', formData);
      
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        alert(result.error);
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      alert(err.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Zap color="white" size={40} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Join AIVerse</h1>
          <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-2">Scale your AI journey</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Identity Handle</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none transition-all text-white"
                  placeholder="Universal Name"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Email Protocol</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="email" required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none transition-all text-white"
                  placeholder="name@nexus.ai"
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="password" required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none transition-all text-white"
                  placeholder="••••••••"
                  value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Initializing...' : <><ChevronRight size={20} /> Deploy Account</>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-white/40">Already encoded? </span>
            <Link href="/login" className="text-indigo-400 font-bold hover:underline">Access Hub</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
