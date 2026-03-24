import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema, type PersonalInfoInput } from '@petroapply/validation';
import { useAuth } from '@/lib/auth';
import { useUpdateProfile } from '@/hooks/useData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, FontSize, Spacing } from '@/lib/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const updateProfile = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      country: profile?.country || '',
      professional_summary: profile?.professional_summary || '',
    },
  });

  const onSubmit = async (data: PersonalInfoInput) => {
    try {
      await updateProfile.mutateAsync(data as any);
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Controller control={control} name="full_name" render={({ field: { onChange, value } }) => (
          <Input label="Full Name" value={value} onChangeText={onChange} error={errors.full_name?.message} />
        )} />

        <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
          <Input label="Phone" value={value || ''} onChangeText={onChange} keyboardType="phone-pad" />
        )} />

        <Controller control={control} name="country" render={({ field: { onChange, value } }) => (
          <Input label="Country" value={value || ''} onChangeText={onChange} />
        )} />

        <Controller control={control} name="professional_summary" render={({ field: { onChange, value } }) => (
          <Input
            label="Professional Summary"
            value={value || ''}
            onChangeText={onChange}
            multiline
            numberOfLines={5}
            style={{ minHeight: 100, textAlignVertical: 'top' }}
          />
        )} />

        <Button
          title="Save Changes"
          onPress={handleSubmit(onSubmit)}
          loading={updateProfile.isPending}
          disabled={!isDirty}
          size="lg"
          style={{ marginTop: Spacing.md }}
        />

        {/* TODO: Add education, experience, skills, certifications, and links editing sections */}
        <View style={styles.todoSection}>
          <Text style={styles.todoTitle}>More Sections Coming</Text>
          <Text style={styles.todoText}>Education, Experience, Skills, Certifications, and Links editing will be added in the next iteration.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  todoSection: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  todoTitle: { color: Colors.textSecondary, fontSize: FontSize.md, fontWeight: '600', marginBottom: Spacing.xs },
  todoText: { color: Colors.textMuted, fontSize: FontSize.sm, lineHeight: 20 },
});
