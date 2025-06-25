import { SalesChannelCreateForm } from '@/components/SalesChannelCreateForm';
import { AdminSalesChannel } from '@medusajs/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SalesChannelCreationStepProps {
  onComplete: (salesChannelId: string) => void;
  onBackToSelection?: () => void;
}

export const SalesChannelCreationStep: React.FC<
  SalesChannelCreationStepProps
> = ({ onComplete, onBackToSelection }) => {
  const handleSalesChannelCreated = (salesChannel: AdminSalesChannel) => {
    onComplete(salesChannel.id);
  };

  return (
    <View className="flex-1">
      <Text className="text-4xl mb-6 font-semibold text-gray-900">
        Setting Up
      </Text>
      <Text className="text-2xl mb-2 text-gray-900">
        Choose a sales channel
      </Text>
      <Text className="text-base mb-6 text-gray-400">
        Select an existing sales channel from the list or create a new one to
        proceed.
      </Text>

      <SalesChannelCreateForm
        onSalesChannelCreated={handleSalesChannelCreated}
      />

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
