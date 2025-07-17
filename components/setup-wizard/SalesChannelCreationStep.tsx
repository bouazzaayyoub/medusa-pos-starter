import { SalesChannelCreateForm } from '@/components/SalesChannelCreateForm';
import { Button } from '@/components/ui/Button';
import { AdminSalesChannel } from '@medusajs/types';
import React from 'react';
import { Text, View } from 'react-native';

interface SalesChannelCreationStepProps {
  onComplete: (salesChannelId: string) => void;
  onBackToSelection?: () => void;
}

export const SalesChannelCreationStep: React.FC<SalesChannelCreationStepProps> = ({
  onComplete,
  onBackToSelection,
}) => {
  const handleSalesChannelCreated = (salesChannel: AdminSalesChannel) => {
    onComplete(salesChannel.id);
  };

  return (
    <View className="flex-1">
      <Text className="text-4xl mb-6 font-semibold">Setting Up</Text>
      <Text className="text-2xl mb-2">Choose a sales channel</Text>
      <Text className="text-base mb-6 text-gray-300">
        Select an existing sales channel from the list or create a new one to proceed.
      </Text>

      <SalesChannelCreateForm onSalesChannelCreated={handleSalesChannelCreated} />

      {typeof onBackToSelection === 'function' && (
        <Button variant="outline" size="lg" className="mt-4" onPress={onBackToSelection}>
          Cancel
        </Button>
      )}
    </View>
  );
};
