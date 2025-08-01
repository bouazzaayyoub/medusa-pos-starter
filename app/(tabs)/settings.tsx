import { Antenna } from '@/components/icons/antenna';
import { Button } from '@/components/ui/Button';
import { LayoutWithScroll } from '@/components/ui/Layout';
import { Text } from '@/components/ui/Text';
import { useAuthCtx } from '@/contexts/auth';
import { useClearSettings, useSettings } from '@/contexts/settings';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

export default function SettingsScreen() {
  const queryClient = useQueryClient();
  const auth = useAuthCtx();
  const settings = useSettings();
  const clearSettings = useClearSettings();

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
    <LayoutWithScroll>
      <Text className="text-4xl mb-6">Settings</Text>

      <Text className="text-2xl mb-4">Sales Channel</Text>

      <Button
        onPress={() => router.push('/settings/sales-channel')}
        variant="outline"
        icon={<Antenna size={16} />}
        iconPosition="left"
        className="mb-8 justify-end"
      >
        {settings.data?.sales_channel?.name || '—'}
      </Button>

      <Text className="text-2xl mb-4">Region</Text>

      <Button
        onPress={() => router.push('/settings/region')}
        variant="outline"
        icon={<Antenna size={16} />}
        iconPosition="left"
        className="mb-8 justify-end"
      >
        {settings.data?.region?.name || '—'}
      </Button>

      <Text className="text-2xl mb-4">Stock location</Text>

      <Button
        onPress={() => router.push('/stock-location')}
        variant="outline"
        icon={<Antenna size={16} />}
        iconPosition="left"
        className="mb-8 justify-end"
      >
        {settings.data?.stock_location?.name || '—'}
      </Button>

      <Text className="text-2xl mb-4">Reset</Text>

      <Button
        variant="outline"
        onPress={() => {
          clearSettings.mutate();
        }}
        className="mb-8"
      >
        Clear Settings
      </Button>

      <Text className="text-2xl mb-4">Account</Text>

      <Button onPress={handleLogout} className="mb-4">
        Log Out
      </Button>

      <Text className="text-gray-300">You will be signed out of your account.</Text>
    </LayoutWithScroll>
  );
}
