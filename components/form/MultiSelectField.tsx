import { Check } from '@/components/icons/check';
import { X } from '@/components/icons/x';
import { Text } from '@/components/ui/Text';
import { clx } from '@/utils/clx';
import React from 'react';
import { FlatList, ListRenderItemInfo, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseSelectField, BaseSelectProps, SelectOption } from './BaseSelectField';

interface TMultiSelectOption {
  label: string;
  value: string;
}

const MultiSelectOption: React.FC<{
  option: TMultiSelectOption;
  isSelected: boolean;
  toggleOption: (value: string) => void;
}> = ({ option, isSelected, toggleOption }) => (
  <TouchableOpacity
    key={option.value}
    className={clx('p-4 flex-row justify-between items-center bg-white')}
    onPress={() => {
      toggleOption(option.value);
    }}
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
}: BaseSelectProps) {
  const toggleOption = React.useCallback(
    (value: string[], onChange: (value: any) => void) => (optionValue: string) => {
      const newValue = value.includes(optionValue)
        ? value.filter((v: string) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    },
    [],
  );

  const removeOption = (value: string[], onChange: (value: any) => void) => (optionValue: string) => {
    const newValue = value.filter((v: string) => v !== optionValue);
    onChange(newValue);
  };

  const getSelectedOptions = (options: SelectOption[], value: any) => {
    return options.filter((option) => value.includes(option.value));
  };

  const shouldShowFloating = (
    isVisible: boolean,
    selectedOptions: SelectOption[],
    floatingPlaceholder: boolean,
    variant: 'primary' | 'secondary',
  ) => {
    return floatingPlaceholder && (isVisible || selectedOptions.length > 0) && variant === 'primary';
  };

  const renderOptionsList = ({
    filteredOptions,
    value,
    onChange,
    searchable,
    searchQuery,
    setSearchQuery,
  }: {
    filteredOptions: SelectOption[];
    value: any;
    onChange: (value: any) => void;
    searchable: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  }) => {
    const toggle = toggleOption(value, onChange);

    const renderItem = ({ item }: ListRenderItemInfo<TMultiSelectOption>) => {
      return <MultiSelectOption option={item} isSelected={value.includes(item.value)} toggleOption={toggle} />;
    };

    return (
      <>
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
          keyboardShouldPersistTaps="always"
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View className="h-hairline bg-gray-200" />}
          ListEmptyComponent={
            <View className="p-8 items-center">
              <Text className="text-gray-500">
                {searchable && searchQuery ? 'No options found' : 'No options available'}
              </Text>
            </View>
          }
        />
      </>
    );
  };

  return (
    <BaseSelectField
      name={name}
      placeholder={placeholder}
      options={options}
      className={className}
      buttonClassName={buttonClassName}
      errorClassName={errorClassName}
      searchable={searchable}
      floatingPlaceholder={floatingPlaceholder}
      variant={variant}
      getSelectedOptions={getSelectedOptions}
      shouldShowFloating={shouldShowFloating}
      renderOptionsList={renderOptionsList}
    >
      {({ selectedOptions, value, onChange, placeholder: pl, floatingPlaceholder: fp, variant }) => {
        const removeOpt = removeOption(value, onChange);

        return (
          <View>
            {selectedOptions.length > 0 && variant === 'primary' ? (
              <View className="flex flex-row flex-wrap gap-1">
                {selectedOptions.map((option) => (
                  <View key={option.value} className="bg-gray-100 rounded-lg px-2 py-1 flex-row items-center mr-1 mb-1">
                    <Text className="text-sm text-gray-700">{option.label}</Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        removeOpt(option.value);
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
                <Text className="text-lg text-white">{pl}</Text>
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
                {!fp ? pl : null}
              </Text>
            )}
          </View>
        );
      }}
    </BaseSelectField>
  );
}
