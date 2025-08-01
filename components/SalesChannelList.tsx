import { useSalesChannels } from '@/api/hooks/sales-channel';
import { Antenna } from '@/components/icons/antenna';
import { InfoBanner } from '@/components/InfoBanner';
import { LoadingBanner } from '@/components/LoadingBanner';
import { Text } from '@/components/ui/Text';
import { clx } from '@/utils/clx';
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

interface SalesChannelListProps {
  selectedSalesChannelId: string;
  onSalesChannelSelect: (id: string) => void;
}

const SalesChannelList: React.FC<SalesChannelListProps> = ({ selectedSalesChannelId, onSalesChannelSelect }) => {
  const salesChannelsQuery = useSalesChannels();

  if (salesChannelsQuery.isLoading) {
    return <LoadingBanner className="mb-auto">Loading sales channels...</LoadingBanner>;
  }

  if (salesChannelsQuery.isError) {
    return <InfoBanner className="mb-auto">Unable to load sales channels.</InfoBanner>;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={salesChannelsQuery.data?.pages?.[0]?.sales_channels || []}
        keyExtractor={(item) => item.id}
        className="border rounded-xl border-gray-200 grow-0 shrink"
        contentContainerClassName="grow-0"
        ItemSeparatorComponent={() => <View className="h-hairline bg-gray-200 mx-4" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={clx('py-3 justify-between items-center flex-row gap-2 px-4', {
              'bg-black': selectedSalesChannelId === item.id,
            })}
            onPress={() => onSalesChannelSelect(item.id)}
          >
            <View className="flex-1">
              <Text
                className={clx({
                  'text-white': selectedSalesChannelId === item.id,
                })}
              >
                {item.name}
              </Text>
            </View>
            <Antenna
              size={16}
              className={clx({
                'text-white': selectedSalesChannelId === item.id,
              })}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export { SalesChannelList };
