// ============================================================
// PetroApply — Zod Validation Schemas
// ============================================================

import { z } from 'zod';

// ── Auth ─────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// ── Onboarding ──────────────────────────────────────────────

export const onboardingSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(5, 'Please enter a valid phone number'),
  country: z.string().min(1, 'Country is required'),
  university: z.string().min(2, 'University is required'),
  degree_program: z.string().min(2, 'Degree program is required'),
  graduation_year: z
    .number()
    .min(2000, 'Invalid graduation year')
    .max(2035, 'Invalid graduation year'),
  area_of_interest: z.string().min(2, 'Area of interest is required'),
  preferred_job_types: z.array(z.string()).min(1, 'Select at least one job type'),
  preferred_regions: z.array(z.string()).min(1, 'Select at least one region'),
  professional_summary: z
    .string()
    .min(20, 'Summary should be at least 20 characters')
    .max(500, 'Summary should be at most 500 characters'),
});

// ── Profile Sections ────────────────────────────────────────

export const personalInfoSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  country: z.string().optional(),
  professional_summary: z.string().max(500).optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(2, 'Institution is required'),
  degree: z.string().min(2, 'Degree is required'),
  field_of_study: z.string().min(2, 'Field of study is required'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  gpa: z.string().optional(),
  description: z.string().optional(),
  is_current: z.boolean().default(false),
});

export const experienceSchema = z.object({
  company: z.string().min(2, 'Company is required'),
  title: z.string().min(2, 'Title is required'),
  location: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export const certificationSchema = z.object({
  name: z.string().min(2, 'Certification name is required'),
  issuing_organization: z.string().min(2, 'Issuing organization is required'),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  proficiency: z.string().optional(),
});

export const profileLinkSchema = z.object({
  link_type: z.enum(['linkedin', 'github', 'portfolio', 'other']),
  url: z.string().url('Please enter a valid URL'),
  label: z.string().optional(),
});

// ── Admin: Job Form ─────────────────────────────────────────

export const jobFormSchema = z.object({
  title: z.string().min(3, 'Job title is required'),
  company_id: z.string().uuid('Select a company'),
  category_id: z.string().uuid('Select a category'),
  location: z.string().min(2, 'Location is required'),
  country: z.string().min(2, 'Country is required'),
  work_mode: z.enum(['onsite', 'remote', 'hybrid']),
  job_type: z.enum(['full_time', 'part_time', 'contract', 'internship', 'graduate_trainee']),
  experience_level: z.string().optional(),
  deadline: z.string().optional(),
  external_apply_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  short_description: z.string().min(10, 'Short description is required'),
  detailed_description: z.string().optional(),
  requirements: z.string().optional(),
  preferred_qualifications: z.string().optional(),
  salary_range: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
});

// ── Admin: Company Form ─────────────────────────────────────

export const companyFormSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  country: z.string().optional(),
  description: z.string().optional(),
  industry_segment: z.string().optional(),
});

// ── Application Prep ────────────────────────────────────────

export const applicationPrepSchema = z.object({
  cv_document_id: z.string().uuid('Select a CV'),
  cover_letter_id: z.string().uuid().optional(),
  prep_notes: z.string().max(2000).optional(),
});

// ── Type Exports ────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ProfileLinkInput = z.infer<typeof profileLinkSchema>;
export type JobFormInput = z.infer<typeof jobFormSchema>;
export type CompanyFormInput = z.infer<typeof companyFormSchema>;
export type ApplicationPrepInput = z.infer<typeof applicationPrepSchema>;
