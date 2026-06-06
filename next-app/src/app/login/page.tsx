'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Lock, Mail, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      alert(result.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Sparkles color="white" size={40} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Welcome Back</h1>
          <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-2">Enter the intelligence nexus</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black mb-2 uppercase tracking-widest opacity-40">Email Protocol</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="email" required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-indigo-500 outline-none transition-all text-white"
                  placeholder="name@nexus.ai"
                  value={email} onChange={e => setEmail(e.target.value)}
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
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authorizing...' : <><ChevronRight size={20} /> Access Platform</>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-white/40">New to the ecosystem? </span>
            <Link href="/register" className="text-indigo-400 font-bold hover:underline">Request Access</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
