import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  return (
    <SafeAreaView className="flex-1">
      <View className="p-5 pt-15">
        <Text className="text-black text-3xl font-semibold">Checkout</Text>
      </View>
    </SafeAreaView>
  );
}
