import { AlertCircle } from '@/components/icons/alert-circle';
import { Archive } from '@/components/icons/archive';
import { CheckCircle } from '@/components/icons/check-circle';
import { FilePen } from '@/components/icons/file-pen';
import { HelpCircle } from '@/components/icons/help-circle';
import { Package } from '@/components/icons/package';
import { PackageOpen } from '@/components/icons/package-open';
import { Truck } from '@/components/icons/truck';
import { X } from '@/components/icons/x';
import { Text } from '@/components/ui/Text';
import { clx } from '@/utils/clx';
import { AdminOrder, FulfillmentStatus } from '@medusajs/types';
import { LucideProps } from 'lucide-react-native';
import { View } from 'react-native';

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
      <View className={clx('px-4 flex-row rounded-full bg-error-200 py-2 gap-2', className)}>
        <X size={16} color="#F14747" />
        <Text className="text-sm text-error-500">Canceled</Text>
      </View>
    );
  }

  if (order.status === 'requires_action') {
    return (
      <View className={clx('px-4 flex-row rounded-full bg-warning-200 py-2 gap-2', className)}>
        <AlertCircle size={16} color="#9B8435" />
        <Text className="text-sm text-warning-500">Requires action</Text>
      </View>
    );
  }

  if (order.status === 'draft') {
    return (
      <View className={clx('px-4 flex-row rounded-full bg-active-200 py-2 gap-2', className)}>
        <FilePen size={16} color="#4E78E5" />
        <Text className="text-sm text-active-500">Draft</Text>
      </View>
    );
  }

  if (order.status === 'archived') {
    return (
      <View className={clx('px-4 flex-row rounded-full bg-gray-100 py-2 gap-2', className)}>
        <Archive size={16} color="#6b7280" />
        <Text className="text-sm text-gray-500">Archived</Text>
      </View>
    );
  }

  const fulfillmentStatus = fulfillmentStatuses[order.fulfillment_status];

  if (!fulfillmentStatus) {
    return (
      <View className={clx('px-4 flex-row rounded-full bg-gray-100 py-2 gap-2', className)}>
        <HelpCircle size={16} color="#6b7280" />
        <Text className="text-sm text-gray-500">Unknown</Text>
      </View>
    );
  }

  const Icon = fulfillmentStatus.icon;

  switch (fulfillmentStatus.color) {
    case 'yellow':
      return (
        <View className={clx('px-4 flex-row rounded-full bg-warning-200 py-2 gap-2', className)}>
          <Icon size={16} color="#9B8435" />
          <Text className="text-sm text-warning-500">{fulfillmentStatus.label}</Text>
        </View>
      );
    case 'green':
      return (
        <View className={clx('px-4 flex-row rounded-full bg-success-200 py-2 gap-2', className)}>
          <Icon size={16} color="#469B3B" />
          <Text className="text-sm text-success-500">{fulfillmentStatus.label}</Text>
        </View>
      );
    case 'red':
      return (
        <View className={clx('px-4 flex-row rounded-full bg-error-200 py-2 gap-2', className)}>
          <Icon size={16} color="#F14747" />
          <Text className="text-sm text-error-500">{fulfillmentStatus.label}</Text>
        </View>
      );
  }
};
