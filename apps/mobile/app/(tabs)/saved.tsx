import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSavedJobs, useToggleSaveJob } from '@/hooks/useData';
import { JobCard } from '@/components/JobCard';
import { LoadingScreen, EmptyState } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing } from '@/lib/theme';

export default function SavedJobsScreen() {
  const router = useRouter();
  const { data: savedJobs, isLoading, refetch, isRefetching } = useSavedJobs();
  const toggleSave = useToggleSaveJob();

  if (isLoading) return <LoadingScreen message="Loading saved jobs..." />;

  return (
    <FlatList
      data={savedJobs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <JobCard
          job={item.job!}
          onPress={() => router.push(`/(tabs)/jobs/${item.job_id}`)}
          onSavePress={() => toggleSave.mutate({ jobId: item.job_id, isSaved: true })}
          isSaved
        />
      )}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />
      }
      ListEmptyComponent={
        <EmptyState
          icon="🔖"
          title="No saved jobs yet"
          message="Save jobs you're interested in and they'll appear here"
          action={
            <Button
              title="Browse Jobs"
              onPress={() => router.push('/(tabs)/jobs')}
              variant="outline"
            />
          }
        />
      }
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
    flexGrow: 1,
  },
});
