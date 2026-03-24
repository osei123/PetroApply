import DashboardShell from './DashboardShell';

// Prevent Next.js from trying to statically pre-render dashboard pages.
// All dashboard routes require authentication and runtime Supabase access.
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
