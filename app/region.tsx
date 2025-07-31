import { RegionList } from '@/components/RegionList';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/ui/Layout';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

export default function RegionScreen() {
  const [selectedRegion, setSelectedRegion] = useState('');

  return (
    <Layout>
      <Text className="text-4xl mb-6">Setting Up</Text>
      <Text className="text-2xl mb-2">Choose a region</Text>
      <Text className="mb-6 text-gray-300">
        Select a region that defines your market area, currency, and tax settings.
      </Text>

      <RegionList selectedRegionId={selectedRegion} onRegionSelect={setSelectedRegion} />

      <Button variant="outline" className="mt-6" onPress={() => router.push('/create-region')}>
        Create New Region
      </Button>

      <Button className="mt-4" onPress={() => router.push('/settings')} disabled={!selectedRegion}>
        Submit
      </Button>
    </Layout>
  );
}
