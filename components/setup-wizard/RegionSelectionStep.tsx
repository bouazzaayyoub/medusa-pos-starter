import { RegionList } from '@/components/RegionList';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import React, { useState } from 'react';
import { View } from 'react-native';

interface RegionSelectionStepProps {
  onComplete: (regionId: string) => void;
  onCreateNew: () => void;
  initialValue?: string;
}

export const RegionSelectionStep: React.FC<RegionSelectionStepProps> = ({
  onComplete,
  onCreateNew,
  initialValue = '',
}) => {
  const [selectedRegion, setSelectedRegion] = useState(initialValue);

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  return (
    <View className="flex-1">
      <Text className="text-4xl mb-6">Setting Up</Text>
      <Text className="text-2xl mb-2">Choose a region</Text>
      <Text className="mb-6 text-gray-300">
        Select a region that defines your market area, currency, and tax settings.
      </Text>

      <RegionList selectedRegionId={selectedRegion} onRegionSelect={handleRegionSelect} />

      <Button variant="outline" className="mt-6" onPress={onCreateNew}>
        Create New Region
      </Button>

      <Button className="mt-4" onPress={() => onComplete(selectedRegion)} disabled={!selectedRegion}>
        Next
      </Button>
    </View>
  );
};
