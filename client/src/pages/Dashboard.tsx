import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Code, Search, PenTool, Layout, Image as ImageIcon, Send, Loader2, User, LogOut, Settings, Sparkles, Copy, Terminal, Smile, Heart, BookOpen, Stethoscope, Cpu, PieChart, Languages, Scale, Palmtree, Dumbbell, Utensils, Megaphone } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const Dashboard = () => {
  const [activeTool, setActiveTool] = useState('chat');
  const [input, setInput] = useState('');
  const [writingTone, setWritingTone] = useState('professional');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      navigate('/login');
    } else {
      setUserData(JSON.parse(user));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toolCategories = [
    {
      name: 'Core Intelligence',
      items: [
        { id: 'chat', name: 'AI Chat', icon: <Bot size={18} />, description: 'Conversational Intelligence' },
        { id: 'research', name: 'Deep Research', icon: <Search size={18} />, description: 'Knowledge Synthesis' },
        { id: 'summarize', name: 'Insight Sync', icon: <Layout size={18} />, description: 'Document Analysis' },
      ]
    },
    {
      name: 'Professional Suite',
      items: [
        { id: 'code', name: 'Code Forge', icon: <Code size={18} />, description: 'Software Engineering' },
        { id: 'architect', name: 'System Architect', icon: <Cpu size={18} />, description: 'Tech Architecture' },
        { id: 'finance', name: 'Fin-Advisor', icon: <PieChart size={18} />, description: 'Chartered Accounting' },
        { id: 'medical', name: 'Med-Insight', icon: <Stethoscope size={18} />, description: 'Healthcare & Doctors' },
        { id: 'legal', name: 'Legal-Helper', icon: <Scale size={18} />, description: 'Legal Documentation' },
        { id: 'marketing', name: 'Market-Gen', icon: <Megaphone size={18} />, description: 'Business Strategy' },
      ]
    },
    {
      name: 'Creative & Social',
      items: [
        { id: 'image', name: 'Image Forge', icon: <ImageIcon size={18} />, description: 'Neural Art Gen' },
        { id: 'write', name: 'Creative Write', icon: <PenTool size={18} />, description: 'Professional Copy' },
        { id: 'storyteller', name: 'Story Forge', icon: <Smile size={18} />, description: 'For Children' },
        { id: 'companion', name: 'Companion', icon: <Heart size={18} />, description: 'Social & Elderly' },
      ]
    },
    {
      name: 'Daily Lifestyle',
      items: [
        { id: 'educator', name: 'Edu-Assist', icon: <BookOpen size={18} />, description: 'For Teachers' },
        { id: 'translator', name: 'Polyglot', icon: <Languages size={18} />, description: 'Global Translation' },
        { id: 'travel', name: 'Travel-Plan', icon: <Palmtree size={18} />, description: 'Itinerary Planning' },
        { id: 'fitness', name: 'Fit-Coach', icon: <Dumbbell size={18} />, description: 'Health & Nutrition' },
        { id: 'chef', name: 'Chef-Master', icon: <Utensils size={18} />, description: 'Recipes & Culinary' },
      ]
    }
  ];

  const allTools = toolCategories.flatMap(cat => cat.items);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogout();
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let response: any;
      if (activeTool === 'chat') {
        response = await axios.post(`${API_BASE}/ai/chat`, { prompt: input }, config);
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.content, timestamp: new Date().toLocaleTimeString() }]);
      } else if (activeTool === 'research') {
        response = await axios.post(`${API_BASE}/ai/research`, { prompt: input }, config);
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.content, timestamp: new Date().toLocaleTimeString() }]);
      } else if (activeTool === 'write') {
        response = await axios.post(`${API_BASE}/ai/write`, { prompt: input, tone: writingTone }, config);
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.content, timestamp: new Date().toLocaleTimeString() }]);
      } else if (activeTool === 'image') {
        response = await axios.post(`${API_BASE}/ai/image`, { prompt: input }, config);
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.imageUrl, isImage: true, timestamp: new Date().toLocaleTimeString() }]);
      } else if (activeTool === 'code') {
        response = await axios.post(`${API_BASE}/ai/code`, { prompt: input, language: 'typescript' }, config);
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.code, isCode: true, timestamp: new Date().toLocaleTimeString() }]);
      } else if (activeTool === 'summarize') {
        response = await axios.post(`${API_BASE}/ai/summarize`, { text: input }, config);
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.summary, timestamp: new Date().toLocaleTimeString() }]);
      } else {
        response = await axios.post(`${API_BASE}/ai/persona`, { prompt: input, personaId: activeTool }, config);
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.content, timestamp: new Date().toLocaleTimeString() }]);
      }
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.message || 'Error connecting to Aiverse Intelligence. Please ensure the backend is running.';
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage,
        isError: true,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="flex h-screen bg-dark text-text-main overflow-hidden p-4 gap-4 font-sans">
      {/* Sidebar */}
      <aside className="w-80 glass-morphism rounded-3xl flex flex-col p-6 border border-white/5 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer" onClick={() => navigate('/')}>
            <Sparkles size={20} color="white" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter cursor-pointer" onClick={() => navigate('/')}>AIVERSE</h2>
        </div>

        <div className="flex-1 space-y-8">
          {toolCategories.map(category => (
            <div key={category.name} className="space-y-2">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 ml-2">{category.name}</p>
               {category.items.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    activeTool === tool.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-white/10' 
                    : 'hover:bg-white/5 text-text-muted hover:text-text-main border border-transparent'
                  }`}
                >
                  <div className={`${activeTool === tool.id ? 'text-white' : 'text-primary'} group-hover:scale-110 transition-transform`}>
                    {tool.icon}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="font-bold text-xs truncate">{tool.name}</p>
                    <p className={`text-[9px] opacity-60 truncate ${activeTool === tool.id ? 'text-white' : ''}`}>{tool.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                   <User size={20} className="text-accent" />
                </div>
                <div className="overflow-hidden">
                   <p className="font-bold text-xs truncate">{userData.name}</p>
                   <p className="text-[10px] text-accent font-bold uppercase">{userData.subscription || 'FREE'} ACCESS</p>
                </div>
             </div>
             <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold transition-colors flex items-center justify-center gap-2">
                <Settings size={12} /> Account Settings
             </button>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-2"
          >
             <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col glass-morphism rounded-3xl overflow-hidden border border-white/5">
        {/* Header */}
        <header className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
             <h3 className="text-xl font-bold capitalize flex items-center gap-3">
                {allTools.find(t => t.id === activeTool)?.icon}
                {allTools.find(t => t.id === activeTool)?.name}
             </h3>
             <p className="text-xs text-text-muted mt-1">Status: <span className="text-accent font-bold">● ONLINE</span> • Engine: Gemini 1.5 Pro</p>
          </div>
          <div className="flex gap-3">
             {activeTool === 'write' && (
               <select 
                 value={writingTone} 
                 onChange={(e) => setWritingTone(e.target.value)}
                 className="bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold outline-none focus:border-primary/50 transition-all text-white"
               >
                 <option value="professional">Professional</option>
                 <option value="creative">Creative</option>
                 <option value="academic">Academic</option>
                 <option value="persuasive">Persuasive</option>
               </select>
             )}
             <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><Terminal size={18} /></button>
             <button className="btn-primary py-2 px-6 text-sm">Upgrade Tier</button>
          </div>
        </header>

        {/* Chat Window */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 animate-pulse">
                {allTools.find(t => t.id === activeTool)?.icon}
              </div>
              <h4 className="text-4xl font-black mb-4 tracking-tight">System Ready.</h4>
              <p className="text-text-muted leading-relaxed">
                Initialize your request below. Our neural networks are primed for high-performance {activeTool} tasks.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-10 w-full">
                 <button className="p-4 bg-white/5 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all border border-white/5">Example Task</button>
                 <button className="p-4 bg-white/5 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all border border-white/5">Capabilities</button>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`max-w-[85%] ${
                  m.role === 'user' 
                  ? 'bg-primary text-white p-6 rounded-[2rem] rounded-tr-sm shadow-xl shadow-primary/10' 
                  : 'bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] rounded-tl-sm'
                } ${m.isError ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                  {m.isCode ? (
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-xs opacity-60 mb-2">
                          <span className="font-mono">{m.language || 'Code Snippet'}</span>
                          <button className="flex items-center gap-1 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(m.content)}><Copy size={12} /> Copy</button>
                       </div>
                       <pre className="font-mono text-sm bg-black/40 p-6 rounded-2xl overflow-x-auto border border-white/5 leading-relaxed">
                          <code>{m.content}</code>
                       </pre>
                    </div>
                  ) : m.isImage ? (
                    <div className="space-y-6">
                       <div className="relative group/img overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                          <img src={m.content} alt="AI Generated" className="w-full aspect-square object-cover transition-transform duration-700 group-hover/img:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end p-6">
                             <a href={m.content} target="_blank" rel="noopener noreferrer" className="btn-primary w-full py-3 rounded-xl text-sm">Download Ultra-HD</a>
                          </div>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <p className="text-xs text-text-muted font-medium flex items-center gap-2">
                             <ImageIcon size={14} className="text-primary" /> Generated via Neural Forge v2.0 • 1024x1024 • Stable-Fusion Base
                          </p>
                       </div>
                    </div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  )}
                  <p className="text-[10px] mt-4 opacity-40 font-bold uppercase tracking-widest">{m.timestamp || 'SYSTEM RESPONSE'}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
               <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] rounded-tl-sm flex items-center gap-4">
                  <Loader2 className="animate-spin text-primary" size={24} />
                  <p className="text-sm font-bold text-primary animate-pulse">ORCHESTRATING AI RESPONSE...</p>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <footer className="p-10 bg-white/[0.01] border-t border-white/5">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Query Aiverse Engine for ${allTools.find(t => t.id === activeTool)?.name}...`}
                className="w-full bg-bg-dark border border-white/10 rounded-2xl px-8 py-6 pr-20 focus:border-primary/50 outline-none transition-all text-lg shadow-2xl"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className={`absolute right-3 p-4 rounded-xl transition-all ${
                  input.trim() ? 'bg-primary text-white shadow-lg' : 'text-white/20'
                } hover:scale-105 active:scale-95 disabled:hover:scale-100`}
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              </button>
            </div>
            <p className="text-center text-[10px] text-text-muted mt-4 font-bold uppercase tracking-[0.2em]">
              Powered by Quantum-Neural Engine v2.0 • Data is encrypted end-to-end
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
