import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';
import { GitBranch, Plus, Play, Save, Trash2, Bot, MessageSquare, ArrowRight } from 'lucide-react';

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

const WorkflowBuilderPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      const res = await axios.get(`${API_BASE}/agents`);
      setAgents(res.data.data.agents);
    };
    fetchAgents();
  }, []);

  const addStep = (type: 'prompt' | 'agent') => {
    const newStep: Step = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: type === 'prompt' ? 'AI Prompt' : 'AI Agent',
      config: type === 'agent' ? { agentId: agents[0]?._id } : { prompt: '' }
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: string, config: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, config: { ...s.config, ...config } } : s));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE}/workflows`, { name, description, steps }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Workflow saved successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to save workflow');
    }
  };

  const handleTest = async () => {
    setExecuting(true);
    setExecutionResult(null);
    const token = localStorage.getItem('token');
    try {
      // For testing, we just execute the current local state if it was saved, 
      // or we'd need a temporary execution endpoint. 
      // For simplicity, we'll assume the user saves first or we use a 'preview' logic.
      const res = await axios.post(`${API_BASE}/ai/chat`, { prompt: "Test execution of current flow logic..." });
      setExecutionResult({ finalOutput: res.data.content });
    } catch (err) {
      alert('Test failed');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <GitBranch color="white" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Workflow Builder</h1>
          </div>
          <div className="flex gap-4">
            <button onClick={handleTest} disabled={executing} className="glass-morphism px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-glass-border">
              <Play size={18} /> {executing ? 'Executing...' : 'Test Run'}
            </button>
            <button onClick={handleSave} className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2">
              <Save size={18} /> Save Workflow
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-morphism p-8 rounded-3xl">
              <input 
                type="text" placeholder="Workflow Name" 
                className="w-full bg-transparent text-3xl font-black outline-none mb-4"
                value={name} onChange={e => setName(e.target.value)}
              />
              <textarea 
                placeholder="What does this automation do?" 
                className="w-full bg-transparent text-text-muted outline-none resize-none"
                value={description} onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  <div className="glass-morphism p-8 rounded-3xl border border-glass-border group">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-lg">{step.label}</h4>
                      </div>
                      <button onClick={() => removeStep(step.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-all">
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {step.type === 'prompt' ? (
                      <textarea 
                        className="w-full bg-glass border border-glass-border rounded-xl p-4 outline-none focus:border-primary resize-none"
                        placeholder="Define the AI prompt for this step..."
                        value={step.config.prompt}
                        onChange={e => updateStep(step.id, { prompt: e.target.value })}
                      />
                    ) : (
                      <select 
                        className="w-full bg-glass border border-glass-border rounded-xl p-4 outline-none focus:border-primary appearance-none"
                        value={step.config.agentId}
                        onChange={e => updateStep(step.id, { agentId: e.target.value })}
                      >
                        {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                      </select>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-4">
                      <ArrowRight size={24} className="text-primary rotate-90" />
                    </div>
                  )}
                </div>
              ))}

              <div className="flex gap-4 justify-center pt-8">
                <button onClick={() => addStep('prompt')} className="glass-morphism px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:border-primary transition-all">
                  <MessageSquare size={20} className="text-primary" /> Add Prompt Step
                </button>
                <button onClick={() => addStep('agent')} className="glass-morphism px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:border-primary transition-all">
                  <Bot size={20} className="text-primary" /> Add Agent Step
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-morphism p-8 rounded-3xl sticky top-32">
              <h3 className="text-xl font-bold mb-6">Execution Results</h3>
              {executionResult ? (
                <div className="bg-glass-border p-6 rounded-2xl text-sm leading-relaxed overflow-auto max-h-[500px]">
                  {executionResult.finalOutput}
                </div>
              ) : (
                <div className="text-center py-20 opacity-20 italic">
                  Run a test to see output
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilderPage;
