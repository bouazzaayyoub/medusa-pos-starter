import {
  getInfoBannerIcon,
  getInfoBannerTextClasses,
  getInfoBannerWrapperClasses,
  InfoBannerProps,
} from '@/components/InfoBanner';
import { clx } from '@/utils/clx';
import { Text, View } from 'react-native';
import { ToastProps } from 'react-native-toast-message';

export type ToastMessageProps = Omit<InfoBannerProps, 'children'> & {
  heading?: string;
  text?: string;
  headingClassName?: string;
} & ToastProps;

export const ToastMessage: React.FC<ToastMessageProps> = ({
  heading,
  headingClassName,
  text,
  textClassName,
  variant = 'solid',
  colorScheme = 'success',
  className,
}) => {
  const wrapperClasses = getInfoBannerWrapperClasses(variant, colorScheme, clx('mx-2', className));

  const headingClasses = getInfoBannerTextClasses(colorScheme, clx('text-lg font-bold', headingClassName));
  const textClasses = getInfoBannerTextClasses(colorScheme, textClassName);

  const icon = getInfoBannerIcon(colorScheme);

  return (
    <View className={wrapperClasses}>
      <View className="flex-1">
        <Text className={headingClasses}>{heading}</Text>
        <Text className={textClasses}>{text}</Text>
      </View>
      {icon}
    </View>
  );
};
