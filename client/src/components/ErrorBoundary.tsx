import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Sparkles, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass-morphism p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Sparkles className="text-primary" size={40} />
            </div>
            <h2 className="text-3xl font-black mb-4 text-white">Neural Link Interrupted</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Our AI orchestration engine encountered an unexpected anomaly. This is rare, but we're already on it.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3"
            >
              <RefreshCcw size={20} /> Reboot Intelligence
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
