import { useSalesChannels } from '@/api/hooks/sales-channel';
import { Antenna } from '@/components/icons/antenna';
import { CircleAlert } from '@/components/icons/circle-alert';
import { Loader } from '@/components/icons/loader';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

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
      <View className="flex-row mb-auto border rounded-xl border-[#E5E5E5] justify-between items-center p-4">
        <Text className="text-base text-[#B5B5B5]">
          Loading sales channels...
        </Text>
        <Loader size={16} className="text-[#B5B5B5] animate-spin" />
      </View>
    );
  }

  if (salesChannelsQuery.isError) {
    return (
      <View className="flex-row mb-auto bg-[#F8EC9A] rounded-xl justify-between items-center p-4">
        <Text className="text-base text-[#9B8435]">
          Unable to load sales channels.
        </Text>
        <CircleAlert size={16} className="text-[#9B8435]" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={salesChannelsQuery.data?.pages?.[0]?.sales_channels || []}
        keyExtractor={(item) => item.id}
        className="border rounded-xl border-b border-[#EDEDED]"
        renderItem={({ item, index }) => (
          <>
            <TouchableOpacity
              className={`
              py-3 justify-between items-center flex-row px-4
              ${selectedSalesChannelId === item.id && 'bg-black'}
            `}
              onPress={() => onSalesChannelSelect(item.id)}
            >
              <Text
                className={`${selectedSalesChannelId === item.id && 'text-white'}`}
              >
                {item.name}
              </Text>
              <Antenna
                size={16}
                className={`${selectedSalesChannelId === item.id && 'text-white'}`}
              />
            </TouchableOpacity>
            {index <
              (salesChannelsQuery.data?.pages?.[0]?.sales_channels.length ||
                0) -
                1 && <Text className="h-px bg-[#EDEDED] mx-4" />}
          </>
        )}
      />
    </View>
  );
};

export { SalesChannelList };
