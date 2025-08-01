import { RegionList } from '@/components/RegionList';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/ui/Layout';
import { useSettings, useUpdateSettings } from '@/contexts/settings';
import { router } from 'expo-router';
import * as React from 'react';
import { Text, View } from 'react-native';

export default function RegionScreen() {
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const [selectedRegion, setSelectedRegion] = React.useState(settings.data?.region?.id || '');

  return (
    <Layout className="pb-2.5">
      <Text className="text-4xl mb-6">Setting Up</Text>
      <Text className="text-2xl mb-2">Choose a region</Text>
      <Text className="mb-6 text-gray-300">
        Select a region that defines your market area, currency, and tax settings.
      </Text>

      <RegionList selectedRegionId={selectedRegion} onRegionSelect={setSelectedRegion} />

      <View className="gap-4 mt-6">
        <Button variant="outline" onPress={() => router.push('/settings/create-region')}>
          Create New Region
        </Button>

        <Button
          disabled={!selectedRegion}
          isPending={updateSettings.isPending}
          onPress={() => {
            if (!selectedRegion) {
              return;
            }

            updateSettings.mutate(
              {
                region_id: selectedRegion,
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
