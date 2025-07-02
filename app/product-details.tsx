import { useProduct } from '@/api/hooks/products';
import { ProductDetailsSkeleton } from '@/components/skeletons/ProductDetailsSkeleton';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';
import QuantityPicker from '@/components/ui/QuantityPicker';
import SizePicker from '@/components/ui/SizePicker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetailsScreen() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Black');

  const params = useLocalSearchParams<{
    productId: string;
    productName: string;
  }>();
  const { productId, productName /* barcode, scannedProduct, manualEntry */ } =
    params;
  const productQuery = useProduct(productId);

  if (productQuery.isLoading) {
    return <ProductDetailsSkeleton />;
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
      <ScrollView
        className="flex-1 px-4 pb-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-60 mb-5 bg-gray-100 rounded-xl overflow-hidden">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              style={{ resizeMode: 'cover' }}
            />
          ) : (
            <View className="flex-1 justify-center items-center bg-gray-light">
              <Text className="text-base text-gray-dark">No Image</Text>
            </View>
          )}
        </View>

        <View className="flex-row mb-4 justify-between items-center">
          <Text className="text-xl font-medium">{productName}</Text>
          <View className="flex-row">
            <Text className="text-gray-dark line-through mt-1.5">€50</Text>
            <View className="items-end">
              <Text className="text-xl font-medium">€50.99</Text>
              <Text className="text-xs text-gray font-light">Taxes: €0.99</Text>
            </View>
          </View>
        </View>

        <Text className="text-gray mb-6">
          {productQuery.data.product.description}
        </Text>

        <ColorPicker
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          colors={[
            { name: 'Black', value: '#000000' },
            { name: 'White', value: '#FFFFFF' },
            { name: 'Navy', value: '#1E3A8A' },
            { name: 'Gray', value: '#6B7280' },
            { name: 'Red', value: '#DC2626' },
          ]}
          className="mb-6"
        />

        <SizePicker
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          sizes={['XS', 'S', 'M', 'L', 'XL']}
          className="mb-4"
        />

        <View className="flex-row items-center gap-4">
          <QuantityPicker
            quantity={quantity}
            onQuantityChange={setQuantity}
            min={1}
            variant="ghost"
          />

          <Button size="lg" className="flex-1">
            Add to cart
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
