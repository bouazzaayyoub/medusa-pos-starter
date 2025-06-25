import { CircleAlert } from '@/components/icons/circle-alert';
import { Eye } from '@/components/icons/eye';
import { EyeOff } from '@/components/icons/eye-off';
import React, { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface TextFieldProps
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  name: string;
  placeholder?: string;
  floatingPlaceholder?: boolean;
  className?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export function TextField({
  name,
  placeholder,
  floatingPlaceholder = false,
  className = '',
  inputClassName = '',
  errorClassName = '',
  secureTextEntry,
  ...textInputProps
}: TextFieldProps) {
  const { control } = useFormContext();
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [isFocused, setIsFocused] = useState(false);
  const showFloating = isFocused || !!value;

  const [showValue, setShowValue] = useState(false);

  return (
    <View className={className}>
      <View className="relative">
        {floatingPlaceholder && (
          <Text
            className={`absolute left-4 z-10 transition-all ${
              showFloating ? 'translate-y-2 text-xs' : 'translate-y-5 text-lg'
            } ${error ? 'text-red-500' : 'text-[#b5b5b5]'}`}
            pointerEvents="none"
          >
            {placeholder}
          </Text>
        )}
        <TextInput
          className={`
            bg-white rounded-xl px-4 py-5 text-lg leading-6 border border-gray-200
            ${error ? 'border-red-500 bg-red-50' : ''}
            ${floatingPlaceholder ? 'pt-6 pb-4' : ''}
            ${inputClassName}
          `}
          placeholder={floatingPlaceholder ? '' : placeholder}
          placeholderTextColor="#b5b5b5"
          value={value || ''}
          secureTextEntry={secureTextEntry && !showValue}
          onChangeText={onChange}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          onFocus={() => setIsFocused(true)}
          {...textInputProps}
        />
        {secureTextEntry && (
          <TouchableOpacity
            className="absolute p-1 right-4 top-1/2 -translate-y-1/2"
            onPress={() => setShowValue(!showValue)}
          >
            {showValue ? (
              <Eye
                size={16}
                className={error ? 'text-red-500' : 'text-[#B5B5B5]'}
              />
            ) : (
              <EyeOff
                size={16}
                className={error ? 'text-red-500' : 'text-[#B5B5B5]'}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View className="flex-row items-center mt-1 gap-1">
          <CircleAlert size={14} color="#ef4444" />
          <Text className={`text-red-500 text-sm ${errorClassName}`}>
            {error.message}
          </Text>
        </View>
      )}
    </View>
  );
}

export default TextField;
