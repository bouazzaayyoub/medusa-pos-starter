import { useSalesChannels } from '@/api/hooks/sales-channel';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SalesChannelListProps {
  selectedSalesChannelId: string;
  onSalesChannelSelect: (id: string) => void;
}

const SalesChannelList: React.FC<SalesChannelListProps> = ({
  selectedSalesChannelId,
  onSalesChannelSelect,
}) => {
  const salesChannelsQuery = useSalesChannels();

  if (salesChannelsQuery.isLoading) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-base opacity-70">
          Loading sales channels...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={salesChannelsQuery.data?.pages?.[0]?.sales_channels || []}
        keyExtractor={(item) => item.id}
        className="flex-1"
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`
              bg-gray-50 rounded-xl p-4 mb-3 border-2
              ${
                selectedSalesChannelId === item.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-transparent'
              }
            `}
            onPress={() => onSalesChannelSelect(item.id)}
          >
            <Text className="text-lg font-semibold mb-1">{item.name}</Text>
            {item.description && (
              <Text className="text-sm opacity-70">{item.description}</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export { SalesChannelList };
