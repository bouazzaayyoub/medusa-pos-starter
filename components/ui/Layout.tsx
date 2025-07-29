import { clx } from '@/utils/clx';
import { ScrollView, ScrollViewProps } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

export const Layout: React.FC<SafeAreaViewProps> = ({ className, ...props }) => {
  return <SafeAreaView className={clx('flex-1 px-4 pt-6 bg-white', className)} {...props} />;
};

export const LayoutWithScroll: React.FC<ScrollViewProps> = (props) => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="always"
      {...props}
      className={clx('flex-1 bg-white', props.className)}
      contentContainerClassName={clx('px-4 py-6', props.contentContainerClassName)}
    >
      {props.children}
    </ScrollView>
  );
};
