import { StockLocationList } from '@/components/StockLocationList';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/ui/Layout';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

export default function StockLocationScreen() {
  const [selectedStockLocation, setSelectedStockLocation] = useState('');

  return (
    <Layout className="pb-2.5">
      <Text className="text-4xl mb-6">Setting Up</Text>
      <Text className="text-2xl mb-2">Select stock location</Text>
      <Text className="mb-6 text-gray-300">
        Select where inventory will be sourced from, or add a new location if needed.
      </Text>

      <StockLocationList
        selectedStockLocationId={selectedStockLocation}
        onStockLocationSelect={setSelectedStockLocation}
      />

      <Button variant="outline" className="mt-6" onPress={() => router.push('/create-stock-location')}>
        Create a new location
      </Button>

      <Button className="mt-4" onPress={() => router.push('/settings')} disabled={!selectedStockLocation}>
        Submit
      </Button>
    </Layout>
  );
}
