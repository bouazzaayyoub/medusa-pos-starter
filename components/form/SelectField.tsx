import { ChevronDown } from '@/components/icons/chevron-down';
import { clx } from '@/utils/clx';
import React, { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
  onEndReached?: () => void;
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
  onEndReached,
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
        option.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : options;

  const showFloating = floatingPlaceholder && (isVisible || !!selectedOption);
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
  }, [showFloating]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsVisible(false);
    setSearchQuery('');
  };

  const defaultRenderOption = (option: SelectOption, isSelected: boolean) => (
    <TouchableOpacity
      key={option.value}
      className={clx(
        'p-4 border-b border-gray-100 flex-row justify-between items-center',
        {
          'bg-blue-50': isSelected,
          'bg-white': !isSelected,
        },
      )}
      onPress={() => handleSelect(option.value)}
    >
      <Text
        className={clx('text-base', {
          'text-blue-600 font-medium': isSelected,
          'text-gray-900': !isSelected,
        })}
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
          <Animated.Text
            className={clx(
              'absolute left-4 z-10 text-lg top-5',
              error ? 'text-red-500' : 'text-[#b5b5b5]',
            )}
            style={floatingPlaceholderStyle}
            pointerEvents="none"
          >
            {placeholder}
          </Animated.Text>
        )}
        <TouchableOpacity
          className={clx(
            'bg-white rounded-xl px-4 py-5 text-lg leading-6 border border-gray-200 flex-row justify-between items-center',
            {
              'border-red-500 bg-red-50': error,
              [buttonClassName]: buttonClassName,
              'pt-6 pb-4': floatingPlaceholder,
            },
          )}
          onPress={() => setIsVisible(true)}
        >
          <Text
            className={clx('text-base', {
              'text-gray-700': selectedOption,
              'text-gray': !selectedOption,
            })}
          >
            {selectedOption
              ? selectedOption.label
              : !floatingPlaceholder
              ? placeholder
              : null}
          </Text>
        </TouchableOpacity>
        <ChevronDown
          size={24}
          className="text-[#B5B5B5] absolute top-1/2 -translate-y-1/2 right-4"
        />
      </View>
      {error && (
        <Text className={clx('text-red-500 text-sm mt-1', errorClassName)}>
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
            className={clx(
              'bg-white rounded-t-3xl max-h-[80%] pb-safe',
              modalClassName,
            )}
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
              onEndReached={onEndReached}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default SelectField;
