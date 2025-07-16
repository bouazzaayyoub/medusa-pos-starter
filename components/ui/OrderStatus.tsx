import { AlertCircle } from '@/components/icons/alert-circle';
import { Archive } from '@/components/icons/archive';
import { CheckCircle } from '@/components/icons/check-circle';
import { FilePen } from '@/components/icons/file-pen';
import { HelpCircle } from '@/components/icons/help-circle';
import { Package } from '@/components/icons/package';
import { PackageOpen } from '@/components/icons/package-open';
import { Truck } from '@/components/icons/truck';
import { X } from '@/components/icons/x';
import { clx } from '@/utils/clx';
import { AdminOrder, FulfillmentStatus } from '@medusajs/types';
import { LucideProps } from 'lucide-react-native';
import { Text, View } from 'react-native';

type OrderStatusProps = {
  order: AdminOrder;
  className?: string;
};

const fulfillmentStatuses: Record<
  FulfillmentStatus,
  {
    label: string;
    color: 'red' | 'yellow' | 'green';
    icon: React.ComponentType<LucideProps>;
  }
> = {
  not_fulfilled: {
    label: 'Not fulfilled',
    color: 'red',
    icon: Package,
  },
  partially_fulfilled: {
    label: 'Partially fulfilled',
    color: 'yellow',
    icon: PackageOpen,
  },
  fulfilled: {
    label: 'Fulfilled',
    color: 'green',
    icon: CheckCircle,
  },
  partially_shipped: {
    label: 'Partially shipped',
    color: 'yellow',
    icon: Truck,
  },
  shipped: {
    label: 'Shipped',
    color: 'green',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'green',
    icon: Truck,
  },
  partially_delivered: {
    label: 'Partially delivered',
    color: 'yellow',
    icon: Truck,
  },
  canceled: {
    label: 'Canceled',
    color: 'red',
    icon: X,
  },
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ order, className }) => {
  if (order.status === 'canceled') {
    return (
      <View className={clx('px-4 flex-row rounded-full bg-red-light py-2 gap-2', className)}>
        <X size={16} color="#F14747" />
        <Text className="text-red">Canceled</Text>
      </View>
    );
  }

  if (order.status === 'requires_action') {
    return (
      <View className={clx('px-4 flex-row rounded-full bg-yellow-light py-2 gap-2', className)}>
        <AlertCircle size={16} color="#9B8435" />
        <Text className="text-yellow">Requires action</Text>
      </View>
    );
  }

  if (order.status === 'draft') {
    return (
      <View className={clx('px-4 flex-row rounded-full bg-blue-light py-2 gap-2', className)}>
        <FilePen size={16} color="#2D788D" />
        <Text className="text-blue">Draft</Text>
      </View>
    );
  }

  if (order.status === 'archived') {
    return (
      <View className={clx('px-4 flex-row rounded-full bg-gray-light py-2 gap-2', className)}>
        <Archive size={16} color="#A0AEC0" />
        <Text className="text-gray">Archived</Text>
      </View>
    );
  }

  const fulfillmentStatus = fulfillmentStatuses[order.fulfillment_status];

  if (!fulfillmentStatus) {
    return (
      <View className={clx('px-4 flex-row rounded-full bg-gray-light py-2 gap-2', className)}>
        <HelpCircle size={16} color="#A0AEC0" />
        <Text className="text-gray">Unknown</Text>
      </View>
    );
  }

  const Icon = fulfillmentStatus.icon;

  switch (fulfillmentStatus.color) {
    case 'yellow':
      return (
        <View className={clx('px-4 flex-row rounded-full bg-yellow-light py-2 gap-2', className)}>
          <Icon size={16} color="#9B8435" />
          <Text className="text-yellow">{fulfillmentStatus.label}</Text>
        </View>
      );
    case 'green':
      return (
        <View className={clx('px-4 flex-row rounded-full bg-green-light py-2 gap-2', className)}>
          <Icon size={16} color="#33C320" />
          <Text className="text-green">{fulfillmentStatus.label}</Text>
        </View>
      );
    case 'red':
      return (
        <View className={clx('px-4 flex-row rounded-full bg-red-light py-2 gap-2', className)}>
          <Icon size={16} color="#F14747" />
          <Text className="text-red">{fulfillmentStatus.label}</Text>
        </View>
      );
  }
};
