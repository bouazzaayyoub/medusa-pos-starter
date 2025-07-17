import { DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL } from '@/api/hooks/draft-orders';
import { useOrders } from '@/api/hooks/orders';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { CircleAlert } from '@/components/icons/circle-alert';
import { Search } from '@/components/icons/search';
import { UserRound } from '@/components/icons/user-round';
import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { OrderStatus } from '@/components/ui/OrderStatus';
import { AdminOrder } from '@medusajs/types';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const isPlaceholderOrder = (
  order: AdminOrder | { id: `placeholder_${string}` },
): order is { id: `placeholder_${string}` } => {
  return typeof order.id === 'string' && order.id.startsWith('placeholder_');
};

const allowedOrderStatuses = ['pending', 'completed', 'draft', 'archived', 'canceled', 'requires_action'] as const;

const isValidOrderStatus = (status: string): status is (typeof allowedOrderStatuses)[number] => {
  return allowedOrderStatuses.includes(status as (typeof allowedOrderStatuses)[number]);
};

export default function OrdersScreen() {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date } | null>(null);

  const validatedStatusFilter = statusFilter.filter(isValidOrderStatus);

  const ordersQuery = useOrders({
    q: searchQuery || undefined,
    fields: '+customer.*,+total,+currency_code',
    order: '-created_at',
    status: validatedStatusFilter.length > 0 ? validatedStatusFilter : undefined,
    created_at: dateRange
      ? {
          $gte: dateRange.startDate.toISOString(),
          $lte: dateRange.endDate.toISOString(),
        }
      : undefined,
  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleOrderPress = React.useCallback((order: AdminOrder) => {
    router.push({
      pathname: '/orders/[orderId]',
      params: { orderId: order.id, orderNumber: order.display_id, orderDate: formatDate(order.created_at) },
    });
  }, []);

  const renderOrder = React.useCallback(
    ({ item }: { item: AdminOrder | { id: `placeholder_${string}` } }) => {
      if (isPlaceholderOrder(item)) {
        return (
          <View className="p-4 border gap-2 border-gray-200 rounded-2xl">
            <View className="bg-gray-200 h-6 w-full rounded-md" />
            <View className="flex-row justify-between">
              <View className="gap-2">
                <View className="bg-gray-200 h-4 w-16 rounded-md" />
                <View className="bg-gray-200 h-4 w-16 rounded-md" />
              </View>
              <View className="bg-gray-200 mt-auto h-4 w-32 rounded-md" />
            </View>
          </View>
        );
      }

      const customerName =
        item.customer?.first_name && item.customer?.last_name
          ? `${item.customer.first_name} ${item.customer.last_name}`
          : item.customer?.email === DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL
            ? 'POS'
            : item.customer?.email || 'Unknown Customer';

      return (
        <TouchableOpacity
          className="p-4 border justify-between flex-row gap-4 border-gray-200 rounded-2xl"
          onPress={() => handleOrderPress(item)}
          activeOpacity={0.7}
        >
          <View className="gap-4 flex-1">
            <View className="flex-1">
              <Text textBreakStrategy="balanced" className="text-xl font-medium shrink">
                Order #{item.display_id || item.id.slice(-6)}
              </Text>
            </View>
            <View className="flex-row gap-1">
              <UserRound size={16} />
              <View className="flex-1">
                <Text textBreakStrategy="balanced" className="shrink">
                  {customerName}
                </Text>
              </View>
            </View>
            <Text>
              {item.total.toLocaleString('en-US', {
                style: 'currency',
                currency: item.currency_code,
                currencyDisplay: 'narrowSymbol',
              })}
            </Text>
          </View>
          <View className="gap-4">
            <Text className="text-gray-300 mb-auto text-right flex-1 flex-wrap">{formatDate(item.created_at)}</Text>
            <OrderStatus order={item} />
          </View>
        </TouchableOpacity>
      );
    },
    [handleOrderPress],
  );

  const data = React.useMemo(() => {
    if (ordersQuery.isLoading) {
      return Array.from({ length: 8 }, (_, index) => ({
        id: `placeholder_${index + 1}` as const,
      }));
    }

    return ordersQuery.data?.pages.flatMap((page) => page.orders) || [];
  }, [ordersQuery]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mx-4 mt-6 mb-6">
        <Text className="text-black text-4xl font-semibold">My Orders</Text>
      </View>

      <View className="mx-4 mb-6 relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-[50%] text-gray-300" />
        <TextInput
          className="rounded-full py-3 pr-4 pl-10 text-base leading-5 border placeholder:text-gray-300 border-gray-200"
          placeholder="Search for a specific order..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          inputMode="search"
        />
      </View>

      <View className="flex-row items-center gap-2 mb-4 px-4">
        <MultiSelectFilter
          variant="secondary"
          placeholder="Status"
          options={[
            { label: 'Pending', value: 'pending' },
            { label: 'Completed', value: 'completed' },
            { label: 'Canceled', value: 'canceled' },
          ]}
          className="flex-1"
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <DateRangeFilter
          value={dateRange}
          onChange={setDateRange}
          placeholder="Date Range"
          className="flex-1"
          maxDate={new Date()}
        />
      </View>

      <View className="flex-1 px-4">
        <FlashList
          data={data}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          estimatedItemSize={120}
          refreshing={ordersQuery.isRefetching}
          ItemSeparatorComponent={() => <View className="w-full h-4" />}
          ListEmptyComponent={
            <View className="flex-1 mt-60 items-center">
              <CircleAlert size={24} />
              <Text className="text-center text-xl mt-1">No orders match{'\n'}the search</Text>
            </View>
          }
          contentContainerStyle={{
            paddingBottom: bottomTabBarHeight,
          }}
          ListFooterComponent={
            ordersQuery.isFetchingNextPage ? (
              <View className="gap-4 mt-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <View key={index} className="p-4 border gap-2 border-gray-200 rounded-2xl">
                    <View className="bg-gray-200 h-6 w-full rounded-md" />
                    <View className="flex-row justify-between">
                      <View className="gap-2">
                        <View className="bg-gray-200 h-4 w-16 rounded-md" />
                        <View className="bg-gray-200 h-4 w-16 rounded-md" />
                      </View>
                      <View className="bg-gray-200 mt-auto h-4 w-32 rounded-md" />
                    </View>
                  </View>
                ))}
              </View>
            ) : null
          }
          onRefresh={() => {
            ordersQuery.refetch();
          }}
          onEndReached={() => {
            if (ordersQuery.hasNextPage && !ordersQuery.isFetchingNextPage) {
              ordersQuery.fetchNextPage();
            }
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
