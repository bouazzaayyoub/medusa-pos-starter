import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function CartScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-5 pt-15">
        <Text className="text-black text-3xl font-semibold">Cart</Text>
      </View>
    </SafeAreaView>
  );
}
