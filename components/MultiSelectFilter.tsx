import { ChevronDown } from '@/components/icons/chevron-down';
import { X } from '@/components/icons/x';
import { clx } from '@/utils/clx';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BottomSheet } from './ui/BottomSheet';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  options: MultiSelectOption[];
  className?: string;
  buttonClassName?: string;
  errorClassName?: string;
  searchable?: boolean;
  variant?: 'primary' | 'secondary';
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  value = [],
  onChange,
  placeholder = 'Select options',
  options,
  className = '',
  buttonClassName = '',
  errorClassName = '',
  searchable = false,
  variant = 'primary',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOptions = options.filter((option) => value.includes(option.value));

  const filteredOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

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
      className={clx('p-4 border-b border-border flex-row justify-between items-center bg-white')}
      onPress={() => toggleOption(option.value)}
    >
      <Text
        className={clx('text-base', {
          'font-medium': isSelected,
        })}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className={`w-full ${className}`}>
      <View className="relative">
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          className={clx(
            'bg-white rounded-xl px-4 py-5 text-lg leading-6 border border-border flex-row justify-between items-center',
            {
              [buttonClassName]: buttonClassName,
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
                <Text className="text-lg text-white leading-5">{placeholder}</Text>
                <View className="bg-white rounded-full items-center px-1 justify-center aspect-square">
                  <Text className="text-xs font-bold transform -translate-y-1/2 top-1/2">{selectedOptions.length}</Text>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center gap-2">
                <Text
                  className={clx('text-lg', {
                    'text-gray': !selectedOptions.length && variant === 'primary',
                  })}
                >
                  {placeholder}
                </Text>
                {variant === 'secondary' && <ChevronDown size={24} className="mt-1" />}
              </View>
            )}
          </View>
        </TouchableOpacity>
        {variant === 'primary' && (
          <ChevronDown size={24} className="text-gray absolute top-1/2 -translate-y-1/2 right-4" />
        )}
      </View>

      <BottomSheet visible={isVisible} onClose={() => setIsVisible(false)} showCloseButton={false}>
        {searchable && (
          <View className="p-4 border-b border-border">
            <TextInput
              className="border border-border rounded-lg px-4 py-3 text-base"
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
      </BottomSheet>
    </View>
  );
};
