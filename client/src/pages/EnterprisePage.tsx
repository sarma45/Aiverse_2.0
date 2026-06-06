import { Shield, CheckCircle, Globe, Users, Zap, ArrowRight, Building2, Lock, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const EnterprisePage = () => {
  return (
    <div className="min-h-screen bg-dark py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest mb-8 animate-pulse border border-primary/20">
            <Shield size={16} /> Enterprise Grade AI
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Scale AI with <br />
            <span className="text-gradient">Zero Risk</span>
          </h1>
          <p className="text-2xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            The private, secure, and compliant orchestration layer for modern enterprises. Built for scale, designed for privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
           <EnterpriseCard 
             icon={<Lock className="text-primary" size={40} />}
             title="Private Deployment"
             description="Deploy AIVerse within your own VPC or air-gapped environment. Complete data sovereignty."
           />
           <EnterpriseCard 
             icon={<Cpu className="text-primary" size={40} />}
             title="Custom Model Training"
             description="Fine-tune Gemini or open-source models on your proprietary business datasets securely."
           />
           <EnterpriseCard 
             icon={<Users className="text-primary" size={40} />}
             title="Advanced Governance"
             description="Role-based access, SSO (SAML/OIDC), and detailed audit logs for every AI interaction."
           />
        </div>

        <div className="glass-morphism p-16 rounded-[4rem] border border-glass-border relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to lead the AI revolution?</h2>
              <p className="text-xl text-text-muted mb-10">
                Join 500+ global enterprises using AIVerse to automate complex workflows and drive innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                 <button className="btn-primary px-12 py-5 rounded-2xl font-black text-lg">
                   Book Executive Demo
                 </button>
                 <button className="glass-morphism px-12 py-5 rounded-2xl font-black text-lg border border-white/10 hover:bg-white/5 transition-all">
                   View Documentation
                 </button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
               <StatItem label="Uptime" value="99.99%" />
               <StatItem label="SOC2" value="Certified" />
               <StatItem label="Latency" value="<200ms" />
               <StatItem label="Models" value="Custom" />
            </div>
          </div>
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] -z-0"></div>
        </div>
      </div>
    </div>
  );
};

const EnterpriseCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="glass-morphism p-12 rounded-[3rem] border border-glass-border hover:border-primary/50 transition-all group">
    <div className="mb-8 bg-glass p-6 w-fit rounded-2xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4">{title}</h3>
    <p className="text-text-muted leading-relaxed">{description}</p>
  </div>
);

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-glass-border/30 p-8 rounded-3xl text-center">
    <div className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">{label}</div>
    <div className="text-2xl font-black text-primary">{value}</div>
  </div>
);

export default EnterprisePage;
