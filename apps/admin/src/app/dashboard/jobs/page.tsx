'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, Search, Edit2, Archive, Star } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    let query = supabase
      .from('jobs')
      .select('*, company:companies(name), category:job_categories(name)')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data } = await query;
    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => { loadJobs(); }, [search]);

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase.from('jobs').update({ is_active: !isActive }).eq('id', id);
    loadJobs();
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    await supabase.from('jobs').update({ is_featured: !isFeatured }).eq('id', id);
    loadJobs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A261D]">Jobs</h1>
          <p className="text-[#0A261D]/60 font-medium text-sm mt-1">{jobs.length} jobs total</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-2 bg-[#073624] hover:bg-[#031d13] text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm hover:scale-[1.02]"
        >
          <Plus size={18} /> Create Job
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A261D]/50" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-xl pl-12 pr-4 py-3 text-[#0A261D] placeholder-[#0A261D]/40 focus:outline-none focus:ring-2 focus:ring-[#073624] text-sm shadow-sm transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl overflow-hidden shadow-sm">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Category</th>
              <th>Type</th>
              <th>Country</th>
              <th>Featured</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="font-semibold text-[#0A261D] max-w-[250px] truncate">{job.title}</td>
                <td className="text-[#0A261D]/70 font-medium">{job.company?.name || '—'}</td>
                <td className="text-[#0A261D]/60 font-medium text-xs">{job.category?.name || '—'}</td>
                <td>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#0A261D]/5 border border-[#0A261D]/10 text-[#0A261D]/80 font-medium">
                    {job.job_type?.replace('_', ' ')}
                  </span>
                </td>
                <td className="text-[#0A261D]/70 font-medium">{job.country}</td>
                <td>
                  <button onClick={() => toggleFeatured(job.id, job.is_featured)} title="Toggle featured" className="transition-transform hover:scale-110">
                    <Star size={18} className={job.is_featured ? 'text-amber-500 fill-amber-500' : 'text-[#0A261D]/20'} />
                  </button>
                </td>
                <td>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${
                    job.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/jobs/${job.id}`} className="text-[#0A261D]/40 hover:text-[#073624] transition">
                      <Edit2 size={18} />
                    </Link>
                    <button onClick={() => toggleActive(job.id, job.is_active)} className="text-[#0A261D]/40 hover:text-amber-600 transition" title={job.is_active ? 'Archive' : 'Activate'}>
                      <Archive size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && jobs.length === 0 && (
              <tr><td colSpan={8} className="text-center text-[#0A261D]/50 font-medium py-8">No jobs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
