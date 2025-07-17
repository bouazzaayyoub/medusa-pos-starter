import { ChevronDown } from '@/components/icons/chevron-down';
import { X } from '@/components/icons/x';
import { clx } from '@/utils/clx';
import React, { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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
  modalClassName?: string;
  searchable?: boolean;
  floatingPlaceholder?: boolean;
}

export function MultiSelectField({
  name,
  placeholder = 'Select options',
  options,
  className = '',
  buttonClassName = '',
  errorClassName = '',
  modalClassName = '',
  searchable = false,
  floatingPlaceholder = false,
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

  const showFloating = floatingPlaceholder && (isVisible || selectedOptions.length > 0);
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
      className={clx('p-4 border-b border-gray-200 flex-row justify-between items-center bg-white')}
      onPress={() => toggleOption(option.value)}
    >
      <Text
        className={clx('text-base', {
          'text-active-500 font-medium': isSelected,
        })}
      >
        {option.label}
      </Text>
      {isSelected && <Text className="text-active-500 text-lg">✓</Text>}
    </TouchableOpacity>
  );

  return (
    <View className={`w-full ${className}`}>
      <View className="relative">
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          className={clx(
            'bg-white rounded-xl px-4 py-5 text-lg leading-6 border border-gray-200 flex-row justify-between items-center',
            {
              'border-error-500': error,
              [buttonClassName]: buttonClassName,
              'pt-6 pb-4': floatingPlaceholder,
            },
          )}
        >
          <View>
            {selectedOptions.length > 0 ? (
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

      <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={() => setIsVisible(false)}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className={clx('bg-white rounded-t-3xl max-h-[80%] pb-safe', modalClassName)}>
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-lg font-semibold">Select Options</Text>
              <TouchableOpacity
                className="w-8 h-8 rounded-full bg-gray-light items-center justify-center"
                onPress={() => setIsVisible(false)}
              >
                <Text className="text-gray-400 text-lg">✕</Text>
              </TouchableOpacity>
            </View>

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
              ListEmptyComponent={
                <View className="p-8 items-center">
                  <Text className="text-gray-500 text-base">
                    {searchable && searchQuery ? 'No options found' : 'No options available'}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
