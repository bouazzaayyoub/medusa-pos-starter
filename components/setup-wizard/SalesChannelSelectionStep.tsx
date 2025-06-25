import { SalesChannelList } from '@/components/SalesChannelList';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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

      <SalesChannelList
        selectedSalesChannelId={selectedSalesChannel}
        onSalesChannelSelect={handleSalesChannelSelect}
      />

      <TouchableOpacity
        className="bg-transparent rounded-xl p-5 items-center border border-gray-200 mt-6"
        onPress={onCreateNew}
      >
        <Text className="text-black text-xl">Create New Sales Channel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-black rounded-xl p-5 items-center mt-4 disabled:bg-gray-100 group"
        onPress={() => onComplete(selectedSalesChannel)}
        disabled={!selectedSalesChannel}
      >
        <Text className="text-white text-xl group-disabled:text-gray-400">
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};
