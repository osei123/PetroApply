'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      await supabase.auth.signOut();
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="w-full max-w-md px-4">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#073624] rounded-2xl mb-4 text-3xl shadow-lg shadow-[#0A261D]/20">
            ⛽
          </div>
          <h1 className="text-3xl font-extrabold text-[#0A261D] tracking-tight">PetroApply</h1>
          <p className="text-[#0A261D]/60 font-medium text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 border border-[#0A261D]/10 shadow-[0_20px_60px_-15px_rgba(10,38,29,0.1)]">
          <h2 className="text-xl font-bold mb-6 text-[#0A261D]">Sign In</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[#0A261D]/70 text-sm font-semibold mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#0A261D]/20 rounded-xl px-4 py-3 text-[#0A261D] placeholder-[#0A261D]/40 focus:outline-none focus:ring-2 focus:ring-[#073624] focus:border-transparent transition-all shadow-sm"
              placeholder="admin@petroapply.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#0A261D]/70 text-sm font-semibold mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#0A261D]/20 rounded-xl px-4 py-3 text-[#0A261D] placeholder-[#0A261D]/40 focus:outline-none focus:ring-2 focus:ring-[#073624] focus:border-transparent transition-all shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#073624] hover:bg-[#031d13] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] shadow-md shadow-[#073624]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[#0A261D]/50 font-medium text-xs mt-8">
          PetroApply Operations Core · v1.0.0
        </p>
      </div>
    </div>
  );
}
