import { useStockLocations } from '@/api/hooks/stock-location';
import { CircleAlert } from '@/components/icons/circle-alert';
import { Loader } from '@/components/icons/loader';
import { MapPin } from '@/components/icons/map-pin';
import { getCountryByAlpha2 } from '@/constants/countries';
import { findProvinceByCode } from '@/constants/provinces';
import { clx } from '@/utils/clx';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface StockLocationListProps {
  selectedStockLocationId: string;
  onStockLocationSelect: (id: string) => void;
}

export const StockLocationList: React.FC<StockLocationListProps> = ({
  selectedStockLocationId,
  onStockLocationSelect,
}) => {
  const stockLocationsQuery = useStockLocations();

  if (stockLocationsQuery.isLoading) {
    return (
      <View className="flex-row mb-auto border rounded-xl border-border justify-between items-center p-4">
        <Text className="text-base text-gray">Loading stock locations...</Text>
        <Loader size={16} color="#B5B5B5" className="animate-spin" />
      </View>
    );
  }

  if (stockLocationsQuery.isError) {
    return (
      <View className="flex-row mb-auto bg-yellow-light rounded-xl justify-between items-center p-4">
        <Text className="text-base text-yellow">Unable to load stock locations.</Text>
        <CircleAlert size={16} className="text-yellow" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={stockLocationsQuery.data?.pages?.[0]?.stock_locations || []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="border rounded-xl border-b overflow-hidden border-[#EDEDED]"
        ItemSeparatorComponent={() => <View className="h-px bg-border mx-4" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={clx('py-3 justify-between items-center flex-row px-4', {
              'bg-black': selectedStockLocationId === item.id,
            })}
            onPress={() => onStockLocationSelect(item.id)}
          >
            <View>
              <Text
                className={clx({
                  'text-white': selectedStockLocationId === item.id,
                })}
              >
                {item.name}
              </Text>
              {item.address && (
                <Text
                  className={clx('text-sm text-gray', {
                    'text-white': selectedStockLocationId === item.id,
                  })}
                >
                  {[
                    item.address.address_1,
                    item.address.address_2,
                    [item.address.postal_code, item.address.city].filter(Boolean).join(' '),
                    item.address.province
                      ? findProvinceByCode(item.address.country_code, item.address.province)?.name ||
                        item.address.province
                      : undefined,
                    getCountryByAlpha2(item.address.country_code)?.name || item.address.country_code,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              )}
            </View>
            <MapPin
              size={16}
              className={clx({
                'text-white': selectedStockLocationId === item.id,
              })}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
