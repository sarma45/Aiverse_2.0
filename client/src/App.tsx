import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HeroScene from './components/HeroScene';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SubmitToolPage from './pages/SubmitToolPage';
import ToolDetailsPage from './pages/ToolDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import AgentsMarketplace from './pages/AgentsMarketplace';
import WorkflowBuilderPage from './pages/WorkflowBuilderPage';
import CommunityPage from './pages/CommunityPage';
import CreateThreadPage from './pages/CreateThreadPage';
import ThreadDetailsPage from './pages/ThreadDetailsPage';
import EnterprisePage from './pages/EnterprisePage';
import NewsFeed from './components/NewsFeed';
import CollectionsWidget from './components/CollectionsWidget';
import { Sparkles, Bot, Code, Search, PenTool, Layout, ChevronRight, CheckCircle2, Zap, AudioLines, Video, PlusCircle, Shield, TrendingUp, Sparkle, LayoutDashboard, GitBranch } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from './config';

interface Tool {
  _id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  pricingModel: string;
  avgRating: number;
}

function LandingPage() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedTools, setRecommendedTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTools = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/tools`, {
        params: { search }
      });
      setTools(res.data.data.tools);
    } catch (err) {
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tools`, {
        params: { recommended: 'true', limit: 3 }
      });
      setRecommendedTools(res.data.data.tools);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  useEffect(() => {
    fetchRecommended();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTools(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const getIcon = (category: string) => {
    switch (category) {
      case 'chat': return <Bot size={40} className="text-primary" />;
      case 'image': return <Sparkles size={40} className="text-primary" />;
      case 'code': return <Code size={40} className="text-primary" />;
      case 'research': return <Search size={40} className="text-primary" />;
      case 'writing': return <PenTool size={40} className="text-primary" />;
      case 'audio': return <AudioLines size={40} className="text-primary" />;
      case 'video': return <Video size={40} className="text-primary" />;
      default: return <Layout size={40} className="text-primary" />;
    }
  };

  const handlePayment = async (tier: string, price: string) => {
    if (tier === 'Starter' || price === 'Free') {
      navigate('/dashboard');
      return;
    }

    if (tier === 'Enterprise') {
      window.location.href = 'mailto:sales@aiverse.com';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const amount = price === '₹999' ? 999 : 0;
      const orderRes = await axios.post(`${API_BASE}/payments/order`, { amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const options = {
        key: 'rzp_test_mock', // In real app, use process.env.RAZORPAY_KEY_ID
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'AIVERSE Intelligence',
        description: `${tier} Subscription Plan`,
        order_id: orderRes.data.id,
        handler: async (response: any) => {
          try {
            await axios.post(`${API_BASE}/payments/verify`, response, {
              headers: { Authorization: `Bearer ${token}` }
            });
            // Update local user data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.subscription = tier.toLowerCase();
            localStorage.setItem('user', JSON.stringify(user));
            alert('Payment Successful! Welcome to Aiverse Pro.');
            navigate('/dashboard');
          } catch (err) {
            alert('Payment Verification Failed');
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').name,
          email: JSON.parse(localStorage.getItem('user') || '{}').email,
        },
        theme: { color: '#6366f1' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment Error:', err);
      alert('Could not initialize payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark overflow-hidden">
      {/* Background Glows */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', zIndex: 0 }}></div>

      <nav className="glass-morphism fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 px-8 py-4 flex justify-between items-center rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles color="white" size={24} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter" style={{ fontSize: '1.5rem' }}>
            AIVERSE
          </h1>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="nav-link">Directory</a>
          <Link to="/agents" className="nav-link flex items-center gap-2">
            <Bot size={18} /> Agents
          </Link>
          <Link to="/workflows/build" className="nav-link flex items-center gap-2">
            <GitBranch size={18} /> Workflows
          </Link>
          <Link to="/community" className="nav-link flex items-center gap-2">
            <Users size={18} /> Community
          </Link>
          <Link to="/enterprise" className="nav-link flex items-center gap-2">
            <Shield size={18} /> Enterprise
          </Link>
          <Link to="/creator-hub" className="nav-link flex items-center gap-2">
            <LayoutDashboard size={18} /> Creator Hub
          </Link>
          <Link to="/submit-tool" className="nav-link flex items-center gap-2">
            <PlusCircle size={18} /> Submit Tool
          </Link>
          {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
            <Link to="/admin" className="nav-link flex items-center gap-2 text-primary">
              <Shield size={18} /> Admin
            </Link>
          )}
          <a href="#pricing" className="nav-link">Pricing</a>
          <Link to="/login" className="btn-primary">
            Launch Platform <ChevronRight size={20} />
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col md:flex-row items-center justify-between gap-12 pt-40">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-glass px-4 py-2 rounded-full border border-glass-border mb-6">
              <Zap size={16} className="text-primary" />
              <span className="text-sm font-semibold text-primary">v2.0 Now Live - Powered by Gemini 1.5</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-[1.05]">
              The AI <br /> 
              <span className="text-gradient">Super-App</span>
            </h2>
            <p className="text-xl text-text-muted mb-10 max-w-xl leading-relaxed">
              Experience the world's most advanced AI orchestration platform. Chat, code, research, and summarize with zero friction. One subscription, infinite intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <Link to="/register" className="btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.2rem' }}>
                Get Started Free
              </Link>
              <button className="glass-morphism px-10 py-5 rounded-xl font-bold hover:bg-glass-border transition-all">
                Explore Enterprise
              </button>
            </div>
          </div>
          <div className="flex-1 w-full animate-float">
            <HeroScene />
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32">
          
          <CollectionsWidget />

          {recommendedTools.length > 0 && (
            <div className="mb-20">
              <h3 className="text-3xl font-black mb-8 flex items-center gap-2">
                <Sparkle className="text-primary" /> Recommended for You
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommendedTools.map((tool) => (
                  <FeatureCard 
                    key={tool._id}
                    icon={getIcon(tool.category)} 
                    title={tool.name} 
                    description={tool.description} 
                    rating={tool.avgRating}
                    reviewCount={tool.reviewCount}
                    onReview={() => navigate(`/tool/${tool._id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-extrabold mb-6">Global Directory</h3>
            <p className="text-text-muted text-lg max-w-2xl mx-auto mb-10">
              Aiverse consolidates the entire AI landscape into a single, high-performance interface designed for professionals.
            </p>
            
            <div className="max-w-xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search 10,000+ AI tools, models, and workflows..." 
                className="w-full bg-glass border border-glass-border rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-primary transition-all text-lg shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content: Tool Directory */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                  <div className="col-span-full text-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-text-muted">Loading AI Ecosystem...</p>
                  </div>
                ) : tools.length > 0 ? (
                  tools.map((tool) => (
                    <FeatureCard 
                      key={tool._id}
                      icon={getIcon(tool.category)} 
                      title={tool.name} 
                      description={tool.description} 
                      rating={tool.avgRating}
                      reviewCount={tool.reviewCount}
                      onReview={() => navigate(`/tool/${tool._id}`)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <p className="text-text-muted">No tools found. Be the first to submit!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: AI News Feed */}
            <div className="w-full lg:w-[400px]">
              <div className="sticky top-32">
                <NewsFeed />
                
                <div className="mt-12 glass-morphism p-8 rounded-3xl bg-primary/5 border-primary/20">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="text-primary" /> Trending Now
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-sm hover:text-primary cursor-pointer transition-colors">
                      <span className="font-black text-primary">01</span>
                      <span>Gemini 1.5 Pro Context Scaling</span>
                    </li>
                    <li className="flex gap-3 text-sm hover:text-primary cursor-pointer transition-colors">
                      <span className="font-black text-primary">02</span>
                      <span>OpenAI Sora Public Beta Speculation</span>
                    </li>
                    <li className="flex gap-3 text-sm hover:text-primary cursor-pointer transition-colors">
                      <span className="font-black text-primary">03</span>
                      <span>NVIDIA Blackwell H200 Benchmarks</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-glass rounded-[4rem] mx-4 border border-glass-border">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-extrabold mb-6">Simple, Transparent Pricing</h3>
            <p className="text-text-muted">Built for everyone, from individuals to global enterprises.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              tier="Starter" 
              price="Free" 
              features={["100 AI Messages/mo", "Standard Models", "Basic Research Tool", "Community Support"]} 
              onSelect={() => handlePayment('Starter', 'Free')}
            />
            <PricingCard 
              tier="Pro" 
              price="₹999" 
              featured 
              features={["Unlimited AI Messages", "Gemini 1.5 Pro Access", "Advanced Code Forge", "Priority Processing", "Full API Access"]} 
              onSelect={() => handlePayment('Pro', '₹999')}
            />
            <PricingCard 
              tier="Enterprise" 
              price="Custom" 
              features={["SLA Guarantees", "Dedicated Infrastructure", "Team Management", "Custom Model Training", "24/7 Premium Support"]} 
              onSelect={() => handlePayment('Enterprise', 'Custom')}
            />
          </div>
        </section>

        {/* Trust Section */}
        <section className="text-center py-32">
          <h4 className="text-sm font-bold tracking-[0.3em] text-primary uppercase mb-12">Trusted by Innovation Leaders</h4>
          <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale contrast-125">
             <span className="text-2xl font-bold">TECHCORP</span>
             <span className="text-2xl font-bold">NEXUS AI</span>
             <span className="text-2xl font-bold">VORTEX</span>
             <span className="text-2xl font-bold">GLOBALYX</span>
          </div>
        </section>
      </main>

      <footer className="border-t border-glass-border py-20 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-primary" />
              <span className="text-2xl font-black">AIVERSE</span>
            </div>
            <p className="text-text-muted max-w-sm">
              The ultimate destination for the world's most powerful artificial intelligence. Built for the modern web.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6">Platform</h5>
            <ul className="space-y-4 text-text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Status</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6">Connect</h5>
            <ul className="space-y-4 text-text-muted">
              <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-text-muted">
          <p>© 2026 AIVERSE Intelligence. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description, rating, reviewCount, onReview }: { icon: React.ReactNode, title: string, description: string, rating?: number, reviewCount?: number, onReview?: () => void }) => (
  <div className="glass-morphism p-10 rounded-3xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
    <div className="mb-6 bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
      {icon}
    </div>
    <div className="flex justify-between items-start mb-4">
      <h4 className="text-2xl font-bold">{title}</h4>
      {rating !== undefined && (
        <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold">
          <Sparkles size={14} fill="currentColor" /> {rating.toFixed(1)}
        </div>
      )}
    </div>
    <p className="text-text-muted leading-relaxed mb-6">{description}</p>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium opacity-60">{reviewCount || 0} Reviews</span>
      <button 
        onClick={onReview}
        className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
      >
        View Details <ChevronRight size={18} />
      </button>
    </div>
  </div>
);

const PricingCard = ({ tier, price, features, featured, onSelect }: { tier: string, price: string, features: string[], featured?: boolean, onSelect: () => void }) => (
  <div className={`p-10 rounded-[2.5rem] flex flex-col ${featured ? 'bg-primary border-4 border-white/20 shadow-2xl scale-105' : 'glass-morphism'}`}>
    <h4 className="text-xl font-bold mb-2 uppercase tracking-widest opacity-80">{tier}</h4>
    <div className="mb-8">
      <span className="text-5xl font-black">{price}</span>
      {price !== 'Free' && price !== 'Custom' && <span className="text-lg opacity-60">/mo</span>}
    </div>
    <ul className="space-y-4 mb-10 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3">
          <CheckCircle2 size={20} className={featured ? 'text-white' : 'text-primary'} />
          <span className="font-medium">{f}</span>
        </li>
      ))}
    </ul>
    <button onClick={onSelect} className={`${featured ? 'bg-white text-primary' : 'btn-primary'} py-4 rounded-2xl text-center font-bold transition-transform active:scale-95`}>
      {tier === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
    </button>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-tool" element={<SubmitToolPage />} />
        <Route path="/tool/:id" element={<ToolDetailsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/creator-hub" element={<CreatorDashboard />} />
        <Route path="/agents" element={<AgentsMarketplace />} />
        <Route path="/workflows/build" element={<WorkflowBuilderPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/new" element={<CreateThreadPage />} />
        <Route path="/community/thread/:id" element={<ThreadDetailsPage />} />
        <Route path="/enterprise" element={<EnterprisePage />} />
      </Routes>
    </Router>
  );
}

export default App;
