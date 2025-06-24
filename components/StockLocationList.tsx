import { useStockLocations } from '@/api/hooks/stock-location';
import { getCountryByAlpha2 } from '@/constants/countries';
import { findProvinceByCode } from '@/constants/provinces';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
      <View className="flex-1 justify-center items-center p-5">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-base opacity-70">
          Loading stock locations...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={stockLocationsQuery.data?.pages?.[0]?.stock_locations || []}
        keyExtractor={(item) => item.id}
        className="flex-1"
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`
              bg-gray-50 rounded-xl p-4 mb-3 border-2
              ${
                selectedStockLocationId === item.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-transparent'
              }
            `}
            onPress={() => onStockLocationSelect(item.id)}
          >
            <Text className="text-lg font-semibold mb-1">{item.name}</Text>
            {item.address && (
              <Text className="text-sm opacity-70">
                {[
                  item.address.address_1,
                  item.address.address_2,
                  [item.address.postal_code, item.address.city]
                    .filter(Boolean)
                    .join(' '),
                  item.address.province
                    ? findProvinceByCode(
                        item.address.country_code,
                        item.address.province,
                      )?.name || item.address.province
                    : undefined,
                  getCountryByAlpha2(item.address.country_code)?.name ||
                    item.address.country_code,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
