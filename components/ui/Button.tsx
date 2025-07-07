import { Loader } from '@/components/icons/loader';
import { clx } from '@/utils/clx';
import * as React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

const BUTTON_SIZES = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
} as const;

const TEXT_SIZES = {
  sm: 'text-lg',
  md: 'text-lg',
  lg: 'text-xl',
} as const;

const BUTTON_VARIANTS = {
  solid: 'bg-black disabled:bg-gray-light',
  outline: 'border border-border bg-transparent disabled:bg-gray-light disabled:border-gray-light',
} as const;

const TEXT_VARIANTS = {
  solid: 'text-white disabled:text-gray',
  outline: 'text-black disabled:text-gray',
} as const;

export type ButtonProps = TouchableOpacityProps & {
  isPending?: boolean;
  size?: keyof typeof BUTTON_SIZES;
  variant?: keyof typeof BUTTON_VARIANTS;
  icon?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  isPending = false,
  size = 'md',
  variant = 'solid',
  icon,
  ...props
}) => {
  const buttonSizeClasses = BUTTON_SIZES[size];
  const textSizeClasses = TEXT_SIZES[size];
  const buttonVariantClasses = BUTTON_VARIANTS[variant];
  const textVariantClasses = TEXT_VARIANTS[variant];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={props.disabled || isPending}
      className={clx(
        'flex-row items-center justify-center gap-2 rounded-xl',
        buttonSizeClasses,
        buttonVariantClasses,
        className,
      )}
      {...props}
    >
      <Text disabled={props.disabled || isPending} className={clx(textSizeClasses, textVariantClasses)}>
        {children}
      </Text>
      {isPending && <Loader size={16} color="#B5B5B5" className="animate-spin" />}
      {icon && !isPending && icon}
    </TouchableOpacity>
  );
};
