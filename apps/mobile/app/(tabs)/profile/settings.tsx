import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useAuth } from '@/lib/auth';
import { Colors, FontSize, Spacing, BorderRadius } from '@/lib/theme';

export default function SettingsScreen() {
  const { profile } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Notification Preferences</Text>

      {[
        { label: 'New matching jobs', desc: 'Get notified when jobs match your preferences', key: 'new_jobs' },
        { label: 'Deadline reminders', desc: 'Remind me 48 hours before application deadlines', key: 'deadlines' },
        { label: 'Application updates', desc: 'Status changes on your applications', key: 'app_updates' },
        { label: 'Profile reminders', desc: 'Reminders to complete your profile', key: 'profile' },
      ].map((item) => (
        <View key={item.key} style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingDesc}>{item.desc}</Text>
          </View>
          <Switch
            value={true}
            trackColor={{ false: Colors.surfaceLight, true: Colors.primaryLight }}
            thumbColor={Colors.white}
          />
        </View>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Account</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoValue}>{profile?.email}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Role</Text>
        <Text style={styles.infoValue}>{profile?.role}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Joined</Text>
        <Text style={styles.infoValue}>
          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
        </Text>
      </View>

      {/* TODO: alert configuration, push notification opt-in, data export */}
      <View style={styles.todoSection}>
        <Text style={styles.todoTitle}>More Settings Coming</Text>
        <Text style={styles.todoText}>
          Alert configuration by category/country, push notification enrollment, and data export
          will be available in future updates.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  settingInfo: { flex: 1, marginRight: Spacing.md },
  settingLabel: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  settingDesc: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: { color: Colors.textSecondary, fontSize: FontSize.md },
  infoValue: { color: Colors.text, fontSize: FontSize.md, fontWeight: '500' },
  todoSection: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  todoTitle: { color: Colors.textSecondary, fontSize: FontSize.md, fontWeight: '600', marginBottom: Spacing.xs },
  todoText: { color: Colors.textMuted, fontSize: FontSize.sm, lineHeight: 20 },
});
