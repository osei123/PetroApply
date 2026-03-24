// ============================================================
// PetroApply — Shared Types & Enums
// ============================================================

// ── Enums ────────────────────────────────────────────────────

export enum UserRole {
  Student = 'student',
  Admin = 'admin',
  SuperAdmin = 'super_admin',
}

export enum ApplicationStatus {
  Saved = 'saved',
  Preparing = 'preparing',
  Applied = 'applied',
  UnderReview = 'under_review',
  Interview = 'interview',
  Rejected = 'rejected',
  Offer = 'offer',
  Withdrawn = 'withdrawn',
}

export enum JobType {
  FullTime = 'full_time',
  PartTime = 'part_time',
  Contract = 'contract',
  Internship = 'internship',
  GraduateTrainee = 'graduate_trainee',
}

export enum WorkMode {
  Onsite = 'onsite',
  Remote = 'remote',
  Hybrid = 'hybrid',
}

export enum DocumentType {
  CV = 'cv',
  CoverLetter = 'cover_letter',
  Transcript = 'transcript',
  Certificate = 'certificate',
  Other = 'other',
}

export enum JobSourceType {
  Manual = 'manual',
  Scraped = 'scraped',
  Partner = 'partner',
}

// ── Label Maps (for UI display) ─────────────────────────────

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Saved]: 'Saved',
  [ApplicationStatus.Preparing]: 'Preparing',
  [ApplicationStatus.Applied]: 'Applied',
  [ApplicationStatus.UnderReview]: 'Under Review',
  [ApplicationStatus.Interview]: 'Interview',
  [ApplicationStatus.Rejected]: 'Rejected',
  [ApplicationStatus.Offer]: 'Offer',
  [ApplicationStatus.Withdrawn]: 'Withdrawn',
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  [JobType.FullTime]: 'Full Time',
  [JobType.PartTime]: 'Part Time',
  [JobType.Contract]: 'Contract',
  [JobType.Internship]: 'Internship',
  [JobType.GraduateTrainee]: 'Graduate Trainee',
};

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  [WorkMode.Onsite]: 'On-site',
  [WorkMode.Remote]: 'Remote',
  [WorkMode.Hybrid]: 'Hybrid',
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.CV]: 'CV / Resume',
  [DocumentType.CoverLetter]: 'Cover Letter',
  [DocumentType.Transcript]: 'Transcript',
  [DocumentType.Certificate]: 'Certificate',
  [DocumentType.Other]: 'Other',
};

// ── Database Row Types ──────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  university: string | null;
  degree_program: string | null;
  graduation_year: number | null;
  area_of_interest: string | null;
  preferred_job_types: JobType[];
  preferred_regions: string[];
  professional_summary: string | null;
  avatar_url: string | null;
  role: UserRole;
  onboarding_completed: boolean;
  profile_completeness: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  user_id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string | null;
  end_date: string | null;
  gpa: string | null;
  description: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  user_id: string;
  company: string;
  title: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  url: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  user_id: string;
  name: string;
  issuing_organization: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  proficiency: string | null;
  created_at: string;
}

export interface ProfileLink {
  id: string;
  user_id: string;
  link_type: string;
  url: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  document_type: DocumentType;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  country: string | null;
  description: string | null;
  industry_segment: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  company_id: string | null;
  category_id: string | null;
  location: string | null;
  country: string | null;
  work_mode: WorkMode;
  job_type: JobType;
  experience_level: string | null;
  deadline: string | null;
  date_posted: string;
  external_apply_url: string | null;
  short_description: string | null;
  detailed_description: string | null;
  requirements: string | null;
  preferred_qualifications: string | null;
  salary_range: string | null;
  is_featured: boolean;
  is_active: boolean;
  source_type: JobSourceType;
  views_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data (optional)
  company?: Company;
  category?: JobCategory;
  tags?: string[];
}

export interface JobTag {
  id: string;
  job_id: string;
  tag: string;
  created_at: string;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  // Joined
  job?: Job;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  prep_notes: string | null;
  started_at: string | null;
  redirected_at: string | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  job?: Job;
  events?: ApplicationEvent[];
  documents?: ApplicationDocument[];
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_id: string;
  created_at: string;
  // Joined
  document?: Document;
}

export interface ApplicationEvent {
  id: string;
  application_id: string;
  event_type: string;
  old_status: ApplicationStatus | null;
  new_status: ApplicationStatus | null;
  note: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  category_id: string | null;
  country: string | null;
  job_type: JobType | null;
  keywords: string[];
  is_active: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  type: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role: UserRole;
  granted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

// ── Query/Filter Types ──────────────────────────────────────

export interface JobFilters {
  search?: string;
  country?: string;
  location?: string;
  category_id?: string;
  job_type?: JobType;
  work_mode?: WorkMode;
  experience_level?: string;
  sort_by?: 'newest' | 'deadline';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ── Form Input Types ────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  confirm_password: string;
}

export interface OnboardingInput {
  full_name: string;
  phone: string;
  country: string;
  university: string;
  degree_program: string;
  graduation_year: number;
  area_of_interest: string;
  preferred_job_types: JobType[];
  preferred_regions: string[];
  professional_summary: string;
}

export interface JobFormInput {
  title: string;
  company_id: string;
  category_id: string;
  location: string;
  country: string;
  work_mode: WorkMode;
  job_type: JobType;
  experience_level: string;
  deadline: string;
  external_apply_url: string;
  short_description: string;
  detailed_description: string;
  requirements: string;
  preferred_qualifications: string;
  salary_range: string;
  is_featured: boolean;
  is_active: boolean;
  tags: string[];
}

export interface CompanyFormInput {
  name: string;
  website: string;
  country: string;
  description: string;
  industry_segment: string;
}

// ── Job Categories Constants ────────────────────────────────

export const JOB_CATEGORIES = [
  'Petroleum Engineering',
  'Drilling Engineering',
  'Reservoir Engineering',
  'Production Engineering',
  'HSE',
  'Geoscience',
  'Facilities Engineering',
  'Process Engineering',
  'Energy Data Analytics',
  'Internships',
  'Graduate Trainee Programs',
] as const;

// ── Application Status Colors ───────────────────────────────

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Saved]: '#6B7280',
  [ApplicationStatus.Preparing]: '#F59E0B',
  [ApplicationStatus.Applied]: '#3B82F6',
  [ApplicationStatus.UnderReview]: '#8B5CF6',
  [ApplicationStatus.Interview]: '#06B6D4',
  [ApplicationStatus.Rejected]: '#EF4444',
  [ApplicationStatus.Offer]: '#10B981',
  [ApplicationStatus.Withdrawn]: '#9CA3AF',
};
