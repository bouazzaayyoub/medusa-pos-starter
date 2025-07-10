import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const renderItem = () => (
  <TouchableOpacity className="flex-row gap-4">
    <View className="bg-gray h-16 aspect-square rounded-lg" />
    <View>
      <Text className="font-medium">Product Name</Text>
      <Text className="text-gray text-sm mt-auto">White, Small</Text>
    </View>
    <View className="ml-auto">
      <Text className="font-medium">€50.99</Text>
      <Text className="text-gray text-sm mt-auto text-right">Qty: 1</Text>
    </View>
  </TouchableOpacity>
);

export default function OrderDetailsScreen() {
  return (
    <Dialog
      open
      onClose={() => router.back()}
      showCloseButton={false}
      dismissOnOverlayPress
      animationType="slide"
      pinDown
      contentClassName="h-full"
    >
      <FlashList
        data={Array.from({ length: 10 })}
        renderItem={renderItem}
        estimatedItemSize={10}
        ItemSeparatorComponent={() => <View className="w-full h-px bg-border my-6" />}
        ListHeaderComponent={() => (
          <View className="flex-row gap-4 mb-8 items-center justify-between">
            <Text className="text-2xl">Order #133232</Text>
            <Text className="text-gray">July 6th, 2025</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <>
            <Text className="mb-4 text-xl">Information</Text>
            <View className="flex-row justify-between gap-4 items-center">
              <Text className="text-gray flex-1 text-sm">Full Name</Text>
              <Text className="flex-1 text-sm flex-wrap text-right">Jamie Lee</Text>
            </View>
            <View className="h-px bg-border mt-2 mb-4 w-full" />
            <View className="flex-row justify-between gap-4 items-center">
              <Text className="text-gray flex-1 text-sm">Mail</Text>
              <Text className="flex-1 text-sm flex-wrap text-right">jamielee@gmail.com</Text>
            </View>
            <View className="h-px bg-border mt-2 mb-4 w-full" />
            <View className="flex-row justify-between gap-4 items-center">
              <Text className="text-gray flex-1 text-sm">Address</Text>
              <Text className="flex-1 text-sm flex-wrap text-right">
                1450 Market St, San Francisco 94103 California
              </Text>
            </View>
            <View className="h-px bg-border mt-2 mb-4 w-full" />
            <View className="flex-row mb-10 justify-between gap-4 items-center">
              <Text className="text-gray flex-1 text-sm">Phone</Text>
              <Text className="flex-1 text-sm flex-wrap text-right">+1 415-555-0198</Text>
            </View>
            <Text className="mb-4 text-xl">Price</Text>
            <View className="flex-row justify-between gap-4 mb-2 items-center">
              <Text className="text-gray flex-1 text-sm">Taxes</Text>
              <Text className="flex-1 text-sm flex-wrap text-right">€50.99</Text>
            </View>
            <View className="flex-row justify-between gap-4 mb-2 items-center">
              <Text className="text-gray flex-1 text-sm">Subtotal</Text>
              <Text className="flex-1 text-sm flex-wrap text-right">€50.99</Text>
            </View>
            <View className="flex-row justify-between gap-4 items-center">
              <Text className="text-gray flex-1 text-sm">Discount</Text>
              <Text className="flex-1 text-sm flex-wrap text-right">-€2.33</Text>
            </View>
            <View className="h-px bg-border my-4 w-full" />
            <View className="flex-row justify-between gap-4 mb-4 items-center">
              <Text className="flex-1 text-lg">Total</Text>
              <Text className="flex-1 text-lg flex-wrap text-right">€50.99</Text>
            </View>
            <Button size="lg" variant="outline" onPress={() => router.back()}>
              Close
            </Button>
          </>
        )}
        ListFooterComponentStyle={{ marginTop: 56 }}
      />
    </Dialog>
  );
}
