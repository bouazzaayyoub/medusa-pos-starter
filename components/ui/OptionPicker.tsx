import { clx } from '@/utils/clx';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ColorPickerProps {
  values: Array<{ id: string; value: string }>;
  selectedValue?: string;
  onValueChange: (value: { id: string; value: string }) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function OptionPicker({
  values,
  selectedValue,
  onValueChange,
  label,
  disabled = false,
  className = '',
}: ColorPickerProps) {
  return (
    <View className={className}>
      <Text className="text-base text-gray-900 mb-2">{label}</Text>

      <View className="flex-row flex-wrap gap-2">
        {values.map((valueItem) => {
          const isSelected = selectedValue === valueItem.value;
          const isDisabled = disabled;

          return (
            <TouchableOpacity
              key={valueItem.id}
              onPress={() => !isDisabled && onValueChange(valueItem)}
              disabled={isDisabled}
              className={clx(
                'px-2 h-10 rounded-full border items-center justify-center flex-row gap-2 disabled:opacity-50',
                {
                  'border-black bg-black': isSelected,
                  'border-border bg-white': !isSelected,
                },
              )}
            >
              <Text
                className={clx({
                  'text-white': isSelected,
                  'text-black': !isSelected,
                })}
              >
                {valueItem.value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default OptionPicker;
