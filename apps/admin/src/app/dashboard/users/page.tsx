'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      const { data } = await query;
      setUsers(data || []);
      setLoading(false);
    }
    load();
  }, [search]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A261D]">Users</h1>
        <p className="text-[#0A261D]/60 font-medium text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A261D]/50" />
        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-xl pl-12 pr-4 py-3 text-[#0A261D] placeholder-[#0A261D]/40 focus:outline-none focus:ring-2 focus:ring-[#073624] focus:border-transparent text-sm shadow-sm transition-all" />
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl overflow-hidden shadow-sm">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Country</th>
              <th>University</th>
              <th>Role</th>
              <th>Onboarded</th>
              <th>Completeness</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-semibold text-[#0A261D]">{user.full_name || '—'}</td>
                <td className="text-[#0A261D]/70 font-medium">{user.email}</td>
                <td className="text-[#0A261D]/70 font-medium">{user.country || '—'}</td>
                <td className="text-[#0A261D]/60 text-xs font-medium">{user.university || '—'}</td>
                <td>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                    user.role === 'super_admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    user.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-[#0A261D]/5 text-[#0A261D]/70 border-[#0A261D]/10'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`text-xs font-bold ${user.onboarding_completed ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {user.onboarding_completed ? '✓ Yes' : '✗ No'}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-[#0A261D]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#073624] rounded-full" style={{ width: `${user.profile_completeness}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-[#0A261D]/60">{user.profile_completeness}%</span>
                  </div>
                </td>
                <td className="text-[#0A261D]/50 font-medium text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr><td colSpan={8} className="text-center text-[#0A261D]/50 font-medium py-8">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
