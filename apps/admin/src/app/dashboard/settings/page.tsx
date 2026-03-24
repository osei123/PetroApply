'use client';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A261D]">Settings</h1>
        <p className="text-[#0A261D]/60 font-medium text-sm mt-1">Platform configuration</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* General */}
        <div className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-[#0A261D]">General</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-3 border-b border-[#0A261D]/10">
              <div>
                <p className="text-sm font-bold text-[#0A261D]">Platform Name</p>
                <p className="text-xs font-medium text-[#0A261D]/60">PetroApply</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#0A261D]/10">
              <div>
                <p className="text-sm font-bold text-[#0A261D]">API URL</p>
                <p className="text-xs font-medium text-[#0A261D]/60 font-mono">{process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-bold text-[#0A261D]">Version</p>
                <p className="text-xs font-medium text-[#0A261D]/60">1.0.0 (MVP)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Sources */}
        <div className="bg-white/70 backdrop-blur-xl border border-[#0A261D]/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-2 text-[#0A261D]">Job Sources</h2>
          <p className="text-[#0A261D]/60 font-medium text-sm mb-4">Configure where jobs are sourced from</p>
          <div className="space-y-2">
            {[
              { name: 'Manual Entry', status: 'Active', desc: 'Jobs created by admins' },
              { name: 'API Scraper', status: 'Coming Soon', desc: 'Automated job ingestion from partner APIs' },
              { name: 'Partner Feed', status: 'Coming Soon', desc: 'Direct employer job feeds' },
            ].map((source) => (
              <div key={source.name} className="flex items-center justify-between py-3 border-b border-[#0A261D]/10 last:border-0">
                <div>
                  <p className="text-sm font-bold text-[#0A261D]">{source.name}</p>
                  <p className="text-xs font-medium text-[#0A261D]/60 mt-0.5">{source.desc}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${
                  source.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-[#0A261D]/5 text-[#0A261D]/60 border-[#0A261D]/10'
                }`}>
                  {source.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/50 backdrop-blur-xl border border-red-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-red-900/60 font-medium text-sm mb-5">These actions are irreversible. Proceed with caution.</p>
          <button className="bg-red-100/50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:scale-[1.02]">
            Export All Data
          </button>
        </div>
      </div>
    </div>
  );
}
