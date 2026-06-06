'use client';

import Link from 'next/link';
import { Zap, Bot, GitBranch, Users, Cpu, Briefcase, BookOpen, ShoppingBag } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import MagneticButton from '@/components/ui/MagneticButton';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5 py-4 px-8 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
          <Zap color="white" fill="white" size={24} />
        </div>
        <h1 className="text-2xl font-black tracking-tighter uppercase hidden sm:block">AIVERSE</h1>
      </Link>

      <div className="hidden lg:flex gap-6 items-center">
        <NavLink href="/models" icon={<Cpu size={16}/>} label="Models" active={pathname === '/models'} />
        <NavLink href="/agents" icon={<Bot size={16}/>} label="Agents" active={pathname === '/agents'} />
        <NavLink href="/workflows/build" icon={<GitBranch size={16}/>} label="Build" active={pathname === '/workflows/build'} />
        
        <div className="h-4 w-px bg-white/10 mx-2"></div>
        
        <NavLink href="/marketplace/prompts" icon={<ShoppingBag size={16}/>} label="Prompts" active={pathname === '/marketplace/prompts'} />
        <NavLink href="/marketplace/datasets" icon={<ShoppingBag size={16}/>} label="Data" active={pathname === '/marketplace/datasets'} />
        
        <div className="h-4 w-px bg-white/10 mx-2"></div>
        
        <NavLink href="/community" icon={<Users size={16}/>} label="Social" active={pathname === '/community'} />
        <NavLink href="/jobs" icon={<Briefcase size={16}/>} label="Jobs" active={pathname === '/jobs'} />
        <NavLink href="/research" icon={<BookOpen size={16}/>} label="Intel" active={pathname === '/research'} />
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <div className="flex items-center gap-4">
            {(session.user as { role?: string })?.role === 'admin' && (
              <Link href="/admin" className="text-indigo-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-300">Admin</Link>
            )}
            <Link href="/dashboard" className="text-white/60 font-bold text-xs uppercase tracking-widest hover:text-white">Dashboard</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-white/40 hover:text-red-400 text-xs font-bold uppercase tracking-widest">Logout</button>
          </div>
        ) : (
          <MagneticButton 
            onClick={() => router.push('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 uppercase tracking-tight"
          >
            Nexus Login
          </MagneticButton>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${active ? 'text-indigo-400' : 'text-white/40 hover:text-white'}`}
    >
      {icon}
      <span className="hidden xl:inline">{label}</span>
    </Link>
  );
}
