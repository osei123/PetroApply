'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  TrendingUp,
  Bookmark,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  activeJobs: number;
  totalCompanies: number;
  totalApplications: number;
  totalSavedJobs: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, totalJobs: 0, activeJobs: 0,
    totalCompanies: 0, totalApplications: 0, totalSavedJobs: 0,
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [users, jobs, activeJobs, companies, apps, saved, recent] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('saved_jobs').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*, company:companies(name)').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        totalUsers: users.count || 0,
        totalJobs: jobs.count || 0,
        activeJobs: activeJobs.count || 0,
        totalCompanies: companies.count || 0,
        totalApplications: apps.count || 0,
        totalSavedJobs: saved.count || 0,
      });
      setRecentJobs(recent.data || []);
      setLoading(false);
    }
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Companies', value: stats.totalCompanies, icon: Building2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Applications', value: stats.totalApplications, icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Saved Jobs', value: stats.totalSavedJobs, icon: Bookmark, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A261D]">Dashboard</h1>
        <p className="text-[#0A261D]/60 text-sm mt-1 font-medium">Overview of your PetroApply platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl p-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#073624]/20 hover:-translate-y-1 duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#0A261D]/70 text-sm font-semibold tracking-wide">{stat.label}</span>
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                <stat.icon size={22} className={stat.color} />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-[#0A261D]">
              {loading ? '—' : stat.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 text-[#0A261D]">Recent Jobs</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Type</th>
              <th>Country</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentJobs.map((job) => (
              <tr key={job.id}>
                <td className="font-semibold text-[#0A261D]">{job.title}</td>
                <td className="text-[#0A261D]/70 font-medium">{job.company?.name || '—'}</td>
                <td>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#0A261D]/5 border border-[#0A261D]/10 text-[#0A261D]/80 font-medium">
                    {job.job_type?.replace('_', ' ')}
                  </span>
                </td>
                <td className="text-[#0A261D]/70 font-medium">{job.country || '—'}</td>
                <td>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${
                    job.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
            {recentJobs.length === 0 && !loading && (
              <tr><td colSpan={5} className="text-center text-[#0A261D]/50 font-medium py-8">No jobs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
