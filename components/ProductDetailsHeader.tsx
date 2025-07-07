import { X } from '@/components/icons/x';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ProductDetailsHeaderProps {
  title?: string;
}

export const ProductDetailsHeader: React.FC<ProductDetailsHeaderProps> = ({ title = 'Product Details' }) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-4 bg-white">
      <Text>{title}</Text>
      <TouchableOpacity
        onPress={() => router.back()}
        className="p-1"
        accessibilityLabel="Close"
        accessibilityRole="button"
      >
        <X size={20} />
      </TouchableOpacity>
    </View>
  );
};
