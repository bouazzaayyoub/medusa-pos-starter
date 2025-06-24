import { useProduct } from '@/api/hooks/products';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetailsScreen() {
  const params = useLocalSearchParams<{
    productId: string;
    productName: string;
  }>();
  const { productId, productName /* barcode, scannedProduct, manualEntry */ } =
    params;
  const productQuery = useProduct(productId);

  if (productQuery.isLoading) {
    return (
      <View className="flex-1">
        <Text>Loading product details...</Text>
      </View>
    );
  }

  if (productQuery.isError) {
    return (
      <View className="flex-1">
        <Text>Error loading product details</Text>
      </View>
    );
  }

  if (!productQuery.data) {
    return (
      <View className="flex-1">
        <Text>Product not found</Text>
      </View>
    );
  }

  const imageUrl =
    productQuery.data.product.thumbnail ||
    productQuery.data.product.images?.[0]?.url;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View className="h-48 bg-gray-100">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              style={{ resizeMode: 'cover' }}
            />
          ) : (
            <View className="flex-1 justify-center items-center bg-gray-300">
              <Text className="text-base text-gray-500">No Image</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="p-5">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold mb-1">{productName}</Text>
              <Text className="text-base text-gray-600">
                {productQuery.data.product.collection?.title || '—'}
              </Text>
            </View>
          </View>

          <Text className="text-base leading-6 text-gray-800 mb-6">
            {productQuery.data.product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="p-5 pt-0">
        <TouchableOpacity
          className="bg-white border border-gray-200 rounded-xl items-center justify-center flex-row p-5
          disabled:bg-gray-100 disabled:text-gray-400"
          onPress={() => router.back()}
        >
          <Text className="text-black text-xl">Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
