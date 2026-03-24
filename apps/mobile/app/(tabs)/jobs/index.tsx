import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useJobs, useCategories, useSavedJobIds, useToggleSaveJob } from '@/hooks/useData';
import { JobCard } from '@/components/JobCard';
import { LoadingScreen, EmptyState } from '@/components/ui/States';
import { Colors, FontSize, Spacing, BorderRadius } from '@/lib/theme';
import type { JobFilters } from '@petroapply/types';
import { JOB_TYPE_LABELS, WORK_MODE_LABELS, JobType, WorkMode } from '@petroapply/types';

export default function JobsListScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState<JobFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const { data: jobs, isLoading, refetch, isRefetching } = useJobs(filters);
  const { data: categories } = useCategories();
  const { data: savedIds } = useSavedJobIds();
  const toggleSave = useToggleSaveJob();

  const updateFilter = useCallback(
    (key: keyof JobFilters, value: any) => {
      setFilters((prev) => {
        const next = { ...prev };
        if (next[key] === value) {
          delete next[key]; // Toggle off
        } else {
          (next as any)[key] = value;
        }
        return next;
      });
    },
    []
  );

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            placeholderTextColor={Colors.placeholder}
            value={filters.search || ''}
            onChangeText={(text) =>
              setFilters((prev) => ({ ...prev, search: text || undefined }))
            }
          />
          {filters.search && (
            <TouchableOpacity
              onPress={() => setFilters((prev) => ({ ...prev, search: undefined }))}
            >
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options" size={20} color={activeFilterCount > 0 ? Colors.white : Colors.textSecondary} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      {showFilters && (
        <View style={styles.filtersSection}>
          {/* Categories */}
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {categories?.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, filters.category_id === cat.id && styles.chipActive]}
                onPress={() => updateFilter('category_id', cat.id)}
              >
                <Text style={[styles.chipText, filters.category_id === cat.id && styles.chipTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Job Type */}
          <Text style={styles.filterLabel}>Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {Object.entries(JOB_TYPE_LABELS).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.chip, filters.job_type === key && styles.chipActive]}
                onPress={() => updateFilter('job_type', key as JobType)}
              >
                <Text style={[styles.chipText, filters.job_type === key && styles.chipTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Work Mode */}
          <Text style={styles.filterLabel}>Work Mode</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {Object.entries(WORK_MODE_LABELS).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.chip, filters.work_mode === key && styles.chipActive]}
                onPress={() => updateFilter('work_mode', key as WorkMode)}
              >
                <Text style={[styles.chipText, filters.work_mode === key && styles.chipTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sort */}
          <Text style={styles.filterLabel}>Sort By</Text>
          <View style={styles.chipRowWrap}>
            <TouchableOpacity
              style={[styles.chip, filters.sort_by === 'newest' && styles.chipActive]}
              onPress={() => updateFilter('sort_by', 'newest')}
            >
              <Text style={[styles.chipText, filters.sort_by === 'newest' && styles.chipTextActive]}>Newest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, filters.sort_by === 'deadline' && styles.chipActive]}
              onPress={() => updateFilter('sort_by', 'deadline')}
            >
              <Text style={[styles.chipText, filters.sort_by === 'deadline' && styles.chipTextActive]}>Deadline</Text>
            </TouchableOpacity>
          </View>

          {activeFilterCount > 0 && (
            <TouchableOpacity onPress={() => setFilters({})} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results Count */}
      {!isLoading && (
        <Text style={styles.resultsCount}>
          {jobs?.length || 0} {jobs?.length === 1 ? 'job' : 'jobs'} found
        </Text>
      )}

      {/* Job List */}
      {isLoading ? (
        <LoadingScreen message="Loading jobs..." />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => router.push(`/(tabs)/jobs/${item.id}`)}
              onSavePress={() =>
                toggleSave.mutate({
                  jobId: item.id,
                  isSaved: savedIds?.has(item.id) ?? false,
                })
              }
              isSaved={savedIds?.has(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="🔍"
              title="No jobs found"
              message="Try adjusting your filters or search terms"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
    paddingVertical: Spacing.sm + 2,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  filtersSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: { marginBottom: Spacing.xs },
  chipRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.xs,
  },
  chipActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primary,
  },
  chipText: { color: Colors.textSecondary, fontSize: FontSize.xs },
  chipTextActive: { color: Colors.white, fontWeight: '600' },
  clearButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  clearButtonText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  resultsCount: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});
