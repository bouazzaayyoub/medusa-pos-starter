import { useProducts } from '@/api/hooks/products';
import { AdminProduct } from '@medusajs/types';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  FlatList,
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

  const renderProduct = ({ item }: { item: AdminProduct }) => (
    <TouchableOpacity
      className="flex-row bg-white rounded-xl p-4 mb-3 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => handleProductPress(item)}
    >
      <View className="flex-1">
        <Text className="text-base font-semibold mb-1">{item.title}</Text>
        <Text className="text-sm text-gray-600">{item.collection?.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
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

      <FlatList
        data={productsQuery.data?.pages.flatMap((page) => page.products) || []}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
