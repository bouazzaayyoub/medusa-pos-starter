import { Loader } from '@/components/icons/loader';
import { clx } from '@/utils/clx';
import * as React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

export type ButtonProps = TouchableOpacityProps & {
  isPending?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  isPending = false,
  size = 'md',
  variant = 'solid',
  icon,
  iconPosition = 'right',
  ...props
}) => {
  const wrapperClasses = clx(
    'items-center justify-center gap-2 rounded-xl',
    iconPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
    {
      'p-5': size === 'lg',
      'p-4': size === 'md',
      'p-3': size === 'sm',
      'bg-black disabled:bg-gray-100': variant === 'solid',
      'border border-gray-200 bg-transparent disabled:bg-gray-100 disabled:border-gray-200': variant === 'outline',
    },
    className,
  );

  const textClasses = clx(
    'font-semibold',
    {
      'text-xl': size === 'lg',
      'text-lg': size === 'md',
      'text-base': size === 'sm',
      'text-white disabled:text-gray-300': variant === 'solid',
      'text-black disabled:text-gray-300': variant === 'outline',
    },
    {
      'text-gray-300': props.disabled || isPending,
    },
  );

  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={props.disabled || isPending}
      className={wrapperClasses}
      {...props}
    >
      <Text disabled={props.disabled || isPending} className={textClasses}>
        {children}
      </Text>
      {isPending && <Loader size={16} color="#B5B5B5" className="animate-spin" />}
      {typeof icon !== 'undefined' && !isPending ? icon : null}
    </TouchableOpacity>
  );
};
