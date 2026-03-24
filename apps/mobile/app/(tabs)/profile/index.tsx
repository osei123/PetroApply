import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { useProfile, useDocuments } from '@/hooks/useData';
import { LoadingScreen } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, Spacing, BorderRadius } from '@/lib/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const { data: documents } = useDocuments();

  if (!profile) return <LoadingScreen />;

  const completeness = profile.profile_completeness || 0;

  const menuItems = [
    {
      icon: 'person-outline' as const,
      label: 'Edit Profile',
      desc: 'Personal info, education, experience',
      route: '/(tabs)/profile/edit',
    },
    {
      icon: 'document-outline' as const,
      label: 'Documents',
      desc: `${documents?.length || 0} documents uploaded`,
      route: '/(tabs)/profile/documents',
    },
    {
      icon: 'settings-outline' as const,
      label: 'Settings & Alerts',
      desc: 'Notifications, preferences',
      route: '/(tabs)/profile/settings',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar & Name */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(profile.full_name || profile.email)[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{profile.full_name || 'Your Name'}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        {profile.university && (
          <Text style={styles.university}>
            {profile.degree_program} · {profile.university}
          </Text>
        )}
      </View>

      {/* Completeness */}
      <View style={styles.completenessCard}>
        <View style={styles.completenessHeader}>
          <Text style={styles.completenessTitle}>Profile Completeness</Text>
          <Text style={[styles.completenessPercent, completeness >= 80 && { color: Colors.accent }]}>
            {completeness}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completeness}%` }]} />
        </View>
        {completeness < 80 && (
          <Text style={styles.completenessHint}>
            Complete your profile to improve your chances with employers
          </Text>
        )}
      </View>

      {/* Summary */}
      {profile.professional_summary && (
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.summaryText}>{profile.professional_summary}</Text>
        </View>
      )}

      {/* Quick Info */}
      <View style={styles.infoGrid}>
        {profile.country && (
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.infoText}>{profile.country}</Text>
          </View>
        )}
        {profile.graduation_year && (
          <View style={styles.infoItem}>
            <Ionicons name="school-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.infoText}>Class of {profile.graduation_year}</Text>
          </View>
        )}
        {profile.area_of_interest && (
          <View style={styles.infoItem}>
            <Ionicons name="flask-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.infoText}>{profile.area_of_interest}</Text>
          </View>
        )}
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon} size={22} color={Colors.primaryLight} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out */}
      <Button
        title="Sign Out"
        onPress={signOut}
        variant="ghost"
        size="md"
        textStyle={{ color: Colors.error }}
        style={{ marginTop: Spacing.xl }}
      />

      <Text style={styles.version}>PetroApply v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  header: { alignItems: 'center', marginBottom: Spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { color: Colors.white, fontSize: FontSize.xxxl, fontWeight: '700' },
  name: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '700' },
  email: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
  university: { color: Colors.textMuted, fontSize: FontSize.sm, marginTop: 4, textAlign: 'center' },
  completenessCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  completenessHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  completenessTitle: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  completenessPercent: { color: Colors.secondary, fontSize: FontSize.lg, fontWeight: '800' },
  progressBar: { height: 6, backgroundColor: Colors.surfaceLight, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.secondary, borderRadius: 3 },
  completenessHint: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: Spacing.sm },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sectionTitle: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600', marginBottom: Spacing.sm },
  summaryText: { color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20 },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { color: Colors.textSecondary, fontSize: FontSize.sm },
  menu: { gap: Spacing.sm },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDark + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuContent: { flex: 1 },
  menuLabel: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  menuDesc: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  version: { color: Colors.textMuted, fontSize: FontSize.xs, textAlign: 'center', marginTop: Spacing.lg },
});
