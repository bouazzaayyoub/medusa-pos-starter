import { StockLocationList } from '@/components/StockLocationList';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import React, { useState } from 'react';
import { View } from 'react-native';

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
    <View className="flex-1 p-5">
      <Text className="text-4xl mb-6">Setting Up</Text>
      <Text className="text-2xl mb-2">Select stock location</Text>
      <Text className="mb-6 text-gray-300">
        Select where inventory will be sourced from, or add a new location if needed.
      </Text>

      <StockLocationList
        selectedStockLocationId={selectedStockLocation}
        onStockLocationSelect={handleStockLocationSelect}
      />

      <Button variant="outline" className="mt-6" onPress={onCreateNew}>
        Create a new location
      </Button>

      <Button className="mt-4" onPress={() => onComplete(selectedStockLocation)} disabled={!selectedStockLocation}>
        Next
      </Button>
    </View>
  );
};
