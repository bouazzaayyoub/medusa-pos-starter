import { SalesChannelList } from '@/components/SalesChannelList';
import { Button } from '@/components/ui/Button';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

interface SalesChannelSelectionStepProps {
  onComplete: (salesChannelId: string) => void;
  onCreateNew: () => void;
  initialValue?: string;
}

export const SalesChannelSelectionStep: React.FC<
  SalesChannelSelectionStepProps
> = ({ onComplete, onCreateNew, initialValue = '' }) => {
  const [selectedSalesChannel, setSelectedSalesChannel] =
    useState(initialValue);

  const handleSalesChannelSelect = (salesChannelId: string) => {
    setSelectedSalesChannel(salesChannelId);
  };

  return (
    <View className="flex-1">
      <Text className="text-4xl mb-6 font-semibold">Setting Up</Text>
      <Text className="text-2xl mb-2">Choose a sales channel</Text>
      <Text className="text-base mb-6 text-gray">
        Select an existing sales channel from the list or create a new one to
        proceed.
      </Text>

      <SalesChannelList
        selectedSalesChannelId={selectedSalesChannel}
        onSalesChannelSelect={handleSalesChannelSelect}
      />

      <Button
        variant="outline"
        size="lg"
        onPress={onCreateNew}
        className="mt-6"
      >
        Create New Sales Channel
      </Button>

      <Button
        size="lg"
        onPress={() => onComplete(selectedSalesChannel)}
        disabled={!selectedSalesChannel}
        className="mt-4"
      >
        Next
      </Button>
    </View>
  );
};
