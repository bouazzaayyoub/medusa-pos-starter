import { StockLocationList } from '@/components/StockLocationList';
import { Button } from '@/components/ui/Button';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

interface StockLocationSelectionStepProps {
  onComplete: (stockLocationId: string) => void;
  onCreateNew: () => void;
  initialValue?: string;
}

export const StockLocationSelectionStep: React.FC<StockLocationSelectionStepProps> = ({
  onComplete,
  onCreateNew,
  initialValue = '',
}) => {
  const [selectedStockLocation, setSelectedStockLocation] = useState(initialValue);

  const handleStockLocationSelect = (stockLocationId: string) => {
    setSelectedStockLocation(stockLocationId);
  };

  return (
    <View className="flex-1">
      <Text className="text-4xl mb-6 font-semibold">Setting Up</Text>
      <Text className="text-2xl mb-2">Select stock location</Text>
      <Text className="text-base mb-6 text-gray-300">
        Select where inventory will be sourced from, or add a new location if needed.
      </Text>

      <StockLocationList
        selectedStockLocationId={selectedStockLocation}
        onStockLocationSelect={handleStockLocationSelect}
      />

      <Button variant="outline" size="lg" className="mt-6" onPress={onCreateNew}>
        Create a new location
      </Button>

      <Button
        size="lg"
        className="mt-4"
        onPress={() => onComplete(selectedStockLocation)}
        disabled={!selectedStockLocation}
      >
        Next
      </Button>
    </View>
  );
};
