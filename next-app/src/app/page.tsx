'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { Sparkles, Bot, Code, Search, PenTool, Layout, ChevronRight, CheckCircle2, Zap, AudioLines, Video, PlusCircle, TrendingUp, LayoutDashboard, Sparkle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NewsFeed from '@/components/NewsFeed';
import CollectionsWidget from '@/components/CollectionsWidget';
import NeuralBackground from '@/components/ui/NeuralBackground';
import Navbar from '@/components/layout/Navbar';
import InteractiveGlobe from '@/components/ui/InteractiveGlobe';
import MagneticButton from '@/components/ui/MagneticButton';
import TiltCard from '@/components/ui/TiltCard';

interface Tool {
  _id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  pricingModel: string;
  avgRating: number;
  reviewCount: number;
}

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [recommendedTools, setRecommendedTools] = useState<Tool[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTools = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/tools`, {
        params: { search }
      });
      setTools(res.data.data.tools);
    } catch (err) {
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axios.get(`/api/tools`, {
          params: { recommended: 'true', limit: 3 }
        });
        setRecommendedTools(res.data.data.tools);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    };

    const fetchTrends = async () => {
      try {
        const res = await axios.get(`/api/ai/trends`);
        setTrends(res.data.data.trends);
      } catch (err) {
        console.error('Error fetching trends:', err);
      }
    };

    fetchRecommended();
    fetchTrends();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTools(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.animate-reveal', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case 'chat': return <Bot size={40} className="text-indigo-500" />;
      case 'image': return <Sparkles size={40} className="text-indigo-500" />;
      case 'code': return <Code size={40} className="text-indigo-500" />;
      case 'research': return <Search size={40} className="text-indigo-500" />;
      case 'writing': return <PenTool size={40} className="text-indigo-500" />;
      case 'audio': return <AudioLines size={40} className="text-indigo-500" />;
      case 'video': return <Video size={40} className="text-indigo-500" />;
      default: return <Layout size={40} className="text-indigo-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" ref={heroRef}>
      <NeuralBackground />
      
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-8 animate-reveal">
              <Sparkle size={14} className="text-indigo-500" /> V2.0 Global Infrastructure
            </div>
            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.8] tracking-tighter uppercase animate-reveal">
              The Universal <br />
              <span className="text-indigo-500 text-gradient">AI Nexus</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/40 max-w-2xl lg:mx-0 mx-auto mb-16 leading-relaxed animate-reveal delay-100">
              Discover, orchestrate, and monetize specialized AI intelligence. A consolidated high-performance ecosystem for the next generation of builders.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-reveal delay-200">
              <MagneticButton 
                onClick={() => router.push('/register')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-indigo-600/20"
              >
                Get Started Free
              </MagneticButton>
              <button 
                onClick={() => router.push('/enterprise')}
                className="bg-white/5 border border-white/10 hover:bg-white/10 px-12 py-5 rounded-2xl font-black text-xl transition-all active:scale-95 backdrop-blur-xl"
              >
                Enterprise Access
              </button>
            </div>
          </div>

          <div className="flex-1 w-full h-[500px] lg:h-[600px] animate-reveal delay-300">
            <InteractiveGlobe />
          </div>
        </div>
      </section>

      {/* Global Directory */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <CollectionsWidget />

          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter">Global Directory</h2>
            <div className="max-w-xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search 10,000+ AI tools, models, and workflows..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-indigo-500 transition-all text-lg shadow-xl backdrop-blur-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                  <div className="col-span-full text-center py-20 animate-pulse">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  </div>
                ) : tools.map((tool) => (
                  <TiltCard key={tool._id}>
                    <FeatureCard 
                      icon={getIcon(tool.category)} 
                      title={tool.name} 
                      description={tool.description} 
                      rating={tool.avgRating}
                      reviewCount={tool.reviewCount}
                      onReview={() => router.push(`/tools/${tool._id}`)}
                    />
                  </TiltCard>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[400px]">
              <div className="sticky top-32 space-y-12">
                 <NewsFeed />
                 
                 <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
                    <h4 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tighter">
                      <TrendingUp className="text-indigo-500" /> Trending Topics
                    </h4>
                    <ul className="space-y-4">
                      {trends.length > 0 ? trends.map((trend, i) => (
                        <li key={i} className="flex gap-4 text-sm hover:text-indigo-400 cursor-pointer transition-colors group">
                          <span className="font-black text-indigo-500 opacity-40 group-hover:opacity-100">{String(i + 1).padStart(2, '0')}</span>
                          <div className="flex-1">
                             <div className="font-bold uppercase tracking-tight">{trend.topic}</div>
                             <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${trend.relevance}%` }}></div>
                             </div>
                          </div>
                        </li>
                      )) : (
                        <div className="text-xs italic opacity-20">Analyzing real-time signals...</div>
                      )}
                    </ul>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-4 bg-white/5 border-y border-white/5 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl font-black mb-24 uppercase tracking-tighter">Nexus Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard 
              tier="Starter" price="Free" 
              features={['3 Workflows/mo', 'Standard Directory', 'Community Access']} 
              onSelect={() => router.push('/register')}
            />
            <PricingCard 
              tier="Pro" price="₹999" featured 
              features={['Unlimited Workflows', 'Featured Listings', 'Premium Agents', 'API Access']} 
              onSelect={() => router.push('/register')}
            />
            <PricingCard 
              tier="Enterprise" price="Custom" 
              features={['Private VPC', 'Custom Model Training', '24/7 Dedicated Support', 'SLA Guarantees']} 
              onSelect={() => router.push('/enterprise')}
            />
          </div>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-white/5 bg-black">
        <div className="flex items-center justify-center gap-3 mb-10 opacity-40">
           <Zap size={24} />
           <h3 className="text-xl font-black uppercase tracking-tighter">AIVERSE OMEGA</h3>
        </div>
        <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
          © 2026 AIVerse Intelligence. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const FeatureCard = ({ icon, title, description, rating, reviewCount, onReview }: any) => (
  <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden backdrop-blur-xl">
    <div className="mb-6 bg-white/5 border border-white/5 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex justify-between items-start mb-4">
      <h4 className="text-2xl font-black uppercase tracking-tight">{title}</h4>
      <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-500/20">
        <Sparkle size={10} fill="currentColor" /> {rating.toFixed(1)}
      </div>
    </div>
    <p className="text-white/40 leading-relaxed mb-10 line-clamp-3">{description}</p>
    <div className="flex items-center justify-between border-t border-white/5 pt-6">
      <span className="text-[10px] font-black uppercase tracking-widest opacity-20">{reviewCount} Analyses</span>
      <button onClick={onReview} className="text-indigo-400 font-black flex items-center gap-2 hover:gap-4 transition-all uppercase text-xs tracking-widest">
        View Intel <ChevronRight size={18} />
      </button>
    </div>
  </div>
);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const PricingCard = ({ tier, price, features, featured = false, onSelect }: any) => (
  <div className={`p-12 rounded-[3.5rem] border transition-all duration-500 ${featured ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-600/40 scale-105 z-10' : 'bg-white/5 border-white/10 backdrop-blur-xl'}`}>
    <h3 className="text-xl font-black uppercase tracking-widest mb-2">{tier}</h3>
    <div className="text-5xl font-black mb-10 tracking-tighter uppercase">{price}<span className="text-sm opacity-40">/mo</span></div>
    <ul className="space-y-6 mb-12 text-left">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center gap-4 text-sm font-bold">
          <CheckCircle2 size={18} className={featured ? 'text-white' : 'text-indigo-500'} />
          <span className={featured ? 'text-white' : 'text-white/60'}>{f}</span>
        </li>
      ))}
    </ul>
    <button onClick={onSelect} className={`w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl ${featured ? 'bg-white text-indigo-600' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'}`}>
       Deploy {tier}
    </button>
  </div>
);
