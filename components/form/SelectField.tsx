import { Check } from '@/components/icons/check';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Text } from '@/components/ui/Text';
import { clx } from '@/utils/clx';
import React, { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BottomSheet } from '../ui/BottomSheet';

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
  searchable?: boolean;
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
  floatingPlaceholder?: boolean;
  onEndReached?: () => void;
  isDisabled?: boolean;
}

export function SelectField({
  name,
  placeholder = 'Select an option',
  options,
  className = '',
  buttonClassName = '',
  errorClassName = '',
  searchable = false,
  renderOption,
  floatingPlaceholder = false,
  onEndReached,
  isDisabled = false,
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
    ? options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
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
      floatingPlaceholderTranslateY.value = withTiming(8, { duration: 150 });
      floatingPlaceholderScale.value = withTiming(0.67, { duration: 150 });
    } else {
      floatingPlaceholderTranslateY.value = withTiming(15, { duration: 150 });
      floatingPlaceholderScale.value = withTiming(1, { duration: 150 });
    }
  }, [floatingPlaceholderScale, floatingPlaceholderTranslateY, showFloating]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsVisible(false);
    setSearchQuery('');
  };

  const defaultRenderOption = (option: SelectOption, isSelected: boolean) => (
    <TouchableOpacity
      key={option.value}
      className={clx('p-4 flex-row justify-between items-center bg-white')}
      onPress={() => handleSelect(option.value)}
    >
      <Text
        className={clx({
          'text-active-500': isSelected,
        })}
      >
        {option.label}
      </Text>
      {isSelected && <Check size={16} color="#4E78E5" />}
    </TouchableOpacity>
  );

  return (
    <View className={className}>
      <View className="relative">
        {floatingPlaceholder && (
          <Animated.Text
            className={clx('absolute left-3 z-10 text-base', error ? 'text-error-500' : 'text-gray-300')}
            style={floatingPlaceholderStyle}
            pointerEvents="none"
          >
            {placeholder}
          </Animated.Text>
        )}

        <TouchableOpacity
          className={clx('bg-white rounded-xl px-3 py-4 border border-gray-200 flex-row justify-between items-center', {
            'border-error-500': error,
            [buttonClassName]: buttonClassName,
            'pt-6 pb-2': floatingPlaceholder,
          })}
          onPress={() => setIsVisible(true)}
          disabled={isDisabled}
        >
          <Text
            className={clx({
              'text-gray-300': !selectedOption,
            })}
          >
            {selectedOption ? selectedOption.label : !floatingPlaceholder ? placeholder : null}
          </Text>
        </TouchableOpacity>

        <ChevronDown size={24} className="text-gray-300 absolute top-1/2 -translate-y-1/2 right-4" />
      </View>

      {error && <Text className={clx('text-error-500 text-sm mt-1', errorClassName)}>{error.message}</Text>}

      <BottomSheet visible={isVisible} onClose={() => setIsVisible(false)} showCloseButton={false}>
        {searchable && (
          <View className="p-4 border-b border-gray-200">
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3"
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
          keyboardShouldPersistTaps="always"
          ItemSeparatorComponent={() => <View className="h-hairline bg-gray-200" />}
          ListEmptyComponent={
            <View className="p-8 items-center">
              <Text className="text-gray-500">
                {searchable && searchQuery ? 'No options found' : 'No options available'}
              </Text>
            </View>
          }
          onEndReached={onEndReached}
        />
      </BottomSheet>
    </View>
  );
}

export default SelectField;
