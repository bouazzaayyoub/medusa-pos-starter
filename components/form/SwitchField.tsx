import { clx } from '@/utils/clx';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

interface SwitchFieldProps {
  name: string;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function SwitchField({
  name,
  label,
  description,
  className = '',
  disabled = false,
}: SwitchFieldProps) {
  const { control } = useFormContext();
  const {
    field: { onChange, value = false },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <View className={`w-full ${className}`}>
      <TouchableOpacity
        onPress={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={clx(
          'flex-row items-center justify-between py-4 px-4 rounded-xl border border-gray-300 bg-white',
          {
            'opacity-50': disabled,
            'border-red-500': error,
          },
        )}
      >
        <View className="flex-1 mr-4">
          <Text className="text-base font-medium text-gray-900">{label}</Text>
          {description && (
            <Text className="text-sm text-gray-500 mt-1">{description}</Text>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          trackColor={{ false: '#E5E5E5', true: '#000000' }}
          thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
        />
      </TouchableOpacity>
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
      )}
    </View>
  );
}
