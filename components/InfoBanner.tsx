import { CircleAlert } from '@/components/icons/circle-alert';
import { clx } from '@/utils/clx';
import { Text, View } from 'react-native';

type InfoBannerProps = {
  variant?: 'ghost' | 'solid';
  colorScheme?: 'error' | 'warning' | 'success';
  className?: string;
  children?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showIcon?: boolean;
};

const WRAPPER_COLOR_SCHEME = {
  error: 'bg-red-light',
  warning: 'bg-yellow-light',
  success: 'bg-green-light',
} as const;

const TEXT_COLOR_SCHEME = {
  error: 'text-red',
  warning: 'text-yellow',
  success: 'text-green-dark',
} as const;

const ICON_COLOR_SCHEME = {
  error: '#F14747',
  warning: '#9B8435',
  success: '#33C320',
} as const;

const WRAPPER_VARIANT = {
  ghost: 'justify-end gap-1',
  solid: 'p-4 rounded-xl justify-between gap-3',
} as const;

export const InfoBanner = ({
  variant = 'solid',
  colorScheme = 'warning',
  iconPosition = 'right',
  showIcon = true,
  className,
  children,
}: InfoBannerProps) => {
  const wrapperColorSchemeClassNames = WRAPPER_COLOR_SCHEME[colorScheme];
  const textColorSchemeClassNames = TEXT_COLOR_SCHEME[colorScheme];
  const iconColorSchemeColor = ICON_COLOR_SCHEME[colorScheme];
  const wrapperVariantClassNames = WRAPPER_VARIANT[variant];

  return (
    <View
      className={clx(
        'items-center',
        variant === 'solid' && wrapperColorSchemeClassNames,
        iconPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
        wrapperVariantClassNames,
        className,
      )}
    >
      <Text className={clx('text-base', textColorSchemeClassNames)}>{children}</Text>
      <CircleAlert size={16} color={iconColorSchemeColor} />
    </View>
  );
};
