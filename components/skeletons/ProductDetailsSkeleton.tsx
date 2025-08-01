import { BottomSheet } from '@/components/ui/BottomSheet';
import { QuantityPicker } from '@/components/ui/QuantityPicker';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export const ProductDetailsSkeleton = () => (
  <BottomSheet visible={true} onClose={() => router.back()} showCloseButton={false} dismissOnOverlayPress>
    <View className="rounded-xl bg-gray-200 mb-4 aspect-[4/3] w-full" />

    <View className="flex-row mb-2 gap-14 items-center">
      <View className="rounded-md h-5 flex-1 bg-gray-200" />
      <View className="rounded-md h-5 flex-1 bg-gray-200" />
    </View>

    <View className="rounded-md h-5 mb-2 bg-gray-200" />
    <View className="rounded-md h-5 mb-6 w-1/2 bg-gray-200" />

    <View className="rounded-md h-5 mb-2 w-1/2 bg-gray-200" />
    <View className="rounded-md h-5 mb-6 bg-gray-200" />

    <View className="rounded-md h-5 mb-2 w-1/2 bg-gray-200" />
    <View className="rounded-md h-5 mb-4 bg-gray-200" />

    <View className="flex-row items-center gap-4">
      <QuantityPicker quantity={1} onQuantityChange={() => {}} variant="ghost" disabled />

      <TouchableOpacity disabled className="p-5 rounded-xl flex-1 bg-gray-200">
        <Text className="text-gray-300 mx-auto text-xl leading-5">Add to cart</Text>
      </TouchableOpacity>
    </View>
  </BottomSheet>
);
