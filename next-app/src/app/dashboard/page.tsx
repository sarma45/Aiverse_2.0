'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import axios from 'axios';
import { User, Settings, Package, CreditCard, Clock, ChevronRight, Zap } from 'lucide-react';

interface Purchase {
  _id: string;
  assetType: string;
  assetId: { name: string };
  createdAt: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!token) return router.push('/login');
      
      setUser(savedUser);
      // In a real app, we'd fetch actual purchases from an API
      // For now we simulate
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10 pt-32">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
             <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] text-center backdrop-blur-xl">
                <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black border-4 border-white/10">
                  {user?.name?.[0] || 'U'}
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">{user?.name}</h2>
                <p className="text-white/40 text-sm mb-6">{user?.email}</p>
                <div className="inline-flex items-center gap-2 bg-indigo-600/10 text-indigo-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                  {user?.subscription} Tier
                </div>
             </div>

             <nav className="bg-white/5 border border-white/10 p-4 rounded-[2.5rem] backdrop-blur-xl space-y-1">
                <NavItem icon={<Package size={18}/>} label="My Assets" active />
                <NavItem icon={<CreditCard size={18}/>} label="Billing" />
                <NavItem icon={<Settings size={18}/>} label="Settings" />
             </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
             <div className="mb-12">
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Command Center</h1>
                <p className="text-xl text-white/40">Manage your AI inventory and subscription data.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                   <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Active Workflows</h3>
                   <div className="text-4xl font-black text-indigo-400 mb-8">12</div>
                   <button className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
                      Manage Flows <ChevronRight size={16}/>
                   </button>
                   <GitBranch className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32 -rotate-12 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                   <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">API Requests</h3>
                   <div className="text-4xl font-black text-indigo-400 mb-8">45.2k</div>
                   <button className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
                      View Logs <ChevronRight size={16}/>
                   </button>
                   <Zap className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32 -rotate-12 group-hover:scale-110 transition-transform" />
                </div>
             </div>

             <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl">
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                   <h3 className="text-2xl font-black uppercase tracking-tight">Recent Inventory</h3>
                   <Clock size={20} className="opacity-20" />
                </div>
                <div className="p-20 text-center opacity-20">
                   <Package className="mx-auto mb-4" size={48} />
                   <p className="italic">No digital assets purchased yet. Visit the marketplace to deploy agents.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const GitBranch = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v12"/><path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M15 15a3 3 0 0 0-3-3H6"/></svg>
);
