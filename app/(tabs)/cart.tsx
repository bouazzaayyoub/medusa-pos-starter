import Form from '@/components/form/Form';
import TextField from '@/components/form/TextField';
import { Button } from '@/components/ui/Button';
import QuantityPicker from '@/components/ui/QuantityPicker';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod/v4';

const discountSchema = z.object({
  discount: z.string().min(1, 'Discount code is required'),
});

export default function CartScreen() {
  return (
    <SafeAreaView className="relative flex-1 px-4 bg-white">
      <View className="py-4">
        <Text className="text-black text-[40px] font-semibold">Cart</Text>
      </View>

      <FlatList
        data={Array.from({ length: 10 })}
        contentContainerClassName="mt-4"
        renderItem={({ item }) => (
          <View className="flex-row gap-4">
            <View className="h-[5.25rem] w-[5.25rem] rounded-xl bg-border" />
            <View>
              <Text className="font-medium mb-2">Product Name</Text>
              <View className="flex-row items-center mb-2 gap-4">
                <View className="flex-row">
                  <Text className="text-gray-dark text-sm">Color:</Text>
                  <Text className="text-sm">White</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-gray-dark text-sm">Size:</Text>
                  <Text className="text-sm">Small</Text>
                </View>
              </View>
              <QuantityPicker
                quantity={1}
                onQuantityChange={() => {}}
                className="self-start"
              />
            </View>
            <Text className="font-medium ml-auto">€50.99</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-border my-6" />}
      />

      <View className="mt-6 mb-20">
        <Form
          schema={discountSchema}
          onSubmit={() => {}}
          className="flex-row gap-2 items-start mb-6"
        >
          <TextField
            placeholder="Enter your discount code"
            name="discount"
            className="w-[60%]"
          />
          <Button size="sm" className="flex-1 h-[58px]">
            Submit
          </Button>
        </Form>
        <View className="flex-row mb-2 justify-between">
          <Text className="text-gray-dark">Taxes</Text>
          <Text className="text-gray-dark">€50.99</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-dark">Subtotal</Text>
          <Text className="text-gray-dark">€50.99</Text>
        </View>

        <View className="h-px bg-border my-4" />

        <View className="flex-row justify-between mb-6">
          <Text className="font-medium text-lg">Total</Text>
          <Text className="font-medium text-lg">€50.99</Text>
        </View>

        <View className="flex-row gap-2">
          <Button variant="outline" className="flex-1">
            Cancel Cart
          </Button>
          <Button className="flex-1">Checkout</Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
