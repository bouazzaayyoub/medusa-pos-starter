import { clx } from '@/utils/clx';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Loader } from '../icons/loader';
import { Minus } from '../icons/minus';
import { Plus } from '../icons/plus';

interface QuantityPickerProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  isPending?: boolean;
  variant?: 'default' | 'ghost';
  className?: string;
}

export function QuantityPicker({
  quantity,
  onQuantityChange,
  min = 1,
  max = Infinity,
  disabled = false,
  isPending = false,
  variant = 'default',
  className = '',
}: QuantityPickerProps) {
  const handleDecrement = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (text: string) => {
    if (disabled) return;

    if (text === '') {
      onQuantityChange(min);
      return;
    }

    const numValue = parseInt(text, 10);

    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onQuantityChange(numValue);
    }
  };

  const canDecrement = quantity > min && !disabled && !isPending;
  const canIncrement = quantity < max && !disabled && !isPending;

  return (
    <View className="flex-row items-center gap-2">
      <View
        className={clx(
          'flex-row overflow-hidden rounded-md',
          variant === 'default' ? 'h-8 border border-border' : 'h-10',
          className,
        )}
      >
        <TouchableOpacity
          className="w-8 items-center justify-center"
          onPress={handleDecrement}
          disabled={!canDecrement}
        >
          <Minus
            size={variant === 'default' ? 16 : 24}
            className={clx(variant === 'default' ? 'text-gray-dark' : 'text-black', !canDecrement ? 'text-gray' : '')}
          />
        </TouchableOpacity>
        <View
          className={clx('items-center justify-center', variant === 'default' ? 'border-x border-border w-8' : 'w-12')}
        >
          <TextInput
            value={quantity.toString()}
            onChangeText={handleInputChange}
            keyboardType="numeric"
            textAlign="center"
            verticalAlign="middle"
            className={clx(
              'h-full w-full !p-0',
              variant === 'default' ? '' : 'text-[1.5rem]',
              disabled ? 'text-gray' : '',
            )}
            editable={!disabled}
            selectTextOnFocus
          />
        </View>
        <TouchableOpacity
          className="w-8 items-center justify-center"
          onPress={handleIncrement}
          disabled={!canIncrement}
        >
          <Plus
            size={variant === 'default' ? 16 : 24}
            className={clx(variant === 'default' ? 'text-gray-dark' : 'text-black', !canIncrement ? 'text-gray' : '')}
          />
        </TouchableOpacity>
      </View>
      {isPending && <Loader size={16} color="#B5B5B5" className="animate-spin" />}
    </View>
  );
}

export default QuantityPicker;
