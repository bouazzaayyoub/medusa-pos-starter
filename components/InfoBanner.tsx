import { CircleAlert } from '@/components/icons/circle-alert';
import { clx } from '@/utils/clx';
import { Text, View } from 'react-native';

type InfoBannerProps = {
  variant?: 'ghost' | 'solid';
  colorScheme?: 'error' | 'warning';
  className?: string;
  children?: React.ReactNode;
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

export const InfoBanner = ({ variant = 'solid', colorScheme = 'warning', className, children }: InfoBannerProps) => {
  const wrapperColorSchemeClassNames = WRAPPER_COLOR_SCHEME[colorScheme];
  const textColorSchemeClassNames = TEXT_COLOR_SCHEME[colorScheme];
  const iconColorSchemeColor = ICON_COLOR_SCHEME[colorScheme];

  return (
    <View
      className={clx(
        'flex-row rounded-xl justify-between gap-3 items-center',
        variant === 'solid' && wrapperColorSchemeClassNames,
        variant === 'solid' ? 'p-4' : '',
        className,
      )}
    >
      <Text className={clx('text-base', textColorSchemeClassNames)}>{children}</Text>
      <CircleAlert size={16} color={iconColorSchemeColor} />,
    </View>
  );
};
