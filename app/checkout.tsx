import { InfoBanner } from '@/components/InfoBanner';
import { Button } from '@/components/ui/Button';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  return (
    <SafeAreaView className="relative flex-1 pt-6 px-4 bg-white">
      <Text className="text-[40px] mb-6 font-medium">Checkout</Text>

      <FlashList
        data={Array.from({ length: 20 }, (_, i) => ({ id: i, title: `Item ${i + 1}` }))}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg">{item.title}</Text>
          </View>
        )}
        estimatedItemSize={50}
        ListHeaderComponent={() => <Text className="text-2xl mb-6">Cart Items</Text>}
        ListFooterComponent={() => (
          <View>
            <Text className="text-2xl mb-6 mt-10">Information</Text>

            <View className="flex-row mb-4">
              <Text className="text-gray text-base w-24">Full Name</Text>
              <Text className="text-base flex-wrap flex-1">Jamie Lee</Text>
            </View>
            <View className="flex-row mb-4">
              <Text className="text-gray text-base w-24">Mail</Text>
              <Text className="text-base flex-wrap flex-1">jamielee@gmail.com</Text>
            </View>
            <View className="flex-row mb-4">
              <Text className="text-gray text-base w-24">Address</Text>
              <Text className="text-base flex-wrap flex-1">1450 Market St, San Francisco 94103 California</Text>
            </View>
            <View className="flex-row mb-10">
              <Text className="text-gray text-base w-24">Phone</Text>
              <Text className="text-base flex-wrap flex-1">+1 415-555-0198</Text>
            </View>
          </View>
        )}
      />

      <View className="py-4 gap-y-4 border-y mb-6 border-border">
        <View className="flex-row justify-between">
          <Text className="text-gray-dark">Taxes</Text>
          <Text className="text-gray-dark">€50.99</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-dark">Subtotal</Text>
          <Text className="text-gray-dark">€50.99</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-dark">Discount</Text>
          <Text className="text-gray-dark">-€2.33</Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-6">
        <Text className="text-lg font-medium">Total</Text>
        <Text className="text-lg font-medium">€50.99</Text>
      </View>

      <View className="flex-row gap-2">
        <Button variant="outline" className="flex-1">
          Back to Cart
        </Button>
        <Button className="flex-1" onPress={() => router.push('/order-confirmation')}>
          Complete Order
        </Button>
      </View>

      <InfoBanner variant="ghost" colorScheme="error" iconPosition="left" className="mt-4">
        Couldn't complete order. Please try again.
      </InfoBanner>
    </SafeAreaView>
  );
}
