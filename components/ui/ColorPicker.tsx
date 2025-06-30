import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ColorPickerProps {
  colors: Array<{ name: string; value: string }>;
  selectedColor?: string;
  onColorChange: (color: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ColorPicker({
  colors,
  selectedColor,
  onColorChange,
  label = 'Colors',
  disabled = false,
  className = '',
}: ColorPickerProps) {
  return (
    <View className={className}>
      {label && <Text className="text-base text-gray-900 mb-2">{label}</Text>}

      <View className="flex-row flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = selectedColor === color.name;
          const isDisabled = disabled;

          return (
            <TouchableOpacity
              key={color.name}
              onPress={() => !isDisabled && onColorChange(color.name)}
              disabled={isDisabled}
              className={`
                px-2 h-10 rounded-full border items-center justify-center flex-row gap-2 disabled:opacity-50
                ${
                  isSelected
                    ? 'border-black bg-black'
                    : 'border-border bg-white'
                }
              `}
            >
              <View
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: color.value }}
              />
              <Text
                className={`
                  ${isSelected ? 'text-white' : 'text-black'}
                `}
              >
                {color.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default ColorPicker;
