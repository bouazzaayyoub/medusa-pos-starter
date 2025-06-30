import { useProducts } from '@/api/hooks/products';
import { CircleAlert } from '@/components/icons/circle-alert';
import { Search } from '@/components/icons/search';
import { useSettings } from '@/contexts/settings';
import { AdminProduct } from '@medusajs/types';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const settings = useSettings();
  const tabBarHeight = useBottomTabBarHeight();
  const [searchQuery, setSearchQuery] = useState('');
  const productsQuery = useProducts({
    q: searchQuery ? searchQuery : undefined,
    sales_channel_id: settings.data?.sales_channel?.id ?? undefined,
    fields: '+variants.prices.*',
  });

  const handleProductPress = React.useCallback((product: AdminProduct) => {
    router.push({
      pathname: '/product-details',
      params: { productId: product.id, productName: product.title },
    });
  }, []);

  const renderProduct = React.useCallback(
    ({ item }: { item: AdminProduct }) => {
      const thumbnail = item.thumbnail || item.images?.[0]?.url;
      const variant_prices = (item.variants ?? [])
        .flatMap((variant) =>
          variant.prices?.filter(
            (price) =>
              price.currency_code === settings.data?.region?.currency_code,
          ),
        )
        .filter((price) => typeof price !== 'undefined');
      const currency_code = variant_prices[0]?.currency_code ?? undefined;
      const amounts = variant_prices.map((price) => price.amount);
      const minPrice = amounts.length ? Math.min(...amounts) : undefined;
      const maxPrice = amounts.length ? Math.max(...amounts) : undefined;

      return (
        <View className="px-1 w-full">
          <TouchableOpacity
            className="flex w-full gap-4"
            onPress={() => handleProductPress(item)}
            activeOpacity={0.7}
          >
            <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden">
              {thumbnail && (
                <Image
                  source={{ uri: thumbnail }}
                  className="w-full h-full object-cover"
                />
              )}
            </View>
            <View>
              <Text className="mb-1 font-light">{item.title}</Text>
              {/* TODO: display discounted price */}
              <Text className="font-bold">
                {amounts.length === 0 ||
                (typeof minPrice !== 'number' && typeof maxPrice !== 'number')
                  ? 'No price available'
                  : minPrice === maxPrice
                  ? minPrice?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: currency_code,
                      currencyDisplay: 'narrowSymbol',
                    })
                  : `${minPrice?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: currency_code,
                      currencyDisplay: 'narrowSymbol',
                    })} — ${maxPrice?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: currency_code,
                      currencyDisplay: 'narrowSymbol',
                    })}`}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [settings.data?.region?.currency_code],
  );

  const data = React.useMemo(() => {
    return productsQuery.data?.pages.flatMap((page) => page.products) || [];
  }, [productsQuery]);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingBottom: tabBarHeight }}
    >
      <StatusBar style="auto" />

      <View className="m-4 mb-6 relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-[50%] text-gray"
        />
        <TextInput
          className="rounded-full leading-snug pb-3 pt-2 pr-4 pl-10 text-base border placeholder:text-gray border-border"
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* TODO: show initial loading data */}
      <View className="flex-1 px-3">
        <FlashList
          data={data}
          numColumns={2}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          estimatedItemSize={70}
          refreshing={productsQuery.isRefetching}
          ItemSeparatorComponent={() => <View className="w-full h-6" />}
          ListEmptyComponent={
            <View className="flex-1 mt-60 items-center">
              <CircleAlert size={24} />
              <Text className="text-center text-xl mt-1">
                No products match{'\n'}the search
              </Text>
            </View>
          }
          ListFooterComponent={
            productsQuery.isFetchingNextPage ? (
              <View className="flex-row flex-wrap">
                <View className="flex w-1/2 mb-6 px-1">
                  <View className="flex-1 gap-4">
                    <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden" />
                    <View>
                      <View className="mb-1 h-4 rounded-md bg-gray-200" />
                      <View className="mb-1 h-4 w-1/3 rounded-md bg-gray-200" />
                    </View>
                  </View>
                </View>
                <View className="flex w-1/2 mb-6 px-1">
                  <View className="flex-1 gap-4">
                    <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden" />
                    <View>
                      <View className="mb-1 h-4 rounded-md bg-gray-200" />
                      <View className="mb-1 h-4 w-1/3 rounded-md bg-gray-200" />
                    </View>
                  </View>
                </View>
                <View className="flex w-1/2 mb-6 px-1">
                  <View className="flex-1 gap-4">
                    <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden" />
                    <View>
                      <View className="mb-1 h-4 rounded-md bg-gray-200" />
                      <View className="mb-1 h-4 w-1/3 rounded-md bg-gray-200" />
                    </View>
                  </View>
                </View>
                <View className="flex w-1/2 mb-6 px-1">
                  <View className="flex-1 gap-4">
                    <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden" />
                    <View>
                      <View className="mb-1 h-4 rounded-md bg-gray-200" />
                      <View className="mb-1 h-4 w-1/3 rounded-md bg-gray-200" />
                    </View>
                  </View>
                </View>
                <View className="flex w-1/2 mb-6 px-1">
                  <View className="flex-1 gap-4">
                    <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden" />
                    <View>
                      <View className="mb-1 h-4 rounded-md bg-gray-200" />
                      <View className="mb-1 h-4 w-1/3 rounded-md bg-gray-200" />
                    </View>
                  </View>
                </View>
                <View className="flex w-1/2 mb-6 px-1">
                  <View className="flex-1 gap-4">
                    <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden" />
                    <View>
                      <View className="mb-1 h-4 rounded-md bg-gray-200" />
                      <View className="mb-1 h-4 w-1/3 rounded-md bg-gray-200" />
                    </View>
                  </View>
                </View>
                <View className="flex w-1/2 mb-6 px-1">
                  <View className="flex-1 gap-4">
                    <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden" />
                    <View>
                      <View className="mb-1 h-4 rounded-md bg-gray-200" />
                      <View className="mb-1 h-4 w-1/3 rounded-md bg-gray-200" />
                    </View>
                  </View>
                </View>
                <View className="flex w-1/2 mb-6 px-1">
                  <View className="flex-1 gap-4">
                    <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden" />
                    <View>
                      <View className="mb-1 h-4 rounded-md bg-gray-200" />
                      <View className="mb-1 h-4 w-1/3 rounded-md bg-gray-200" />
                    </View>
                  </View>
                </View>
              </View>
            ) : null
          }
          onRefresh={() => {
            productsQuery.refetch();
          }}
          onEndReached={() => {
            if (
              productsQuery.hasNextPage &&
              !productsQuery.isFetchingNextPage
            ) {
              productsQuery.fetchNextPage();
            }
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
