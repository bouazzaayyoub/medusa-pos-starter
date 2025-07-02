import { useSalesChannels } from '@/api/hooks/sales-channel';
import { Antenna } from '@/components/icons/antenna';
import { CircleAlert } from '@/components/icons/circle-alert';
import { Loader } from '@/components/icons/loader';
import { clx } from '@/utils/clx';
import React, { Fragment } from 'react';
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
      <View className="flex-row mb-auto border rounded-xl border-border justify-between items-center p-4">
        <Text className="text-base text-gray">Loading sales channels...</Text>
        <Loader size={16} color="#B5B5B5" className="animate-spin" />
      </View>
    );
  }

  if (salesChannelsQuery.isError) {
    return (
      <View className="flex-row mb-auto bg-yellow-light rounded-xl justify-between items-center p-4">
        <Text className="text-base text-yellow">
          Unable to load sales channels.
        </Text>
        <CircleAlert size={16} className="text-yellow" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={salesChannelsQuery.data?.pages?.[0]?.sales_channels || []}
        keyExtractor={(item) => item.id}
        className="border rounded-xl border-b border-border"
        renderItem={({ item, index }) => (
          <Fragment key={item.id}>
            <TouchableOpacity
              className={clx(
                'py-3 justify-between items-center flex-row px-4',
                { 'bg-black': selectedSalesChannelId === item.id }
              )}
              onPress={() => onSalesChannelSelect(item.id)}
            >
              <Text
                className={clx({
                  'text-white': selectedSalesChannelId === item.id,
                })}
              >
                {item.name}
              </Text>
              <Antenna
                size={16}
                className={clx({
                  'text-white': selectedSalesChannelId === item.id,
                })}
              />
            </TouchableOpacity>
            {index <
              (salesChannelsQuery.data?.pages?.[0]?.sales_channels.length ||
                0) -
                1 && <Text className="h-px bg-border mx-4" />}
          </Fragment>
        )}
      />
    </View>
  );
};

export { SalesChannelList };
