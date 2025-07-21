import { Check } from '@/components/icons/check';
import { CircleAlert } from '@/components/icons/circle-alert';
import { TriangleAlert } from '@/components/icons/triangle-alert';
import { Text } from '@/components/ui/Text';
import { clx } from '@/utils/clx';
import { View } from 'react-native';

type InfoBannerProps = {
  variant?: 'ghost' | 'solid';
  colorScheme?: 'error' | 'warning' | 'success';
  textClassName?: string;
  className?: string;
  children?: React.ReactNode;
};

export const InfoBanner = ({
  variant = 'solid',
  colorScheme = 'warning',
  textClassName,
  className,
  children,
}: InfoBannerProps) => {
  const wrapperClasses = clx(
    'items-center flex-row',
    {
      'bg-error-200': colorScheme === 'error' && variant === 'solid',
      'bg-warning-200': colorScheme === 'warning' && variant === 'solid',
      'bg-success-200': colorScheme === 'success' && variant === 'solid',
      'p-4 rounded-xl justify-between gap-2': variant === 'solid',
      'gap-2 flex-row-reverse': variant === 'ghost',
    },
    className,
  );

  const textClasses = clx(
    'flex-1 flex-wrap',
    {
      'text-error-500': colorScheme === 'error',
      'text-warning-500': colorScheme === 'warning',
      'text-success-500': colorScheme === 'success',
    },
    textClassName,
  );

  const icon = {
    error: <CircleAlert size={16} color="#F14747" />,
    warning: <TriangleAlert size={16} color="#9B8435" />,
    success: <Check size={16} color="#469B3B" />,
  }[colorScheme];

  return (
    <View className={wrapperClasses}>
      <Text className={textClasses}>{children}</Text>
      {icon}
    </View>
  );
};
