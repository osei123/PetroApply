import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyRound, ArrowLeft } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function UpdatePasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Your password has been updated safely', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-900">
      <View className="flex-1 p-6">
        {/* Header */}
        <View className="mb-10 mt-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-surface-800 items-center justify-center mb-6"
          >
            <ArrowLeft size={20} color="#9ca3af" />
          </TouchableOpacity>
          
          <View className="w-16 h-16 rounded-2xl bg-brand-500/20 items-center justify-center mb-6">
            <KeyRound size={32} color="#00E5FF" />
          </View>
          <Text className="text-3xl font-extrabold text-white mb-2">
            Reset Password
          </Text>
          <Text className="text-surface-400 text-base">
            Enter your new secure password below to regain access to your PetroApply account.
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          <View>
            <Text className="text-surface-300 font-medium mb-2 text-sm ml-1">New Password</Text>
            <TextInput
              className="w-full h-14 bg-surface-800 rounded-xl px-4 text-white font-medium border border-surface-700"
              placeholder="••••••••"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            onPress={handleUpdatePassword}
            disabled={loading}
            className={`w-full h-14 bg-brand-600 rounded-xl items-center justify-center mt-4 ${
              loading ? 'opacity-70' : 'active:opacity-80'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-lg">Update Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
