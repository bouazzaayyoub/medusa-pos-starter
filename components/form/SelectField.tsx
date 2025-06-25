import { ChevronDown } from '@/components/icons/chevron-down';
import React, { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  name: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  buttonClassName?: string;
  errorClassName?: string;
  modalClassName?: string;
  searchable?: boolean;
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
  floatingPlaceholder?: boolean;
}

export function SelectField({
  name,
  placeholder = 'Select an option',
  options,
  className = '',
  buttonClassName = '',
  errorClassName = '',
  modalClassName = '',
  searchable = false,
  renderOption,
  floatingPlaceholder = false,
}: SelectFieldProps) {
  const { control } = useFormContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const showFloating = floatingPlaceholder && (isVisible || !!selectedOption);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsVisible(false);
    setSearchQuery('');
  };

  const defaultRenderOption = (option: SelectOption, isSelected: boolean) => (
    <TouchableOpacity
      key={option.value}
      className={`
        p-4 border-b border-gray-100 flex-row justify-between items-center
        ${isSelected ? 'bg-blue-50' : 'bg-white'}
      `}
      onPress={() => handleSelect(option.value)}
    >
      <Text
        className={`text-base ${
          isSelected ? 'text-blue-600 font-medium' : 'text-gray-900'
        }`}
      >
        {option.label}
      </Text>
      {isSelected && <Text className="text-blue-600 text-lg">✓</Text>}
    </TouchableOpacity>
  );

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
        <TouchableOpacity
          className={`
            bg-white rounded-xl px-4 py-5 text-lg leading-6 border border-gray-200 flex-row justify-between items-center
            ${error ? 'border-red-500 bg-red-50' : ''}
            ${buttonClassName}
            ${floatingPlaceholder ? 'pt-6 pb-4' : ''}
          `}
          onPress={() => setIsVisible(true)}
        >
          <Text
            className={`text-lg ${
              selectedOption ? 'text-gray-700' : 'text-[#b5b5b5]'
            }`}
          >
            {selectedOption
              ? selectedOption.label
              : !floatingPlaceholder && placeholder}
          </Text>
        </TouchableOpacity>
        <ChevronDown
          size={24}
          className="text-[#B5B5B5] absolute top-1/2 -translate-y-1/2 right-4"
        />
      </View>
      {error && (
        <Text className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
          {error.message}
        </Text>
      )}

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className={`bg-white rounded-t-3xl max-h-[80%] ${modalClassName}`}
          >
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-900">
                Select Option
              </Text>
              <TouchableOpacity
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                onPress={() => setIsVisible(false)}
              >
                <Text className="text-gray-600 text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            {searchable && (
              <View className="p-4 border-b border-gray-100">
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base"
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
                const isSelected = item.value === value;
                const renderedOption = renderOption
                  ? renderOption(item, isSelected)
                  : defaultRenderOption(item, isSelected);
                return renderedOption as React.ReactElement;
              }}
              ListEmptyComponent={
                <View className="p-8 items-center">
                  <Text className="text-gray-500 text-base">
                    {searchable && searchQuery
                      ? 'No options found'
                      : 'No options available'}
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

export default SelectField;
