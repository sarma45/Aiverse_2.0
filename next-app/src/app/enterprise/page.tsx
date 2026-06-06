import { Shield, Lock, Cpu, Users, Building2, Globe, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import MagneticButton from '@/components/ui/MagneticButton';

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4 pt-32">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 text-indigo-400 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest mb-8 animate-pulse border border-indigo-500/20 backdrop-blur-xl">
            <Shield size={16} /> Enterprise Grade AI
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
            Scale AI with <br />
            <span className="text-indigo-500">Zero Risk</span>
          </h1>
          <p className="text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            The private, secure, and compliant orchestration layer for modern enterprises. Built for scale, designed for absolute data sovereignty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
           <EnterpriseCard 
             icon={<Lock className="text-indigo-500" size={40} />}
             title="Private Deployment"
             description="Deploy AIVerse within your own VPC or air-gapped environment. Complete data sovereignty with zero external egress."
           />
           <EnterpriseCard 
             icon={<Cpu className="text-indigo-500" size={40} />}
             title="Custom Model Training"
             description="Fine-tune Gemini or open-source models on your proprietary business datasets securely. Localized inference."
           />
           <EnterpriseCard 
             icon={<Users className="text-indigo-500" size={40} />}
             title="Advanced Governance"
             description="Role-based access, SSO (SAML/OIDC), and detailed audit logs for every AI interaction. Full compliance readiness."
           />
        </div>

        <div className="bg-white/5 border border-white/10 p-16 rounded-[4rem] relative overflow-hidden backdrop-blur-3xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">Ready to lead the AI revolution?</h2>
              <p className="text-xl text-white/60 mb-10 leading-relaxed">
                Join 500+ global enterprises using AIVerse to automate complex workflows and drive innovation while maintaining peak security standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                 <MagneticButton className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20">
                   Book Executive Demo
                 </MagneticButton>
                 <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 backdrop-blur-xl">
                   View Documentation
                 </button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
               <StatItem label="Uptime" value="99.999%" />
               <StatItem label="SOC2" value="Certified" />
               <StatItem label="Latency" value="<150ms" />
               <StatItem label="Isolation" value="Total" />
            </div>
          </div>
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/5 blur-[120px] -z-0"></div>
        </div>
      </div>
    </div>
  );
}

const EnterpriseCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white/5 border border-white/10 p-12 rounded-[3rem] hover:border-indigo-500/50 transition-all group backdrop-blur-xl">
    <div className="mb-8 bg-white/5 border border-white/5 p-6 w-fit rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{title}</h3>
    <p className="text-white/60 leading-relaxed">{description}</p>
  </div>
);

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-black/40 border border-white/5 p-8 rounded-3xl text-center backdrop-blur-xl hover:border-indigo-500/20 transition-colors">
    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">{label}</div>
    <div className="text-2xl font-black text-white">{value}</div>
  </div>
);
