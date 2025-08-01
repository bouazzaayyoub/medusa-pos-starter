import { StockLocationList } from '@/components/StockLocationList';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/ui/Layout';
import { useSettings, useUpdateSettings } from '@/contexts/settings';
import { router } from 'expo-router';
import * as React from 'react';
import { Text, View } from 'react-native';

export default function StockLocationScreen() {
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const [selectedStockLocation, setSelectedStockLocation] = React.useState(settings.data?.stock_location?.id || '');

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

      <View className="gap-4 mt-6">
        <Button variant="outline" onPress={() => router.push('/settings/create-stock-location')}>
          Create New Stock Location
        </Button>

        <Button
          disabled={!selectedStockLocation}
          isPending={updateSettings.isPending}
          onPress={() => {
            if (!selectedStockLocation) {
              return;
            }

            updateSettings.mutate(
              {
                stock_location_id: selectedStockLocation,
              },
              {
                onSuccess: () => {
                  router.back();
                },
              },
            );
          }}
        >
          Submit
        </Button>

        <Button variant="outline" onPress={() => router.back()}>
          Cancel
        </Button>
      </View>
    </Layout>
  );
}
