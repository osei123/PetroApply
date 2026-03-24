import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApplications, useUpdateApplicationStatus } from '@/hooks/useData';
import { LoadingScreen, EmptyState } from '@/components/ui/States';
import { Colors, FontSize, Spacing, BorderRadius } from '@/lib/theme';
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  ApplicationStatus,
} from '@petroapply/types';

const STATUS_OPTIONS = Object.values(ApplicationStatus);

export default function ApplicationsScreen() {
  const { data: applications, isLoading, refetch, isRefetching } = useApplications();
  const updateStatus = useUpdateApplicationStatus();
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | null>(null);

  const filtered = filterStatus
    ? applications?.filter((a) => a.status === filterStatus)
    : applications;

  // Status counts for pills
  const statusCounts = applications
    ? STATUS_OPTIONS.reduce((acc, s) => {
        acc[s] = applications.filter((a) => a.status === s).length;
        return acc;
      }, {} as Record<ApplicationStatus, number>)
    : ({} as Record<ApplicationStatus, number>);

  if (isLoading) return <LoadingScreen message="Loading applications..." />;

  return (
    <View style={styles.container}>
      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <TouchableOpacity
          style={[styles.filterChip, !filterStatus && styles.filterChipActive]}
          onPress={() => setFilterStatus(null)}
        >
          <Text style={[styles.filterChipText, !filterStatus && styles.filterChipTextActive]}>
            All ({applications?.length || 0})
          </Text>
        </TouchableOpacity>
        {STATUS_OPTIONS.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterChip,
              filterStatus === status && {
                backgroundColor: APPLICATION_STATUS_COLORS[status] + '20',
                borderColor: APPLICATION_STATUS_COLORS[status],
              },
            ]}
            onPress={() => setFilterStatus(filterStatus === status ? null : status)}
          >
            <View
              style={[styles.statusDot, { backgroundColor: APPLICATION_STATUS_COLORS[status] }]}
            />
            <Text
              style={[
                styles.filterChipText,
                filterStatus === status && { color: APPLICATION_STATUS_COLORS[status] },
              ]}
            >
              {APPLICATION_STATUS_LABELS[status]} ({statusCounts[status] || 0})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Applications List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appCard}>
            <View style={styles.appHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.appTitle} numberOfLines={2}>
                  {item.job?.title || 'Job'}
                </Text>
                <Text style={styles.appCompany}>{item.job?.company?.name || ''}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: APPLICATION_STATUS_COLORS[item.status] + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: APPLICATION_STATUS_COLORS[item.status] }]} />
                <Text style={[styles.statusText, { color: APPLICATION_STATUS_COLORS[item.status] }]}>
                  {APPLICATION_STATUS_LABELS[item.status]}
                </Text>
              </View>
            </View>

            {/* Dates */}
            <View style={styles.appMeta}>
              {item.started_at && (
                <Text style={styles.metaText}>
                  Started: {new Date(item.started_at).toLocaleDateString()}
                </Text>
              )}
              {item.applied_at && (
                <Text style={styles.metaText}>
                  Applied: {new Date(item.applied_at).toLocaleDateString()}
                </Text>
              )}
            </View>

            {/* Quick status update buttons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusActions}>
              {STATUS_OPTIONS.filter((s) => s !== item.status).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.statusActionBtn}
                  onPress={() =>
                    updateStatus.mutate({
                      applicationId: item.id,
                      newStatus: status,
                    })
                  }
                >
                  <Text style={styles.statusActionText}>
                    → {APPLICATION_STATUS_LABELS[status]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📄"
            title="No applications yet"
            message="Start applying to jobs and track your progress here"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  filterRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primary,
  },
  filterChipText: { color: Colors.textSecondary, fontSize: FontSize.xs, fontWeight: '500' },
  filterChipTextActive: { color: Colors.white },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  listContent: { padding: Spacing.md, paddingBottom: Spacing.xxl, flexGrow: 1 },
  appCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  appHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  appTitle: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600', flex: 1 },
  appCompany: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  statusText: { fontSize: FontSize.xs, fontWeight: '600' },
  appMeta: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.sm },
  metaText: { color: Colors.textMuted, fontSize: FontSize.xs },
  statusActions: { marginTop: Spacing.sm },
  statusActionBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceLight,
    marginRight: Spacing.xs,
  },
  statusActionText: { color: Colors.textSecondary, fontSize: FontSize.xs },
});
