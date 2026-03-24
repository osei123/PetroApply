import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, type OnboardingInput } from '@petroapply/validation';
import { useAuth } from '@/lib/auth';
import { useUpdateProfile } from '@/hooks/useData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, FontSize, Spacing, BorderRadius } from '@/lib/theme';
import { JOB_TYPE_LABELS, JobType } from '@petroapply/types';

const COUNTRIES = [
  'United States', 'United Kingdom', 'Nigeria', 'Norway', 'UAE',
  'Brazil', 'France', 'Netherlands', 'Australia', 'Malaysia',
  'Canada', 'Qatar', 'Saudi Arabia', 'Angola', 'Ghana',
  'Kazakhstan', 'Indonesia', 'Singapore', 'India', 'Other',
];

const REGIONS = [
  'North America', 'Europe', 'Middle East', 'Africa',
  'Asia Pacific', 'South America', 'Global',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const updateProfile = useUpdateProfile();
  const [step, setStep] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      country: '',
      university: '',
      degree_program: '',
      graduation_year: new Date().getFullYear(),
      area_of_interest: '',
      preferred_job_types: [],
      preferred_regions: [],
      professional_summary: '',
    },
  });

  const preferredJobTypes = watch('preferred_job_types');
  const preferredRegions = watch('preferred_regions');

  const toggleJobType = (type: string) => {
    const current = preferredJobTypes || [];
    if (current.includes(type)) {
      setValue('preferred_job_types', current.filter((t) => t !== type));
    } else {
      setValue('preferred_job_types', [...current, type]);
    }
  };

  const toggleRegion = (region: string) => {
    const current = preferredRegions || [];
    if (current.includes(region)) {
      setValue('preferred_regions', current.filter((r) => r !== region));
    } else {
      setValue('preferred_regions', [...current, region]);
    }
  };

  const onSubmit = async (data: OnboardingInput) => {
    try {
      await updateProfile.mutateAsync({
        ...data,
        onboarding_completed: true,
        profile_completeness: 40,
      } as any);
      await refreshProfile();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const steps = [
    // Step 0: Personal
    <View key="personal">
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepDesc}>Let's start with the basics</Text>

      <Controller control={control} name="full_name" render={({ field: { onChange, value } }) => (
        <Input label="Full Name" placeholder="John Doe" value={value} onChangeText={onChange} error={errors.full_name?.message} />
      )} />
      <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
        <Input label="Phone Number" placeholder="+1 234 567 8900" keyboardType="phone-pad" value={value} onChangeText={onChange} error={errors.phone?.message} />
      )} />
      <Controller control={control} name="country" render={({ field: { onChange, value } }) => (
        <View>
          <Text style={styles.label}>Country</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {COUNTRIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, value === c && styles.chipSelected]}
                onPress={() => onChange(c)}
              >
                <Text style={[styles.chipText, value === c && styles.chipTextSelected]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.country && <Text style={styles.error}>{errors.country.message}</Text>}
        </View>
      )} />
    </View>,

    // Step 1: Education
    <View key="education">
      <Text style={styles.stepTitle}>Education</Text>
      <Text style={styles.stepDesc}>Tell us about your academic background</Text>

      <Controller control={control} name="university" render={({ field: { onChange, value } }) => (
        <Input label="University" placeholder="e.g. Texas A&M University" value={value} onChangeText={onChange} error={errors.university?.message} />
      )} />
      <Controller control={control} name="degree_program" render={({ field: { onChange, value } }) => (
        <Input label="Degree Program" placeholder="e.g. BSc Petroleum Engineering" value={value} onChangeText={onChange} error={errors.degree_program?.message} />
      )} />
      <Controller control={control} name="graduation_year" render={({ field: { onChange, value } }) => (
        <Input label="Graduation Year" placeholder="2025" keyboardType="number-pad" value={String(value || '')} onChangeText={(t) => onChange(parseInt(t) || 0)} error={errors.graduation_year?.message} />
      )} />
      <Controller control={control} name="area_of_interest" render={({ field: { onChange, value } }) => (
        <Input label="Area of Interest" placeholder="e.g. Reservoir Engineering, Data Analytics" value={value} onChangeText={onChange} error={errors.area_of_interest?.message} />
      )} />
    </View>,

    // Step 2: Preferences
    <View key="preferences">
      <Text style={styles.stepTitle}>Preferences</Text>
      <Text style={styles.stepDesc}>Help us match you with relevant opportunities</Text>

      <Text style={styles.label}>Preferred Job Types</Text>
      <View style={styles.chipGrid}>
        {Object.entries(JOB_TYPE_LABELS).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.chip, preferredJobTypes?.includes(key) && styles.chipSelected]}
            onPress={() => toggleJobType(key)}
          >
            <Text style={[styles.chipText, preferredJobTypes?.includes(key) && styles.chipTextSelected]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.preferred_job_types && <Text style={styles.error}>{errors.preferred_job_types.message}</Text>}

      <Text style={[styles.label, { marginTop: Spacing.lg }]}>Preferred Regions</Text>
      <View style={styles.chipGrid}>
        {REGIONS.map((region) => (
          <TouchableOpacity
            key={region}
            style={[styles.chip, preferredRegions?.includes(region) && styles.chipSelected]}
            onPress={() => toggleRegion(region)}
          >
            <Text style={[styles.chipText, preferredRegions?.includes(region) && styles.chipTextSelected]}>{region}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.preferred_regions && <Text style={styles.error}>{errors.preferred_regions.message}</Text>}
    </View>,

    // Step 3: Summary
    <View key="summary">
      <Text style={styles.stepTitle}>Professional Summary</Text>
      <Text style={styles.stepDesc}>A brief description of who you are and what you're looking for</Text>

      <Controller control={control} name="professional_summary" render={({ field: { onChange, value } }) => (
        <Input
          label="Summary"
          placeholder="I am a petroleum engineering student passionate about..."
          multiline
          numberOfLines={5}
          value={value}
          onChangeText={onChange}
          error={errors.professional_summary?.message}
          containerStyle={{ marginBottom: 0 }}
          style={{ minHeight: 120, textAlignVertical: 'top' }}
        />
      )} />
    </View>,
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Progress */}
        <View style={styles.progressRow}>
          {steps.map((_, i) => (
            <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
          ))}
        </View>

        <Text style={styles.stepCount}>Step {step + 1} of {steps.length}</Text>

        {steps[step]}

        <View style={styles.navRow}>
          {step > 0 && (
            <Button title="Back" variant="outline" onPress={() => setStep(step - 1)} style={{ flex: 1, marginRight: Spacing.sm }} />
          )}
          {step < steps.length - 1 ? (
            <Button title="Continue" onPress={() => setStep(step + 1)} style={{ flex: 1 }} />
          ) : (
            <Button title="Complete Setup" onPress={handleSubmit(onSubmit)} loading={updateProfile.isPending} style={{ flex: 1 }} />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  progressRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surfaceLight,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  stepCount: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginBottom: Spacing.lg,
  },
  stepTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  stepDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  chipScroll: {
    marginBottom: Spacing.md,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  chipSelected: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  chipTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  error: {
    color: Colors.error,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
  navRow: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
  },
});
