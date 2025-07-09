import { Check } from '@/components/icons/check';
import { Package } from '@/components/icons/package';
import { Truck } from '@/components/icons/truck';
import { X } from '@/components/icons/x';
import { clx } from '@/utils/clx';
import { Text, View } from 'react-native';

type TagProps = {
  status?: 'packing' | 'delivering' | 'delivered' | 'canceled';
  className?: string;
};

export const OrderStatus: React.FC<TagProps> = ({ status = 'packing', className }) => {
  switch (status) {
    case 'packing':
      return (
        <View className={clx('px-4 flex-row rounded-full bg-blue-light py-2 gap-2', className)}>
          <Package size={16} color="#2D788D" />
          <Text className="text-blue">Packing</Text>
        </View>
      );
    case 'delivering':
      return (
        <View className={clx('px-4 flex-row rounded-full bg-yellow-light py-2 gap-2', className)}>
          <Truck size={16} color="#9B8435" />
          <Text className="text-yellow">Delivering</Text>
        </View>
      );
    case 'delivered':
      return (
        <View className={clx('px-4 flex-row rounded-full bg-green-light py-2 gap-2', className)}>
          <Check size={16} color="#33C320" />
          <Text className="text-green">Delivered</Text>
        </View>
      );
    case 'canceled':
      return (
        <View className={clx('px-4 flex-row rounded-full bg-red-light py-2 gap-2', className)}>
          <X size={16} color="#F14747" />
          <Text className="text-red">Canceled</Text>
        </View>
      );
  }
};
