'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Search, Filter, MapPin, Building2, ChevronRight, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  description: string;
  salary: string;
  url: string;
  createdAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchJobs = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/jobs`, { params: { search } });
      setJobs(res.data.data.jobs);
    } catch (err) {
      console.error('Jobs fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
            AI <span className="text-indigo-500">Jobs</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Find your next career move in the intelligence economy. From prompt engineering to ML orchestration.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for ML Engineer, Data Scientist, Prompt Engineer..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-indigo-500 transition-all text-lg shadow-xl backdrop-blur-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white/5 border border-white/10 px-8 py-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-xl">
            <Filter size={20} /> Remote Only
          </button>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {loading ? (
             <div className="text-center py-20">
               <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
             </div>
          ) : jobs.length > 0 ? jobs.map((job) => (
            <div key={job._id} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-indigo-500/50 transition-all group backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                    {job.type}
                  </span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={12} /> {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
                   <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-indigo-500" />
                      <span className="font-bold">{job.company}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-indigo-500" />
                      <span>{job.location}</span>
                   </div>
                   {job.salary && (
                     <div className="text-indigo-400 font-black">
                        {job.salary}
                     </div>
                   )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <a 
                   href={job.url} target="_blank" rel="noopener noreferrer"
                   className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-indigo-600/20 text-center"
                 >
                   Apply Now
                 </a>
                 <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                    <ChevronRight size={20} />
                 </button>
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-2xl -z-0"></div>
            </div>
          )) : (
            <div className="text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10 backdrop-blur-xl">
               <Briefcase className="mx-auto mb-6 opacity-20" size={64} />
               <p className="text-xl text-white/40 italic">No job openings found in this sector yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
