import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { useFeaturedJobs, useApplications, useSavedJobIds } from '@/hooks/useData';
import { JobCard } from '@/components/JobCard';
import { useToggleSaveJob } from '@/hooks/useData';
import { Colors, FontSize, Spacing, BorderRadius } from '@/lib/theme';
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS, ApplicationStatus } from '@petroapply/types';

export default function HomeScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const { data: featuredJobs, isLoading: jobsLoading } = useFeaturedJobs();
  const { data: applications } = useApplications();
  const { data: savedIds } = useSavedJobIds();
  const toggleSave = useToggleSaveJob();

  // Stats
  const appCounts = applications
    ? {
        total: applications.length,
        applied: applications.filter((a) => a.status === 'applied').length,
        interview: applications.filter((a) => a.status === 'interview').length,
        offer: applications.filter((a) => a.status === 'offer').length,
      }
    : { total: 0, applied: 0, interview: 0, offer: 0 };

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Greeting */}
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
        <Text style={styles.subtitle}>Let's find your next opportunity in energy</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Applied', value: appCounts.applied, color: Colors.primaryLight },
          { label: 'Interview', value: appCounts.interview, color: Colors.accent },
          { label: 'Offers', value: appCounts.offer, color: Colors.secondary },
          { label: 'Total', value: appCounts.total, color: Colors.textSecondary },
        ].map((stat) => (
          <TouchableOpacity
            key={stat.label}
            style={styles.statCard}
            onPress={() => router.push('/(tabs)/applications')}
          >
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Profile Completeness */}
      {profile && profile.profile_completeness < 80 && (
        <TouchableOpacity
          style={styles.profileBanner}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <View style={styles.profileBannerContent}>
            <Ionicons name="person-circle-outline" size={24} color={Colors.secondary} />
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Text style={styles.bannerTitle}>Complete your profile</Text>
              <Text style={styles.bannerDesc}>{profile.profile_completeness}% complete</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${profile.profile_completeness}%` }]}
            />
          </View>
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        {[
          { icon: 'search', label: 'Search Jobs', route: '/(tabs)/jobs' },
          { icon: 'bookmark', label: 'Saved Jobs', route: '/(tabs)/saved' },
          { icon: 'document-text', label: 'Documents', route: '/(tabs)/profile/documents' },
          { icon: 'notifications', label: 'Alerts', route: '/(tabs)/profile/settings' },
        ].map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionCard}
            onPress={() => router.push(action.route as any)}
          >
            <Ionicons name={action.icon as any} size={24} color={Colors.primaryLight} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured Jobs */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Opportunities</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {jobsLoading ? (
        <View style={styles.loadingPlaceholder}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.skeleton} />
          ))}
        </View>
      ) : (
        featuredJobs?.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onPress={() => router.push(`/(tabs)/jobs/${job.id}`)}
            onSavePress={() =>
              toggleSave.mutate({
                jobId: job.id,
                isSaved: savedIds?.has(job.id) ?? false,
              })
            }
            isSaved={savedIds?.has(job.id)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: Spacing.md },
  greetingSection: { marginBottom: Spacing.lg },
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  profileBanner: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.secondaryDark + '40',
  },
  profileBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  bannerTitle: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  bannerDesc: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  actionLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAll: {
    color: Colors.primaryLight,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  loadingPlaceholder: { gap: Spacing.md },
  skeleton: {
    height: 120,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
  },
});
