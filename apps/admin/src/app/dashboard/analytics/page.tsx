'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number; // users with onboarding complete
  totalJobs: number;
  jobsByCategory: { name: string; count: number }[];
  applicationsByStatus: { status: string; count: number }[];
  savedJobsCount: number;
  completenessDistribution: { range: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [usersRes, activeRes, jobsRes, savedRes, appsRes, profilesRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('onboarding_completed', true),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('saved_jobs').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('status'),
        supabase.from('profiles').select('profile_completeness'),
      ]);

      // Jobs by category
      const { data: catData } = await supabase
        .from('jobs')
        .select('category:job_categories(name)')
        .not('category_id', 'is', null);

      const catCounts: Record<string, number> = {};
      catData?.forEach((j: any) => {
        const name = j.category?.name || 'Uncategorized';
        catCounts[name] = (catCounts[name] || 0) + 1;
      });

      // Applications by status
      const statusCounts: Record<string, number> = {};
      appsRes.data?.forEach((a: any) => {
        statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
      });

      // Profile completeness distribution
      const ranges = [
        { range: '0-20%', min: 0, max: 20 },
        { range: '21-40%', min: 21, max: 40 },
        { range: '41-60%', min: 41, max: 60 },
        { range: '61-80%', min: 61, max: 80 },
        { range: '81-100%', min: 81, max: 100 },
      ];
      const completeness = ranges.map((r) => ({
        range: r.range,
        count: profilesRes.data?.filter((p: any) => p.profile_completeness >= r.min && p.profile_completeness <= r.max).length || 0,
      }));

      setData({
        totalUsers: usersRes.count || 0,
        activeUsers: activeRes.count || 0,
        totalJobs: jobsRes.count || 0,
        savedJobsCount: savedRes.count || 0,
        jobsByCategory: Object.entries(catCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
        applicationsByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
        completenessDistribution: completeness,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !data) {
    return <div className="text-center py-20 text-surface-400">Loading analytics...</div>;
  }

  const statusColors: Record<string, string> = {
    saved: 'bg-gray-500', preparing: 'bg-amber-500', applied: 'bg-blue-500',
    under_review: 'bg-purple-500', interview: 'bg-cyan-500', rejected: 'bg-red-500',
    offer: 'bg-emerald-500', withdrawn: 'bg-gray-400',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A261D]">Analytics</h1>
        <p className="text-[#0A261D]/60 font-medium text-sm mt-1">Platform insights and metrics</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: data.totalUsers },
          { label: 'Onboarded Users', value: data.activeUsers },
          { label: 'Total Jobs', value: data.totalJobs },
          { label: 'Saved Jobs', value: data.savedJobsCount },
        ].map((s) => (
          <div key={s.label} className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl p-6 shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#073624]/20 hover:-translate-y-1 duration-300">
            <p className="text-[#0A261D]/70 font-semibold text-sm tracking-wide">{s.label}</p>
            <p className="text-4xl font-extrabold text-[#0A261D] mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by Category */}
        <div className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-[#0A261D]">Jobs by Category</h2>
          <div className="space-y-4">
            {data.jobsByCategory.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1.5 font-medium">
                    <span className="text-[#0A261D]/70">{cat.name}</span>
                    <span className="text-[#0A261D]/80">{cat.count}</span>
                  </div>
                  <div className="h-2 bg-[#0A261D]/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#073624] rounded-full transition-all"
                      style={{ width: `${(cat.count / data.totalJobs) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications by Status */}
        <div className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-[#0A261D]">Applications by Status</h2>
          {data.applicationsByStatus.length === 0 ? (
            <p className="text-[#0A261D]/50 font-medium text-sm">No application data yet</p>
          ) : (
            <div className="space-y-4">
              {data.applicationsByStatus.map((item) => (
                <div key={item.status} className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full shadow-sm ${statusColors[item.status] || 'bg-gray-500'}`} />
                  <span className="text-[#0A261D]/70 font-medium text-sm flex-1 capitalize">{item.status.replace('_', ' ')}</span>
                  <span className="text-[#0A261D] font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Completeness */}
        <div className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold mb-6 text-[#0A261D]">Profile Completeness Distribution</h2>
          <div className="flex items-end gap-4 h-40">
            {data.completenessDistribution.map((range) => {
              const maxCount = Math.max(...data.completenessDistribution.map((r) => r.count), 1);
              const height = (range.count / maxCount) * 100;
              return (
                <div key={range.range} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-[#0A261D]/60">{range.count}</span>
                  <div className="w-full bg-[#0A261D]/5 rounded-t-xl overflow-hidden" style={{ height: '100%' }}>
                    <div
                      className="w-full bg-[#073624] rounded-t-xl mt-auto transition-all duration-500"
                      style={{ height: `${Math.max(height, 4)}%`, marginTop: `${100 - Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#0A261D]/60 text-center">{range.range}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
