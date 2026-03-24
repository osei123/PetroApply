'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, Search, Edit2, Globe } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', website: '', country: '', description: '', industry_segment: '' });
  const [saving, setSaving] = useState(false);

  const loadCompanies = async () => {
    setLoading(true);
    let query = supabase.from('companies').select('*').order('name');
    if (search) query = query.ilike('name', `%${search}%`);
    const { data } = await query;
    setCompanies(data || []);
    setLoading(false);
  };

  useEffect(() => { loadCompanies(); }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('companies').insert(form);
    setForm({ name: '', website: '', country: '', description: '', industry_segment: '' });
    setShowForm(false);
    setSaving(false);
    loadCompanies();
  };

  const inputClass = "w-full bg-white/50 backdrop-blur-md border border-[#0A261D]/10 rounded-xl px-4 py-3 text-[#0A261D] placeholder-[#0A261D]/40 focus:outline-none focus:ring-2 focus:ring-[#073624] focus:border-transparent text-sm shadow-sm transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A261D]">Companies</h1>
          <p className="text-[#0A261D]/60 font-medium text-sm mt-1">{companies.length} companies</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-[#073624] hover:bg-[#031d13] text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm hover:scale-[1.02]"
        >
          <Plus size={18} /> Add Company
        </button>
      </div>

      {/* Inline create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-5 shadow-sm">
          <input className={inputClass} required placeholder="Company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={inputClass} placeholder="Website URL" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <input className={inputClass} placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <input className={inputClass} placeholder="Industry segment" value={form.industry_segment} onChange={(e) => setForm({ ...form, industry_segment: e.target.value })} />
          <textarea className={inputClass + ' md:col-span-2 min-h-[80px]'} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t border-[#0A261D]/10">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-[#0A261D]/50 hover:text-[#0A261D] font-medium transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="bg-[#073624] hover:bg-[#031d13] text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100">
              {saving ? 'Saving...' : 'Save Company'}
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A261D]/50" />
        <input type="text" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-xl pl-12 pr-4 py-3 text-[#0A261D] placeholder-[#0A261D]/40 focus:outline-none focus:ring-2 focus:ring-[#073624] focus:border-transparent text-sm shadow-sm transition-all" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl p-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#073624]/20 hover:-translate-y-1 duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#0A261D]/5 border border-[#0A261D]/10 rounded-xl flex items-center justify-center text-[#0A261D] text-xl font-bold">
                {company.name[0]}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${
                company.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {company.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h3 className="text-[#0A261D] font-bold text-lg leading-tight">{company.name}</h3>
            {company.industry_segment && <p className="text-[#0A261D]/60 font-medium text-xs mt-1.5">{company.industry_segment}</p>}
            {company.country && <p className="text-[#0A261D]/50 font-medium text-xs mt-1">📍 {company.country}</p>}
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#073624] font-semibold text-xs mt-4 hover:underline">
                <Globe size={14} /> Website
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
