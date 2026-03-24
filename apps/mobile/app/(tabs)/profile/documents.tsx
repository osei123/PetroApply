import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { useDocuments } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { LoadingScreen, EmptyState } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, Spacing, BorderRadius } from '@/lib/theme';
import { DOCUMENT_TYPE_LABELS, DocumentType } from '@petroapply/types';
import { useQueryClient } from '@tanstack/react-query';

const DOC_TYPE_ICONS: Record<string, string> = {
  cv: 'document-text',
  cover_letter: 'mail',
  transcript: 'school',
  certificate: 'ribbon',
  other: 'attach',
};

export default function DocumentsScreen() {
  const { user } = useAuth();
  const { data: documents, isLoading } = useDocuments();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const pickAndUpload = async (docType: DocumentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) return;

      const file = result.assets[0];
      if (file.size && file.size > 10 * 1024 * 1024) {
        Alert.alert('File Too Large', 'Maximum file size is 10MB');
        return;
      }

      setUploading(true);

      const ext = file.name.split('.').pop();
      const filePath = `${user!.id}/${Date.now()}.${ext}`;

      // Read file and upload
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, blob, { contentType: file.mimeType || 'application/pdf' });

      if (uploadError) throw uploadError;

      // Save metadata
      const { error: dbError } = await supabase.from('documents').insert({
        user_id: user!.id,
        name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.mimeType,
        document_type: docType,
        is_default: docType === 'cv' && !documents?.some((d) => d.document_type === 'cv' && d.is_default),
      });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['documents'] });
      Alert.alert('Success', 'Document uploaded successfully');
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id: string, filePath: string) => {
    Alert.alert('Delete Document', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.storage.from('documents').remove([filePath]);
          await supabase.from('documents').delete().eq('id', id);
          queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
      },
    ]);
  };

  const setAsDefault = async (id: string) => {
    // Unset all CVs as default
    await supabase
      .from('documents')
      .update({ is_default: false })
      .eq('user_id', user!.id)
      .eq('document_type', 'cv');
    // Set this one
    await supabase.from('documents').update({ is_default: true }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  const showUploadMenu = () => {
    Alert.alert('Upload Document', 'Select document type', [
      { text: 'CV / Resume', onPress: () => pickAndUpload(DocumentType.CV) },
      { text: 'Cover Letter', onPress: () => pickAndUpload(DocumentType.CoverLetter) },
      { text: 'Transcript', onPress: () => pickAndUpload(DocumentType.Transcript) },
      { text: 'Certificate', onPress: () => pickAndUpload(DocumentType.Certificate) },
      { text: 'Other', onPress: () => pickAndUpload(DocumentType.Other) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  if (isLoading) return <LoadingScreen message="Loading documents..." />;

  return (
    <View style={styles.container}>
      {/* Upload button */}
      <View style={styles.uploadSection}>
        <Button
          title={uploading ? 'Uploading...' : 'Upload Document'}
          onPress={showUploadMenu}
          loading={uploading}
          disabled={uploading}
          icon={<Ionicons name="cloud-upload-outline" size={18} color={Colors.white} />}
        />
        <Text style={styles.hint}>PDF, DOC, DOCX · Max 10MB</Text>
      </View>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.docCard}>
            <View style={styles.docIcon}>
              <Ionicons
                name={(DOC_TYPE_ICONS[item.document_type] || 'attach') as any}
                size={22}
                color={Colors.primaryLight}
              />
            </View>
            <View style={styles.docInfo}>
              <Text style={styles.docName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.docMeta}>
                <Text style={styles.docType}>
                  {DOCUMENT_TYPE_LABELS[item.document_type]}
                </Text>
                {item.is_default && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
                {item.file_size && (
                  <Text style={styles.docSize}>
                    {(item.file_size / 1024).toFixed(0)} KB
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.docActions}>
              {item.document_type === 'cv' && !item.is_default && (
                <TouchableOpacity onPress={() => setAsDefault(item.id)} style={styles.actionBtn}>
                  <Ionicons name="star-outline" size={18} color={Colors.secondary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => deleteDocument(item.id, item.file_path)}
                style={styles.actionBtn}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="📁"
            title="No documents yet"
            message="Upload your CV, cover letter, transcripts, and certificates"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  uploadSection: {
    padding: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  hint: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: Spacing.sm },
  listContent: { padding: Spacing.md, paddingBottom: Spacing.xxl, flexGrow: 1 },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDark + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  docInfo: { flex: 1 },
  docName: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  docMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 4 },
  docType: { color: Colors.textMuted, fontSize: FontSize.xs },
  defaultBadge: {
    backgroundColor: Colors.secondary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: { color: Colors.secondary, fontSize: 10, fontWeight: '700' },
  docSize: { color: Colors.textMuted, fontSize: FontSize.xs },
  docActions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { padding: 6 },
});
