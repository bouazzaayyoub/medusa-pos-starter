import { Search } from '@/components/icons/search';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const renderProduct = ({ item, index }: { item: any; index: number }) => {
  const isLastRow = index >= 8;

  return (
    <View className={`gap-4 flex-1 ${!isLastRow ? 'mb-6' : 'mb-20'}`}>
      <View className="bg-gray-200 aspect-square rounded-lg overflow-hidden" />
      <View>
        <View className="mb-1 h-4 rounded-md bg-gray-200" />
        <View className="mb-1 h-4 w-1/3 rounded-md bg-gray-200" />
      </View>
    </View>
  );
};

export const ProductsSkeleton = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />

      <View className="m-4 mb-6 relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-[50%] text-[#B5B5B5]"
        />
        <TextInput
          className="rounded-full pb-3 pt-2 pr-4 pl-10 text-base border placeholder:text-[#B5B5B5] border-[#E5E5E5]"
          placeholder="Search products..."
          editable={false}
        />
      </View>

      <FlatList
        data={Array.from({ length: 10 })}
        renderItem={({ item, index }) => renderProduct({ item, index })}
        numColumns={2}
        columnWrapperStyle={{ gap: 8 }}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
