// ============================================================
// PetroApply — Data Hooks (TanStack Query)
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { Job, JobFilters, SavedJob, Application, Profile, JobCategory, Company } from '@petroapply/types';

// ── Jobs ─────────────────────────────────────────────────────

export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          company:companies(*),
          category:job_categories(*)
        `)
        .eq('is_active', true)
        .order('date_posted', { ascending: false });

      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }
      if (filters?.country) {
        query = query.eq('country', filters.country);
      }
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters?.job_type) {
        query = query.eq('job_type', filters.job_type);
      }
      if (filters?.work_mode) {
        query = query.eq('work_mode', filters.work_mode);
      }
      if (filters?.sort_by === 'deadline') {
        query = query.order('deadline', { ascending: true, nullsFirst: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Job[];
    },
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(*),
          category:job_categories(*),
          job_tags(tag)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return {
        ...data,
        tags: data.job_tags?.map((t: { tag: string }) => t.tag) || [],
      } as Job;
    },
    enabled: !!id,
  });
}

export function useFeaturedJobs() {
  return useQuery({
    queryKey: ['jobs', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`*, company:companies(*)`)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('date_posted', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as Job[];
    },
  });
}

// ── Categories ──────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as JobCategory[];
    },
    staleTime: 1000 * 60 * 30, // 30 min cache
  });
}

// ── Saved Jobs ──────────────────────────────────────────────

export function useSavedJobs() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['saved-jobs', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`*, job:jobs(*, company:companies(*), category:job_categories(*))`)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SavedJob[];
    },
    enabled: !!user,
  });
}

export function useSavedJobIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['saved-job-ids', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user!.id);
      if (error) throw error;
      return new Set((data || []).map((d) => d.job_id));
    },
    enabled: !!user,
  });
}

export function useToggleSaveJob() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, isSaved }: { jobId: string; isSaved: boolean }) => {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user!.id)
          .eq('job_id', jobId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('saved_jobs')
          .insert({ user_id: user!.id, job_id: jobId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['saved-job-ids'] });
    },
  });
}

// ── Applications ────────────────────────────────────────────

export function useApplications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*, company:companies(*), category:job_categories(*))
        `)
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as Application[];
    },
    enabled: !!user,
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*, company:companies(*)),
          application_documents(*, document:documents(*)),
          application_events(*)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Application;
    },
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      prepNotes,
      documentIds,
    }: {
      jobId: string;
      prepNotes?: string;
      documentIds?: string[];
    }) => {
      // Create application
      const { data: app, error: appError } = await supabase
        .from('applications')
        .insert({
          user_id: user!.id,
          job_id: jobId,
          status: 'preparing',
          prep_notes: prepNotes,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (appError) throw appError;

      // Attach documents
      if (documentIds?.length) {
        const docs = documentIds.map((docId) => ({
          application_id: app.id,
          document_id: docId,
        }));
        await supabase.from('application_documents').insert(docs);
      }

      // Log event
      await supabase.from('application_events').insert({
        application_id: app.id,
        event_type: 'status_change',
        new_status: 'preparing',
        note: 'Application preparation started',
      });

      return app as Application;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      newStatus,
      note,
    }: {
      applicationId: string;
      newStatus: string;
      note?: string;
    }) => {
      // Get current status
      const { data: current } = await supabase
        .from('applications')
        .select('status')
        .eq('id', applicationId)
        .single();

      // Update status
      const updates: any = { status: newStatus };
      if (newStatus === 'applied') updates.applied_at = new Date().toISOString();

      const { error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', applicationId);
      if (error) throw error;

      // Log event
      await supabase.from('application_events').insert({
        application_id: applicationId,
        event_type: 'status_change',
        old_status: current?.status,
        new_status: newStatus,
        note,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application'] });
    },
  });
}

// ── Profile ─────────────────────────────────────────────────

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user!.id)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      refreshProfile();
    },
  });
}

// ── Documents ───────────────────────────────────────────────

export function useDocuments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['documents', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as import('@petroapply/types').Document[];
    },
    enabled: !!user,
  });
}

// ── Companies (admin) ───────────────────────────────────────

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Company[];
    },
  });
}

// ── Notifications ───────────────────────────────────────────

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as import('@petroapply/types').Notification[];
    },
    enabled: !!user,
  });
}

export function useUnreadNotificationCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['notification-count', user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('is_read', false);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 30000, // Poll every 30s
  });
}
