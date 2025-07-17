import { Check } from '@/components/icons/check';
import { ChevronDown } from '@/components/icons/chevron-down';
import { X } from '@/components/icons/x';
import { clx } from '@/utils/clx';
import React, { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BottomSheet } from '../ui/BottomSheet';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectFieldProps {
  name: string;
  placeholder?: string;
  options: MultiSelectOption[];
  className?: string;
  buttonClassName?: string;
  errorClassName?: string;
  searchable?: boolean;
  floatingPlaceholder?: boolean;
  variant?: 'primary' | 'secondary';
}

export function MultiSelectField({
  name,
  placeholder = 'Select options',
  options,
  className = '',
  buttonClassName = '',
  errorClassName = '',
  searchable = false,
  floatingPlaceholder = false,
  variant = 'primary',
}: MultiSelectFieldProps) {
  const { control } = useFormContext();
  const {
    field: { onChange, value = [] },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOptions = options.filter((option) => value.includes(option.value));

  const filteredOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const showFloating = floatingPlaceholder && (isVisible || selectedOptions.length > 0) && variant === 'primary';
  const floatingPlaceholderTranslateY = useSharedValue(0);
  const floatingPlaceholderScale = useSharedValue(1);

  const floatingPlaceholderStyle = useAnimatedStyle(() => {
    return {
      transformOrigin: 'top left',
      transform: [
        {
          translateY: floatingPlaceholderTranslateY.value,
        },
        {
          scale: floatingPlaceholderScale.value,
        },
      ],
    };
  });

  useEffect(() => {
    if (showFloating) {
      floatingPlaceholderTranslateY.value = withTiming(-12, { duration: 150 });
      floatingPlaceholderScale.value = withTiming(0.67, { duration: 150 });
    } else {
      floatingPlaceholderTranslateY.value = withTiming(0, { duration: 150 });
      floatingPlaceholderScale.value = withTiming(1, { duration: 150 });
    }
  }, [floatingPlaceholderScale, floatingPlaceholderTranslateY, showFloating]);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v: string) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeOption = (optionValue: string) => {
    const newValue = value.filter((v: string) => v !== optionValue);
    onChange(newValue);
  };

  const defaultRenderOption = (option: MultiSelectOption, isSelected: boolean) => (
    <TouchableOpacity
      key={option.value}
      className={clx('p-4 flex-row justify-between items-center bg-white')}
      onPress={() => toggleOption(option.value)}
    >
      <Text
        className={clx('text-base', {
          'text-active-500 font-medium': isSelected,
        })}
      >
        {option.label}
      </Text>
      {isSelected && <Check size={16} color="#4E78E5" />}
    </TouchableOpacity>
  );

  return (
    <View className={clx('w-full', className)}>
      <View className="relative">
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          className={clx(
            'bg-white rounded-xl px-4 py-5 text-lg leading-6 border border-gray-200 flex-row justify-between items-center',
            {
              'border-error-500': error,
              [buttonClassName]: buttonClassName,
              'pt-6 pb-4': floatingPlaceholder && variant === 'primary',
              'bg-black': selectedOptions.length > 0 && variant === 'secondary',
              'rounded-full py-3 justify-center': variant === 'secondary',
            },
          )}
        >
          <View>
            {selectedOptions.length > 0 && variant === 'primary' ? (
              <View className="flex flex-row flex-wrap gap-1">
                {selectedOptions.map((option) => (
                  <View key={option.value} className="bg-gray-100 rounded-lg px-2 py-1 flex-row items-center mr-1 mb-1">
                    <Text className="text-sm text-gray-700">{option.label}</Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        removeOption(option.value);
                      }}
                      className="ml-1"
                    >
                      <X size={12} className="text-gray-600" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : selectedOptions.length > 0 && variant === 'secondary' ? (
              <View className="flex-row gap-3 items-center">
                <Text className="text-lg text-white">{placeholder}</Text>
                <View className="bg-white rounded-full mt-0.5 items-center px-1 justify-center aspect-square">
                  <Text className="text-xs font-bold">{selectedOptions.length}</Text>
                </View>
              </View>
            ) : (
              <Text
                className={clx('text-lg', {
                  'text-gray-300': !selectedOptions.length,
                })}
              >
                {!floatingPlaceholder ? placeholder : null}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <ChevronDown size={24} className="text-gray-300 absolute top-1/2 -translate-y-1/2 right-4" />

        {floatingPlaceholder && (
          <Animated.Text
            className={clx('absolute left-4 z-10 text-lg top-5', error ? 'text-error-500' : 'text-gray-300')}
            style={floatingPlaceholderStyle}
            pointerEvents="none"
          >
            {placeholder}
          </Animated.Text>
        )}
      </View>

      {error && <Text className={clx('text-error-500 text-sm mt-1', errorClassName)}>{error.message}</Text>}

      <BottomSheet visible={isVisible} onClose={() => setIsVisible(false)} showCloseButton={false}>
        {searchable && (
          <View className="p-4 border-b border-gray-200">
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-base"
              placeholder="Search options..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = value.includes(item.value);
            return defaultRenderOption(item, isSelected);
          }}
          ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
          ListEmptyComponent={
            <View className="p-8 items-center">
              <Text className="text-gray-500 text-base">
                {searchable && searchQuery ? 'No options found' : 'No options available'}
              </Text>
            </View>
          }
        />
      </BottomSheet>
    </View>
  );
}
