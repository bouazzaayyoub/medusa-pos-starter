import { RegionCreateForm } from '@/components/RegionCreateForm';
import { AdminRegion } from '@medusajs/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface RegionCreationStepProps {
  onComplete: (regionId: string) => void;
  onBackToSelection?: () => void;
}

export const RegionCreationStep: React.FC<RegionCreationStepProps> = ({
  onComplete,
  onBackToSelection,
}) => {
  const handleRegionCreated = (region: AdminRegion) => {
    onComplete(region.id);
  };

  return (
    <View className="flex-1">
      <Text className="text-4xl mb-6 font-semibold text-gray-900">
        Setting Up
      </Text>
      <Text className="text-2xl mb-2 text-gray-900">Choose a region</Text>
      <Text className="text-base mb-6 text-gray-400">
        Create a new region that defines your market area, currency, and tax
        settings.
      </Text>

      <RegionCreateForm onRegionCreated={handleRegionCreated} />

      {typeof onBackToSelection === 'function' && (
        <TouchableOpacity
          className="bg-white border mt-4 border-gray-200 rounded-xl items-center justify-center flex-row p-5 disabled:bg-gray-100 disabled:text-gray-400"
          onPress={onBackToSelection}
        >
          <Text className="text-black text-xl">Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
