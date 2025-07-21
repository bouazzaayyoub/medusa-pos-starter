import { Text } from '@/components/ui/Text';
import { clx } from '@/utils/clx';
import { SafeAreaView, View } from 'react-native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';

export const CartSkeleton: React.FC<SafeAreaViewProps> = ({ className, ...props }) => (
  <SafeAreaView {...props} className={clx('relative flex-1 pt-4 bg-white', className)}>
    <View className="px-4">
      <Text className="text-black text-4xl mb-6">Cart</Text>
      <View className="flex-row pb-6 border-b border-gray-200 justify-between items-center">
        <View>
          <View className="w-32 h-6 rounded-md bg-gray-200 mb-2" />
          <View className="w-48 h-4 rounded-md bg-gray-200" />
        </View>
        <View className="w-8 h-8 rounded-md bg-gray-200" />
      </View>
      {[1, 2].map((index) => (
        <View key={index} className="flex-row gap-4 bg-white py-6 border-b border-gray-200">
          <View className="h-[5.25rem] w-[5.25rem] rounded-xl bg-gray-200" />
          <View className="flex-col gap-2 flex-1">
            <View className="w-3/4 h-5 rounded-md bg-gray-200" />
            <View className="w-1/2 h-4 rounded-md bg-gray-200" />
            <View className="w-20 h-8 rounded-md bg-gray-200" />
          </View>
          <View className="w-16 h-5 rounded-md bg-gray-200 ml-auto" />
        </View>
      ))}
      <View className="mt-6 mb-20">
        <View className="flex-row gap-2 items-start mb-6">
          <View className="w-[60%] h-[3.125rem] rounded-md bg-gray-200" />
          <View className="flex-1 h-[3.125rem] rounded-md bg-gray-200" />
        </View>
        <View className="flex-row mb-2 justify-between">
          <View className="w-16 h-4 rounded-md bg-gray-200" />
          <View className="w-20 h-4 rounded-md bg-gray-200" />
        </View>
        <View className="flex-row justify-between">
          <View className="w-20 h-4 rounded-md bg-gray-200" />
          <View className="w-24 h-4 rounded-md bg-gray-200" />
        </View>
        <View className="h-px bg-gray-200 my-4" />
        <View className="flex-row justify-between mb-6">
          <View className="w-16 h-7 rounded-md bg-gray-200" />
          <View className="w-24 h-7 rounded-md bg-gray-200" />
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 h-12 rounded-md bg-gray-200" />
          <View className="flex-1 h-12 rounded-md bg-gray-200" />
        </View>
      </View>
    </View>
  </SafeAreaView>
);
