import { useRegions } from '@/api/hooks/regions';
import { Globe } from '@/components/icons/globe';
import { InfoBanner } from '@/components/InfoBanner';
import { LoadingBanner } from '@/components/LoadingBanner';
import { Text } from '@/components/ui/Text';
import { clx } from '@/utils/clx';
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

interface RegionListProps {
  selectedRegionId: string;
  onRegionSelect: (id: string) => void;
}

const RegionList: React.FC<RegionListProps> = ({ selectedRegionId, onRegionSelect }) => {
  const regionsQuery = useRegions();

  if (regionsQuery.isLoading) {
    return <LoadingBanner className="mb-auto">Loading regions...</LoadingBanner>;
  }

  if (regionsQuery.isError) {
    return <InfoBanner className="mb-auto">Unable to load regions.</InfoBanner>;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={regionsQuery.data?.pages?.[0]?.regions || []}
        keyExtractor={(item) => item.id}
        className="border rounded-xl border-b border-gray-200"
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200 mx-4" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={clx('py-3 justify-between items-center flex-row px-4', {
              'bg-black': selectedRegionId === item.id,
            })}
            onPress={() => onRegionSelect(item.id)}
          >
            <View className="flex-1">
              <Text
                className={clx({
                  'text-white': selectedRegionId === item.id,
                })}
              >
                {item.name}
              </Text>
              <Text
                className={clx('text-sm', {
                  'text-gray-100': selectedRegionId === item.id,
                  'text-gray-300': selectedRegionId !== item.id,
                })}
              >
                {item.currency_code.toUpperCase()}
              </Text>
            </View>
            <Globe
              size={16}
              className={clx({
                'text-white': selectedRegionId === item.id,
              })}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export { RegionList };
