import { Antenna } from '@/components/icons/antenna';
import { Button } from '@/components/ui/Button';
import { useAuthCtx } from '@/contexts/auth';
import { useSettings } from '@/contexts/settings';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const queryClient = useQueryClient();
  const auth = useAuthCtx();
  const settings = useSettings();
  const bottomTabBarHeight = useBottomTabBarHeight();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          queryClient.clear();
          router.replace('/login');
          await auth.logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-safe" style={{ paddingBottom: bottomTabBarHeight }}>
      <Text className="text-black text-4xl font-semibold mb-6">Settings</Text>

      <Text className="text-2xl mb-4">Sales Channel</Text>
      <Button
        onPress={() => router.push('/setup-wizard')}
        variant="outline"
        icon={<Antenna size={16} />}
        iconPosition="left"
        className="mb-8 justify-end"
      >
        {settings.data?.sales_channel?.name || '—'}
      </Button>

      <Text className="text-2xl mb-4">Stock location</Text>
      <Button
        onPress={() => router.push('/setup-wizard')}
        variant="outline"
        icon={<Antenna size={16} />}
        iconPosition="left"
        className="mb-8 justify-end"
      >
        {settings.data?.stock_location?.name || '—'}
      </Button>

      <Text className="text-2xl mb-4">Account</Text>
      <Button onPress={handleLogout} className="mb-4">
        Log Out
      </Button>

      <Text className="text-gray-300">You will be signed out of your account.</Text>
    </SafeAreaView>
  );
}
