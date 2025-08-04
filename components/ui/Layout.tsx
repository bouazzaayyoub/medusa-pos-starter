import { clx } from '@/utils/clx';
import { ScrollView, ScrollViewProps, View, ViewProps } from 'react-native';

export const Layout: React.FC<ViewProps> = ({ className, ...props }) => {
  return <View className={clx('px-safe-offset-4 pt-safe-offset-6 flex-1 bg-white', className)} {...props} />;
};

export const LayoutWithScroll: React.FC<ScrollViewProps> = (props) => {
  return (
    <View className="relative flex-1 bg-white">
      <View className="pt-safe absolute left-0 right-0 top-0 z-10 bg-white" />
      <ScrollView
        {...props}
        className={clx('flex-1', props.className)}
        contentContainerClassName={clx('px-safe-offset-4 pt-safe-offset-6 pb-6', props.contentContainerClassName)}
      >
        {props.children}
      </ScrollView>
    </View>
  );
};
