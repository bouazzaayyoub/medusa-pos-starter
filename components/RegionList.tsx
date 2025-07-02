import { useRegions } from '@/api/hooks/regions';
import { CircleAlert } from '@/components/icons/circle-alert';
import { Globe } from '@/components/icons/globe';
import { Loader } from '@/components/icons/loader';
import { clx } from '@/utils/clx';
import React, { Fragment } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface RegionListProps {
  selectedRegionId: string;
  onRegionSelect: (id: string) => void;
}

const RegionList: React.FC<RegionListProps> = ({
  selectedRegionId,
  onRegionSelect,
}) => {
  const regionsQuery = useRegions();

  if (regionsQuery.isLoading) {
    return (
      <View className="flex-row mb-auto border rounded-xl border-border justify-between items-center p-4">
        <Text className="text-base text-gray">Loading regions...</Text>
        <Loader size={16} color="B5B5B5" className="animate-spin" />
      </View>
    );
  }

  if (regionsQuery.isError) {
    return (
      <View className="flex-row mb-auto bg-yellow-light rounded-xl justify-between items-center p-4">
        <Text className="text-base text-yellow">Unable to load regions.</Text>
        <CircleAlert size={16} className="text-yellow" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={regionsQuery.data?.pages?.[0]?.regions || []}
        keyExtractor={(item) => item.id}
        className="border rounded-xl border-b border-border"
        renderItem={({ item, index }) => (
          <Fragment key={item.id}>
            <TouchableOpacity
              className={clx(
                'py-3 justify-between items-center flex-row px-4',
                { 'bg-black': selectedRegionId === item.id }
              )}
              onPress={() => onRegionSelect(item.id)}
            >
              <View className="flex-1">
                <Text
                  className={clx('font-medium', {
                    'text-white': selectedRegionId === item.id,
                  })}
                >
                  {item.name}
                </Text>
                <Text
                  className={clx('text-sm', {
                    'text-gray-light': selectedRegionId === item.id,
                    'text-gray': selectedRegionId !== item.id,
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
            {index <
              (regionsQuery.data?.pages?.[0]?.regions.length || 0) - 1 && (
              <Text className="h-px bg-border mx-4" />
            )}
          </Fragment>
        )}
      />
    </View>
  );
};

export { RegionList };
