import { SalesChannelList } from '@/components/SalesChannelList';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/ui/Layout';
import { useSettings, useUpdateSettings } from '@/contexts/settings';
import { router } from 'expo-router';
import * as React from 'react';
import { Text, View } from 'react-native';

export default function SalesChannelScreen() {
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const [selectedSalesChannel, setSelectedSalesChannel] = React.useState(settings.data?.sales_channel?.id || '');

  return (
    <Layout className="pb-2.5">
      <Text className="text-4xl mb-6">Setting Up</Text>
      <Text className="text-2xl mb-2">Choose a sales channel</Text>
      <Text className="mb-6 text-gray-300">
        Select an existing sales channel from the list or create a new one to proceed.
      </Text>

      <SalesChannelList selectedSalesChannelId={selectedSalesChannel} onSalesChannelSelect={setSelectedSalesChannel} />

      <View className="gap-4 mt-6">
        <Button variant="outline" onPress={() => router.replace('/settings/create-sales-channel')}>
          Create New Sales Channel
        </Button>

        <Button
          disabled={!selectedSalesChannel}
          isPending={updateSettings.isPending}
          onPress={() => {
            if (!selectedSalesChannel) {
              return;
            }

            updateSettings.mutate(
              {
                sales_channel_id: selectedSalesChannel,
              },
              {
                onSuccess: () => {
                  router.replace('/settings');
                },
              },
            );
          }}
        >
          Submit
        </Button>

        <Button variant="outline" onPress={() => router.replace('/settings')}>
          Cancel
        </Button>
      </View>
    </Layout>
  );
}
