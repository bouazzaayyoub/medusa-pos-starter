import { useProducts } from '@/api/hooks/products';
import { CircleAlert } from '@/components/icons/circle-alert';
import { Search } from '@/components/icons/search';
import { ProductsSkeleton } from '@/components/skeletons/ProductsSkeleton';
import { AdminProduct } from '@medusajs/types';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const productsQuery = useProducts({
    q: searchQuery ? searchQuery : undefined,
  });

  const handleProductPress = (product: AdminProduct) => {
    router.push({
      pathname: '/product-details',
      params: { productId: product.id, productName: product.title },
    });
  };

  const products =
    productsQuery.data?.pages.flatMap((page) => page.products) || [];

  const displayProducts =
    products.length % 2 === 1
      ? [...products, { id: '__placeholder__' } as any]
      : products;

  const renderProduct = ({
    item,
    index,
  }: {
    item: AdminProduct;
    index: number;
  }) => {
    if (item.id === '__placeholder__') {
      return <View style={{ flex: 1, opacity: 0 }} pointerEvents="none" />;
    }

    const itemsPerRow = 2;
    const totalRows = Math.ceil(products.length / itemsPerRow);
    const currentRow = Math.floor(index / itemsPerRow) + 1;
    const isLastRow = currentRow === totalRows;

    return (
      <TouchableOpacity
        className={`gap-4 flex-1 ${!isLastRow ? 'mb-6' : 'mb-20'}`}
        onPress={() => handleProductPress(item)}
      >
        <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden">
          {item.thumbnail && (
            <Image
              source={{ uri: item.thumbnail }}
              className="w-full h-full object-cover"
            />
          )}
        </View>
        <View>
          <Text className="mb-1 font-light">{item.title}</Text>
          <Text className="font-bold">€50</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (productsQuery.isLoading && products.length === 0 && !searchQuery) {
    return <ProductsSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />

      <View className="m-4 mb-6 relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-[50%] text-[#B5B5B5]"
        />
        <TextInput
          className="rounded-full leading-snug pb-3 pt-2 pr-4 pl-10 text-base border placeholder:text-[#B5B5B5] border-[#E5E5E5]"
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={displayProducts}
        renderItem={({ item, index }) => renderProduct({ item, index })}
        ListEmptyComponent={
          <View className="flex-1 mt-60 items-center">
            <CircleAlert size={24} />
            <Text className="text-center text-xl mt-1">
              No products match{'\n'}the search
            </Text>
          </View>
        }
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 8 }}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
