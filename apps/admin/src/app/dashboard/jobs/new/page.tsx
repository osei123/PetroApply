'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewJobPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '', company_id: '', category_id: '', location: '', country: '',
    work_mode: 'onsite', job_type: 'full_time', experience_level: '',
    deadline: '', external_apply_url: '', short_description: '',
    detailed_description: '', requirements: '', preferred_qualifications: '',
    salary_range: '', is_featured: false, is_active: true,
  });

  useEffect(() => {
    supabase.from('companies').select('id, name').order('name').then(({ data }) => setCompanies(data || []));
    supabase.from('job_categories').select('id, name').order('name').then(({ data }) => setCategories(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: dbError } = await supabase.from('jobs').insert({
      ...form,
      company_id: form.company_id || null,
      category_id: form.category_id || null,
      deadline: form.deadline || null,
    });

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard/jobs');
  };

  const inputClass = "w-full bg-surface-900 border border-surface-600 rounded-lg px-4 py-2.5 text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition text-sm";
  const labelClass = "block text-surface-400 text-sm font-medium mb-1.5";
  const selectClass = inputClass;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/jobs" className="text-surface-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Create Job</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface-800 border border-surface-700 rounded-xl p-6 space-y-5">
        <div>
          <label className={labelClass}>Job Title *</label>
          <input className={inputClass} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Reservoir Engineer" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company</label>
            <select className={selectClass} value={form.company_id} onChange={(e) => setForm({ ...form, company_id: e.target.value })}>
              <option value="">Select company</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select className={selectClass} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Location *</label>
            <input className={inputClass} required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Houston" />
          </div>
          <div>
            <label className={labelClass}>Country *</label>
            <input className={inputClass} required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. United States" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Work Mode</label>
            <select className={selectClass} value={form.work_mode} onChange={(e) => setForm({ ...form, work_mode: e.target.value })}>
              <option value="onsite">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Job Type</label>
            <select className={selectClass} value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })}>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="graduate_trainee">Graduate Trainee</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Experience Level</label>
            <input className={inputClass} value={form.experience_level} onChange={(e) => setForm({ ...form, experience_level: e.target.value })} placeholder="e.g. Mid-Level" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Deadline</label>
            <input type="datetime-local" className={inputClass} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Salary Range</label>
            <input className={inputClass} value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} placeholder="e.g. $80,000-$120,000" />
          </div>
        </div>

        <div>
          <label className={labelClass}>External Apply URL</label>
          <input className={inputClass} value={form.external_apply_url} onChange={(e) => setForm({ ...form, external_apply_url: e.target.value })} placeholder="https://careers.company.com/apply" />
        </div>

        <div>
          <label className={labelClass}>Short Description *</label>
          <textarea className={inputClass + ' min-h-[80px]'} required value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} placeholder="Brief overview of the role..." />
        </div>

        <div>
          <label className={labelClass}>Detailed Description</label>
          <textarea className={inputClass + ' min-h-[120px]'} value={form.detailed_description} onChange={(e) => setForm({ ...form, detailed_description: e.target.value })} placeholder="Full job description..." />
        </div>

        <div>
          <label className={labelClass}>Requirements</label>
          <textarea className={inputClass + ' min-h-[80px]'} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="Minimum qualifications and requirements..." />
        </div>

        <div>
          <label className={labelClass}>Preferred Qualifications</label>
          <textarea className={inputClass + ' min-h-[80px]'} value={form.preferred_qualifications} onChange={(e) => setForm({ ...form, preferred_qualifications: e.target.value })} placeholder="Nice-to-have qualifications..." />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-surface-600 bg-surface-900 text-brand-600 focus:ring-brand-500" />
            <span className="text-sm text-surface-300">Featured Job</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-surface-600 bg-surface-900 text-brand-600 focus:ring-brand-500" />
            <span className="text-sm text-surface-300">Active</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-700">
          <Link href="/dashboard/jobs" className="px-4 py-2.5 rounded-lg text-surface-400 hover:text-white transition text-sm font-medium">Cancel</Link>
          <button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50 text-sm">
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
