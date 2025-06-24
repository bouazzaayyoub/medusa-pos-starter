import { StockLocationCreateForm } from '@/components/StockLocationCreateForm';
import { AdminStockLocation } from '@medusajs/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StockLocationCreationStepProps {
  onComplete: (stockLocationId: string) => void;
  onBackToSelection?: () => void;
}

export const StockLocationCreationStep: React.FC<
  StockLocationCreationStepProps
> = ({ onComplete, onBackToSelection }) => {
  const handleStockLocationCreated = (stockLocation: AdminStockLocation) => {
    onComplete(stockLocation.id);
  };

  return (
    <View className="flex-1">
      <Text className="text-4xl mb-6 font-semibold text-gray-900">
        Setting Up
      </Text>
      <Text className="text-2xl mb-2 text-gray-900">
        Create a new stock location
      </Text>
      <Text className="text-base mb-6 text-gray-400">
        Select where inventory will be sourced from, or add a new location if
        needed.
      </Text>

      <View className="mb-4">
        <StockLocationCreateForm
          onStockLocationCreated={handleStockLocationCreated}
        />
      </View>

      {typeof onBackToSelection === 'function' && (
        <TouchableOpacity
          className="bg-white border border-gray-200 rounded-xl items-center justify-center flex-row p-5
        disabled:bg-gray-100 disabled:text-gray-400"
          onPress={onBackToSelection}
        >
          <Text className="text-black text-xl">Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
