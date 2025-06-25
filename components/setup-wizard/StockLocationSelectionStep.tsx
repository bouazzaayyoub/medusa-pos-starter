import { StockLocationList } from '@/components/StockLocationList';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StockLocationSelectionStepProps {
  onComplete: (stockLocationId: string) => void;
  onCreateNew: () => void;
  initialValue?: string;
}

export const StockLocationSelectionStep: React.FC<
  StockLocationSelectionStepProps
> = ({ onComplete, onCreateNew, initialValue = '' }) => {
  const [selectedStockLocation, setSelectedStockLocation] =
    useState(initialValue);

  const handleStockLocationSelect = (stockLocationId: string) => {
    setSelectedStockLocation(stockLocationId);
  };

  return (
    <View className="flex-1">
      <Text className="text-4xl mb-6 font-semibold text-gray-900">
        Setting Up
      </Text>
      <Text className="text-2xl mb-2 text-gray-900">Select stock location</Text>
      <Text className="text-base mb-6 text-gray-400">
        Select where inventory will be sourced from, or add a new location if
        needed.
      </Text>

      <StockLocationList
        selectedStockLocationId={selectedStockLocation}
        onStockLocationSelect={handleStockLocationSelect}
      />

      <TouchableOpacity
        className="bg-transparent rounded-xl p-5 items-center border border-gray-200 mt-6"
        onPress={onCreateNew}
      >
        <Text className="text-black text-xl">Create a new location</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-black rounded-xl p-5 items-center mt-4 disabled:bg-gray-100 group"
        onPress={() => onComplete(selectedStockLocation)}
        disabled={!selectedStockLocation}
      >
        <Text className="text-white text-xl group-disabled:text-gray-400">
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};
