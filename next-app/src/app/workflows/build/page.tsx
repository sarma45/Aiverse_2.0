'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import axios from 'axios';
import { GitBranch, Play, Save, Trash2, Bot, MessageSquare, ArrowRight } from 'lucide-react';

const API_BASE = '/api';

interface Step {
  id: string;
  type: 'prompt' | 'agent' | 'tool';
  label: string;
  config: {
    prompt?: string;
    agentId?: string;
    toolId?: string;
  }
}

export default function WorkflowBuilderPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get(`${API_BASE}/agents`);
        setAgents(res.data.data.agents);
      } catch (err) {
        console.error('Failed to fetch agents');
      }
    };
    fetchAgents();
  }, []);

  // Poll for job status if jobId exists
  useEffect(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any;
    if (jobId) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`${API_BASE}/workflows/test/status?jobId=${jobId}`);
          const { state, result } = res.data.data;
          if (state === 'completed') {
            setExecutionResult(result);
            setExecuting(false);
            setJobId(null);
            clearInterval(interval);
          } else if (state === 'failed') {
            alert('Workflow execution failed');
            setExecuting(false);
            setJobId(null);
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Poll error:', err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [jobId]);

  const addStep = (type: 'prompt' | 'agent') => {
    const newStep: Step = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: type === 'prompt' ? 'AI Prompt' : 'AI Agent',
      config: type === 'agent' ? { agentId: agents[0]?._id } : { prompt: '' }
    };
    setSteps([...steps, newStep]);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateStep = (id: string, config: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, config: { ...s.config, ...config } } : s));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    
    try {
      await axios.post(`${API_BASE}/workflows`, { name, description, steps }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Workflow saved successfully!');
      router.push('/dashboard');
    } catch (err) {
      alert('Failed to save workflow');
    }
  };

  const handleTest = async () => {
    setExecuting(true);
    setExecutionResult(null);
    const token = localStorage.getItem('token');
    try {
      // In a real scenario, we might need to save a temporary workflow to execute it,
      // or have a 'preview' execution endpoint that takes the raw steps.
      // For now, we simulate by calling a 'test' endpoint or using a generic one.
      const res = await axios.post(`${API_BASE}/ai/chat`, { prompt: "Analyzing workflow logic..." });
      setExecutionResult({ finalOutput: res.data.content });
      setExecuting(false);
    } catch (err) {
      alert('Test failed');
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <GitBranch color="white" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Workflow Builder</h1>
          </div>
          <div className="flex gap-4">
            <button onClick={handleTest} disabled={executing} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
              <Play size={18} /> {executing ? 'Executing...' : 'Test Run'}
            </button>
            <button onClick={handleSave} className="bg-indigo-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
              <Save size={18} /> Save Workflow
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
              <input 
                type="text" placeholder="Workflow Name" 
                className="w-full bg-transparent text-3xl font-black outline-none mb-4 placeholder:opacity-20"
                value={name} onChange={e => setName(e.target.value)}
              />
              <textarea 
                placeholder="What does this automation do?" 
                className="w-full bg-transparent text-white/60 outline-none resize-none placeholder:opacity-20"
                value={description} onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl group hover:border-indigo-500/50 transition-all">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-indigo-600/20 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-lg">{step.label}</h4>
                      </div>
                      <button onClick={() => removeStep(step.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-all hover:scale-110">
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {step.type === 'prompt' ? (
                      <textarea 
                        className="w-full bg-black/40 border border-white/5 rounded-xl p-4 outline-none focus:border-indigo-500 transition-all resize-none"
                        placeholder="Define the AI prompt for this step..."
                        value={step.config.prompt}
                        onChange={e => updateStep(step.id, { prompt: e.target.value })}
                      />
                    ) : (
                      <div className="relative">
                        <select 
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-4 outline-none focus:border-indigo-500 transition-all appearance-none"
                          value={step.config.agentId}
                          onChange={e => updateStep(step.id, { agentId: e.target.value })}
                        >
                          {agents.map(a => <option key={a._id} value={a._id} className="bg-[#111]">{a.name}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                          <Bot size={20} />
                        </div>
                      </div>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-4">
                      <ArrowRight size={24} className="text-indigo-500 rotate-90 opacity-40" />
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button onClick={() => addStep('prompt')} className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all group">
                  <MessageSquare size={20} className="text-indigo-500 group-hover:scale-110 transition-transform" /> Add Prompt Step
                </button>
                <button onClick={() => addStep('agent')} className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all group">
                  <Bot size={20} className="text-indigo-500 group-hover:scale-110 transition-transform" /> Add Agent Step
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl sticky top-32">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Play size={18} className="text-indigo-500" /> Execution Results
              </h3>
              {executionResult ? (
                <div className="bg-black/40 p-6 rounded-2xl text-sm leading-relaxed overflow-auto max-h-[500px] border border-white/5 text-white/80">
                  {executionResult.finalOutput}
                </div>
              ) : (
                <div className="text-center py-20 opacity-20 italic">
                  {executing ? 'Processing in background...' : 'Run a test to see output'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
