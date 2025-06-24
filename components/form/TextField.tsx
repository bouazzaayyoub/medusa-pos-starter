import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface TextFieldProps
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  name: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export function TextField({
  name,
  placeholder,
  className = '',
  inputClassName = '',
  errorClassName = '',
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

  return (
    <View className={className}>
      <TextInput
        className={`
          bg-white rounded-xl px-4 py-5 text-lg leading-6 border border-gray-200 text-gray-700
          ${error ? 'border-red-500 bg-red-50' : ''}
          ${inputClassName}
        `}
        placeholder={placeholder}
        placeholderTextColor="#b5b5b5"
        value={value || ''}
        onChangeText={onChange}
        onBlur={onBlur}
        {...textInputProps}
      />
      {error && (
        <Text className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
          {error.message}
        </Text>
      )}
    </View>
  );
}

export default TextField;
