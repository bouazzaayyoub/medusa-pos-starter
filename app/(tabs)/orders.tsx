import { DateRangeField } from '@/components/form/DateRangeField';
import Form from '@/components/form/Form';
import { MultiSelectField } from '@/components/form/MultiSelectField';
import { CircleAlert } from '@/components/icons/circle-alert';
import { UserRound } from '@/components/icons/user-round';
import { SearchInput } from '@/components/SearchInput';
import { OrderStatus } from '@/components/ui/OrderStatus';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import z from 'zod/v4';

const ordersFilterSchema = z.object({
  status: z.string().optional(),
  dateRange: z
    .object({
      startDate: z.date().nullable(),
      endDate: z.date().nullable(),
    })
    .optional(),
});

const renderItem = () => (
  <TouchableOpacity className="p-4 border justify-between flex-row gap-4 border-border rounded-2xl">
    <View className="gap-4">
      <Text className="text-xl font-medium flex-1 flex-wrap">Order #133232</Text>
      <View className="flex-row gap-1">
        <UserRound size={16} />
        <Text>Jamie Lee</Text>
      </View>
      <Text>€50.99</Text>
    </View>
    <View className="gap-4">
      <Text className="text-gray mb-auto text-right flex-1 flex-wrap">July 6th, 2025</Text>
      <OrderStatus />
    </View>
  </TouchableOpacity>
);

const renderSkeleton = () => (
  <View className="p-4 border gap-2 border-border rounded-2xl">
    <View className="bg-gray-light h-6 w-full rounded-md" />
    <View className="flex-row justify-between">
      <View className="gap-2">
        <View className="bg-gray-light h-4 w-16 rounded-md" />
        <View className="bg-gray-light h-4 w-16 rounded-md" />
      </View>
      <View className="bg-gray-light mt-auto h-4 w-32 rounded-md" />
    </View>
  </View>
);

export default function OrdersScreen() {
  const bottomTabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView className="flex-1 px-4 bg-white">
      <Text className="text-black text-[40px] mt-6 mb-6 font-semibold">My Orders</Text>

      <FlashList
        data={Array.from({ length: 20 })}
        renderItem={renderItem}
        estimatedItemSize={50}
        ItemSeparatorComponent={() => <View className="w-full h-4" />}
        ListFooterComponent={() => <View style={{ height: bottomTabBarHeight }} />}
        ListHeaderComponent={() => (
          <View className="mb-4 gap-y-4">
            <SearchInput placeholder="Search for a specific order..." value="" onChange={() => {}} />
            <Form schema={ordersFilterSchema} onSubmit={() => {}} className="gap-y-4">
              <View className="flex-row items-center gap-2">
                <MultiSelectField
                  name="status"
                  variant="secondary"
                  placeholder="Status"
                  options={[
                    { label: 'All', value: '' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Shipped', value: 'shipped' },
                    { label: 'Delivered', value: 'delivered' },
                  ]}
                  className="flex-1"
                />
                <DateRangeField name="dateRange" placeholder="Date Range" className="flex-1" />
              </View>
            </Form>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center mt-32">
            <CircleAlert size={24} />
            <Text className="mt-2 text-xl text-center">No products match{'\n'} the search</Text>
          </View>
        )}
      />

      <View />
    </SafeAreaView>
  );
}
