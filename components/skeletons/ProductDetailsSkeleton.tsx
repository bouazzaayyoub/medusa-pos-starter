import QuantityPicker from '@/components/ui/QuantityPicker';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProductDetailsSkeleton = () => (
  <SafeAreaView className="flex-1 bg-white">
    <ScrollView
      className="flex-1 px-4 pb-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="rounded-xl bg-gray-200 h-60 mb-4" />

      <View className="flex-row mb-2 gap-14 items-center">
        <View className="rounded-md h-5 flex-1 bg-gray-200" />
        <View className="rounded-md h-5 flex-1 bg-gray-200" />
      </View>

      <View className="rounded-md h-5 flex-1 mb-2 bg-gray-200" />
      <View className="rounded-md h-5 mb-6 w-1/2 bg-gray-200" />

      <View className="rounded-md h-5 mb-2 w-1/2 bg-gray-200" />
      <View className="rounded-md h-5 flex-1 mb-6 bg-gray-200" />

      <View className="rounded-md h-5 mb-2 w-1/2 bg-gray-200" />
      <View className="rounded-md h-5 flex-1 mb-4 bg-gray-200" />

      <View className="flex-row items-center gap-4">
        <QuantityPicker
          quantity={1}
          onQuantityChange={() => {}}
          variant="ghost"
          disabled
        />

        <TouchableOpacity
          disabled
          className="p-5 rounded-xl flex-1 bg-gray-light"
        >
          <Text className="text-gray mx-auto text-xl leading-5">
            Add to cart
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);
