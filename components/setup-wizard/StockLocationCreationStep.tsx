import { StockLocationCreateForm } from '@/components/StockLocationCreateForm';
import { Button } from '@/components/ui/Button';
import { AdminStockLocation } from '@medusajs/types';
import React from 'react';
import { ScrollView, Text } from 'react-native';

interface StockLocationCreationStepProps {
  onComplete: (stockLocationId: string) => void;
  onBackToSelection?: () => void;
}

export const StockLocationCreationStep: React.FC<StockLocationCreationStepProps> = ({
  onComplete,
  onBackToSelection,
}) => {
  const handleStockLocationCreated = (stockLocation: AdminStockLocation) => {
    onComplete(stockLocation.id);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text className="text-4xl mb-6 font-semibold">Setting Up</Text>
      <Text className="text-2xl mb-2">Create a new stock location</Text>
      <Text className="text-base mb-6 text-gray-300">
        Select where inventory will be sourced from, or add a new location if needed.
      </Text>

      <StockLocationCreateForm onStockLocationCreated={handleStockLocationCreated} />

      {typeof onBackToSelection === 'function' && (
        <Button variant="outline" size="lg" className="mt-4" onPress={onBackToSelection}>
          Cancel
        </Button>
      )}
    </ScrollView>
  );
};
