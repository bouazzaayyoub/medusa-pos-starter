import { clx } from '@/utils/clx';
import { ScrollView, ScrollViewProps, View, ViewProps } from 'react-native';

export const Layout: React.FC<ViewProps> = ({ className, ...props }) => {
  return <View className={clx('flex-1 px-safe-offset-4 pt-safe-offset-6 bg-white', className)} {...props} />;
};

export const LayoutWithScroll: React.FC<ScrollViewProps> = (props) => {
  return (
    <View className="flex-1 bg-white relative">
      <View className="absolute top-0 left-0 right-0 pt-safe bg-white z-10" />
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
