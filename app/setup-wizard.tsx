import { useSalesChannels } from '@/api/hooks/sales-channel';
import { useStockLocations } from '@/api/hooks/stock-location';
import { SetupWizardContent } from '@/components/setup-wizard/SetupWizardContent';
import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetupWizardScreen() {
  const salesChannelsQuery = useSalesChannels();
  const stockLocationsQuery = useStockLocations();

  const isLoading =
    salesChannelsQuery.isLoading || stockLocationsQuery.isLoading;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" className="text-blue-500" />
        <Text className="mt-4 text-lg text-gray-600">
          Loading setup data...
        </Text>
      </SafeAreaView>
    );
  }

  const hasSalesChannels =
    (salesChannelsQuery.data?.pages?.[0]?.sales_channels?.length ?? 0) > 0;
  const hasStockLocations =
    (stockLocationsQuery.data?.pages?.[0]?.stock_locations?.length ?? 0) > 0;

  return (
    <SetupWizardContent
      hasSalesChannels={hasSalesChannels}
      hasStockLocations={hasStockLocations}
    />
  );
}
