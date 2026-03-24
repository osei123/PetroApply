import { Stack } from 'expo-router';
import { Colors } from '@/lib/theme';

export default function ApplicationsLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: Colors.background }, headerTintColor: Colors.text, headerShadowVisible: false }}>
      <Stack.Screen name="index" options={{ title: 'Applications' }} />
    </Stack>
  );
}
