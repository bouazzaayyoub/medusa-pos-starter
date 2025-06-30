import { useProducts } from '@/api/hooks/products';
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
            className="flex w-full"
            onPress={() => handleProductPress(item)}
            activeOpacity={0.7}
          >
            {thumbnail ? (
              <Image
                source={{ uri: thumbnail }}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
            ) : (
              <View className="w-full aspect-square bg-gray-100 rounded-lg mb-4" />
            )}
            <Text className="text-base mb-2">{item.title}</Text>
            {/* TODO: display discounted price */}
            <Text className="text-base text-gray-800 font-bold">
              {amounts.length === 0
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
          </TouchableOpacity>
        </View>
      );
    },
    [],
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

      <View className="p-5 pt-15">
        <Text className="text-black text-3xl mb-5 font-semibold">Products</Text>

        <TextInput
          className="bg-gray-100 rounded-lg p-3 mb-4 text-base border border-gray-200"
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View className="flex-1 px-3">
        <FlashList
          data={data}
          numColumns={2}
          renderItem={renderProduct}
          estimatedItemSize={70}
          refreshing={productsQuery.isRefetching}
          ItemSeparatorComponent={() => <View className="w-full h-6" />}
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
        />
      </View>
    </SafeAreaView>
  );
}
