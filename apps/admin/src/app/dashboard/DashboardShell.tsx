'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/dashboard/companies', label: 'Companies', icon: Building2 },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/login');
        return;
      }
      setUserEmail(user.email || '');
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-[#0A261D]/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-[#0A261D]/10 shadow-[4px_0_24px_-12px_rgba(10,38,29,0.1)] transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#0A261D]/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#073624] flex items-center justify-center text-white shadow-sm">
              <span className="text-xl leading-none -mt-0.5">⛽</span>
            </div>
            <span className="text-lg font-bold text-[#0A261D]">PetroApply</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#0A261D]/50 hover:text-[#0A261D] transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#073624]/10 text-[#073624] border border-[#073624]/20 font-semibold shadow-sm'
                    : 'text-[#0A261D]/70 font-medium hover:text-[#0A261D] hover:bg-[#0A261D]/5'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#0A261D]/10 bg-white/50">
          <div className="flex items-center justify-between mb-2">
            <div className="truncate px-2">
              <p className="text-sm font-semibold text-[#0A261D] truncate">{userEmail}</p>
              <p className="text-xs text-[#0A261D]/60 font-medium">System Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-[#0A261D]/60 hover:text-red-600 hover:bg-red-50 text-sm font-medium w-full px-2 py-2.5 rounded-xl transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 px-6 flex items-center justify-between border-b border-[#0A261D]/5 bg-white/60 backdrop-blur-md sticky top-0 z-30 shadow-[0_4px_24px_-12px_rgba(10,38,29,0.05)]">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#0A261D]/50 hover:text-[#0A261D] transition-colors">
              <Menu size={20} />
            </button>
            <div className="flex items-center text-sm font-semibold text-[#0A261D]/80">
              {sidebarLinks.find((l) => pathname.startsWith(l.href))?.label || 'Dashboard'}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
