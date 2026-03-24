import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize, Spacing } from '@/lib/theme';
import type { Job } from '@petroapply/types';
import { JOB_TYPE_LABELS, WORK_MODE_LABELS } from '@petroapply/types';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onSavePress?: () => void;
  isSaved?: boolean;
}

export function JobCard({ job, onPress, onSavePress, isSaved }: JobCardProps) {
  const daysUntilDeadline = job.deadline
    ? Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.companyRow}>
          {job.company?.logo_url ? (
            <Image source={{ uri: job.company.logo_url }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>
                {(job.company?.name || 'C')[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {job.title}
            </Text>
            <Text style={styles.company}>{job.company?.name || 'Company'}</Text>
          </View>
        </View>
        {onSavePress && (
          <TouchableOpacity onPress={onSavePress} hitSlop={8}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isSaved ? Colors.secondary : Colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>
            {job.location}{job.country ? `, ${job.country}` : ''}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="briefcase-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>
            {JOB_TYPE_LABELS[job.job_type] || job.job_type}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: Colors.surfaceLight }]}>
            <Text style={styles.badgeText}>{WORK_MODE_LABELS[job.work_mode]}</Text>
          </View>
          {job.is_featured && (
            <View style={[styles.badge, { backgroundColor: Colors.secondaryDark + '30' }]}>
              <Ionicons name="star" size={10} color={Colors.secondary} />
              <Text style={[styles.badgeText, { color: Colors.secondary }]}>Featured</Text>
            </View>
          )}
        </View>
        {daysUntilDeadline !== null && daysUntilDeadline > 0 && (
          <Text
            style={[
              styles.deadline,
              daysUntilDeadline <= 7 && { color: Colors.error },
            ]}
          >
            {daysUntilDeadline}d left
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  companyRow: {
    flexDirection: 'row',
    flex: 1,
    gap: Spacing.md,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
  },
  logoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
    lineHeight: 22,
  },
  company: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  deadline: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
});
