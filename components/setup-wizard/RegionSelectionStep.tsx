import { RegionList } from '@/components/RegionList';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
      <Text className="text-4xl mb-6 font-semibold text-gray-900">
        Setting Up
      </Text>
      <Text className="text-2xl mb-2 text-gray-900">Choose a region</Text>
      <Text className="text-base mb-6 text-gray-400">
        Select a region that defines your market area, currency, and tax
        settings.
      </Text>

      <RegionList
        selectedRegionId={selectedRegion}
        onRegionSelect={handleRegionSelect}
      />

      <TouchableOpacity
        className="bg-transparent rounded-xl p-5 items-center border border-gray-200 mt-6"
        onPress={onCreateNew}
      >
        <Text className="text-black text-xl">Create New Region</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-black rounded-xl p-5 items-center mt-4 disabled:bg-gray-100 group"
        onPress={() => onComplete(selectedRegion)}
        disabled={!selectedRegion}
      >
        <Text className="text-white text-xl group-disabled:text-gray-400">
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};
