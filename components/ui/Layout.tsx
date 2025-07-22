import { clx } from '@/utils/clx';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

export const Layout: React.FC<SafeAreaViewProps> = ({ className, ...props }) => {
  return <SafeAreaView className={clx('flex-1 px-4 pt-6 bg-white', className)} {...props} />;
};
