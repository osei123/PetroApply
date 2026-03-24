import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useJob, useSavedJobIds, useToggleSaveJob, useCreateApplication } from '@/hooks/useData';
import { LoadingScreen, ErrorState } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, Spacing, BorderRadius } from '@/lib/theme';
import { JOB_TYPE_LABELS, WORK_MODE_LABELS } from '@petroapply/types';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: job, isLoading, error } = useJob(id!);
  const { data: savedIds } = useSavedJobIds();
  const toggleSave = useToggleSaveJob();
  const createApplication = useCreateApplication();

  const isSaved = savedIds?.has(id!) ?? false;

  const handleApply = async () => {
    if (!job) return;

    try {
      // Create application record
      await createApplication.mutateAsync({ jobId: job.id });

      if (job.external_apply_url) {
        Alert.alert(
          'Continue to Employer Site',
          'You will be redirected to the employer\'s application page. Your preparation has been saved.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Continue',
              onPress: () => Linking.openURL(job.external_apply_url!),
            },
          ]
        );
      } else {
        Alert.alert('Application Started', 'Your application has been saved to your tracker.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to start application. Please try again.');
    }
  };

  if (isLoading) return <LoadingScreen message="Loading job details..." />;
  if (error || !job) return <ErrorState message="Job not found" />;

  const daysUntilDeadline = job.deadline
    ? Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Company Header */}
        <View style={styles.companyHeader}>
          {job.company?.logo_url ? (
            <Image source={{ uri: job.company.logo_url }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>{(job.company?.name || 'C')[0]}</Text>
            </View>
          )}
          <Text style={styles.companyName}>{job.company?.name}</Text>
          {job.company?.website && (
            <TouchableOpacity onPress={() => Linking.openURL(job.company!.website!)}>
              <Text style={styles.companyUrl}>Visit website →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{job.title}</Text>

        {/* Meta badges */}
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.badgeText}>{job.location}, {job.country}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="briefcase-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.badgeText}>{JOB_TYPE_LABELS[job.job_type]}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="laptop-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.badgeText}>{WORK_MODE_LABELS[job.work_mode]}</Text>
          </View>
          {job.experience_level && (
            <View style={styles.badge}>
              <Ionicons name="trending-up-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.badgeText}>{job.experience_level}</Text>
            </View>
          )}
        </View>

        {/* Deadline */}
        {daysUntilDeadline !== null && (
          <View style={[styles.deadlineBanner, daysUntilDeadline <= 7 && styles.deadlineUrgent]}>
            <Ionicons
              name="time-outline"
              size={18}
              color={daysUntilDeadline <= 7 ? Colors.error : Colors.secondary}
            />
            <Text
              style={[styles.deadlineText, daysUntilDeadline <= 7 && { color: Colors.error }]}
            >
              {daysUntilDeadline > 0
                ? `${daysUntilDeadline} days until deadline`
                : 'Deadline passed'}
            </Text>
          </View>
        )}

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {job.tags.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Category */}
        {job.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{job.category.name}</Text>
          </View>
        )}

        {/* Description */}
        {job.short_description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.body}>{job.short_description}</Text>
          </View>
        )}

        {job.detailed_description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.body}>{job.detailed_description}</Text>
          </View>
        )}

        {job.requirements && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <Text style={styles.body}>{job.requirements}</Text>
          </View>
        )}

        {job.preferred_qualifications && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Qualifications</Text>
            <Text style={styles.body}>{job.preferred_qualifications}</Text>
          </View>
        )}

        {job.salary_range && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Salary Range</Text>
            <Text style={styles.body}>{job.salary_range}</Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => toggleSave.mutate({ jobId: job.id, isSaved })}
        >
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? Colors.secondary : Colors.textSecondary}
          />
        </TouchableOpacity>
        <Button
          title={job.external_apply_url ? 'Apply on Employer Site' : 'Start Application'}
          onPress={handleApply}
          loading={createApplication.isPending}
          size="lg"
          style={{ flex: 1 }}
          icon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg },
  companyHeader: { alignItems: 'center', marginBottom: Spacing.lg },
  logo: { width: 64, height: 64, borderRadius: BorderRadius.md },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: Colors.white, fontSize: FontSize.xxl, fontWeight: '700' },
  companyName: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  companyUrl: {
    color: Colors.primaryLight,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: { color: Colors.textSecondary, fontSize: FontSize.sm },
  deadlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.secondaryDark + '40',
  },
  deadlineUrgent: {
    borderColor: Colors.error + '40',
    backgroundColor: Colors.error + '10',
  },
  deadlineText: {
    color: Colors.secondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  tag: {
    backgroundColor: Colors.primaryDark + '40',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  tagText: { color: Colors.primaryLight, fontSize: FontSize.xs },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  categoryText: { color: Colors.accent, fontSize: FontSize.sm, fontWeight: '600' },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg + 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
