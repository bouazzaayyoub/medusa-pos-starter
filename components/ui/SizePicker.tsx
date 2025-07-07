import { clx } from '@/utils/clx';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SizePickerProps {
  sizes: string[];
  selectedSize?: string;
  onSizeChange: (size: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function SizePicker({
  sizes,
  selectedSize,
  onSizeChange,
  label = 'Size',
  disabled = false,
  className = '',
}: SizePickerProps) {
  return (
    <View className={className}>
      {label && <Text className="text-base mb-2">{label}</Text>}

      <View className="flex-row flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isDisabled = disabled;

          return (
            <TouchableOpacity
              key={size}
              onPress={() => !isDisabled && onSizeChange(size)}
              disabled={isDisabled}
              className={clx(
                'w-10 h-10 rounded-full border items-center justify-center disabled:opacity-50',
                isSelected ? 'border-black bg-black' : 'border-border bg-white',
              )}
            >
              <Text className={clx(isSelected ? 'text-white' : 'text-black')}>{size}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default SizePicker;
