import { X } from '@/components/icons/x';
import { Text } from '@/components/ui/Text';
import { clx } from '@/utils/clx';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';

interface ProductDetailsHeaderProps {
  title?: string;
}

export const ProductDetailsHeader: React.FC<ProductDetailsHeaderProps> = ({ title = 'Product Details' }) => {
  const router = useRouter();

  return (
    <View
      className={clx(
        'flex-row items-center justify-between px-4 bg-white',
        Platform.OS === 'android' ? 'pt-safe' : 'py-4',
      )}
    >
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
