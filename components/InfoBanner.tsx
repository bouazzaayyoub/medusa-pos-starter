import { CircleAlert } from '@/components/icons/circle-alert';
import { clx } from '@/utils/clx';
import { Text, View } from 'react-native';

type InfoBannerProps = {
  variant?: 'ghost' | 'solid';
  colorScheme?: 'error' | 'warning';
  className?: string;
  children?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

const WRAPPER_COLOR_SCHEME = {
  error: 'bg-red-light',
  warning: 'bg-yellow-light',
} as const;

const TEXT_COLOR_SCHEME = {
  error: 'text-red',
  warning: 'text-yellow',
} as const;

const ICON_COLOR_SCHEME = {
  error: '#F14747',
  warning: '#9B8435',
} as const;

const WRAPPER_VARIANT = {
  ghost: 'justify-end',
  solid: 'p-4 rounded-xl justify-between',
} as const;

export const InfoBanner = ({
  variant = 'solid',
  colorScheme = 'warning',
  iconPosition = 'right',
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
        'gap-3 items-center',
        variant === 'solid' && wrapperColorSchemeClassNames,
        iconPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
        wrapperVariantClassNames,
        className,
      )}
    >
      <Text className={clx('text-base', textColorSchemeClassNames)}>{children}</Text>
      <CircleAlert size={16} color={iconColorSchemeColor} />,
    </View>
  );
};
