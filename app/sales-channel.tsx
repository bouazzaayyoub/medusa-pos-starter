import { SalesChannelList } from '@/components/SalesChannelList';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/ui/Layout';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

export default function SalesChannelScreen() {
  const [selectedSalesChannel, setSelectedSalesChannel] = useState('');

  const handleSalesChannelSelect = (salesChannelId: string) => {
    setSelectedSalesChannel(salesChannelId);
  };

  return (
    <Layout className="pb-2.5">
      <Text className="text-4xl mb-6">Setting Up</Text>
      <Text className="text-2xl mb-2">Choose a sales channel</Text>
      <Text className="mb-6 text-gray-300">
        Select an existing sales channel from the list or create a new one to proceed.
      </Text>

      <SalesChannelList selectedSalesChannelId={selectedSalesChannel} onSalesChannelSelect={handleSalesChannelSelect} />

      <Button variant="outline" onPress={() => router.push('/create-sales-channel')} className="mt-6">
        Create New Sales Channel
      </Button>

      <Button disabled={!selectedSalesChannel} onPress={() => router.push('/settings')} className="mt-4">
        Submit
      </Button>
    </Layout>
  );
}
