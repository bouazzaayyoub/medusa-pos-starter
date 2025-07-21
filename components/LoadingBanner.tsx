import { Loader } from '@/components/icons/loader';
import { Text } from '@/components/ui/Text';
import { clx } from '@/utils/clx';
import { View } from 'react-native';

type LoadingBannerProps = {
  variant?: 'ghost' | 'outline';
  className?: string;
  children?: React.ReactNode;
};

export const LoadingBanner = ({ variant = 'outline', className, children }: LoadingBannerProps) => {
  const wrapperClasses = clx(
    'items-center gap-2',
    {
      'bg-white border border-gray-200 p-4 flex-row rounded-xl justify-between': variant === 'outline',
      'flex-col-reverse': variant === 'ghost',
    },
    className,
  );

  const textClasses = clx('flex-wrap text-gray-300', {
    'flex-1': variant === 'outline',
  });

  return (
    <View className={wrapperClasses}>
      <Text className={textClasses}>{children}</Text>
      <Loader size={16} color="#B5B5B5" className="animate-spin" />
    </View>
  );
};
