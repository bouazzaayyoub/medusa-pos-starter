import { DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL } from '@/api/hooks/draft-orders';
import { useOrder } from '@/api/hooks/orders';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/contexts/settings';
import { AdminOrder, AdminOrderLineItem } from '@medusajs/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const CustomerInformation: React.FC<{
  order: AdminOrder;
}> = ({ order }) => {
  const customerEmail = order.customer?.email;
  const customerName = [order.customer?.first_name, order.customer?.last_name].filter(Boolean).join(' ');
  const customerPhone = order.customer?.phone;
  const customerAddress = order.shipping_address
    ? [
        order.shipping_address.address_1,
        order.shipping_address.address_2,
        [order.shipping_address.postal_code, order.shipping_address.city].filter(Boolean).join(' '),
        order.shipping_address.province,
        order.shipping_address.country?.display_name,
      ]
        .filter(Boolean)
        .join(', ')
    : undefined;
  const isPosDefaultCustomer = !customerEmail || customerEmail === DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL;

  if (isPosDefaultCustomer) {
    return (
      <View className="mb-4 gap-4">
        <Text className="text-xl">Information</Text>
        <View>
          <Text className="text-gray text-sm">
            No customer information available. This order was created on POS without a customer.
          </Text>
        </View>
      </View>
    );
  }

  const info = [
    { label: 'Full Name', value: customerName },
    { label: 'Mail', value: customerEmail },
    { label: 'Address', value: customerAddress },
    { label: 'Phone', value: customerPhone },
  ].filter((item) => item.value && item.value.trim().length > 0);

  return (
    <View className="gap-4 mb-4">
      <Text className="text-xl">Information</Text>
      {info.map((item, index) => (
        <View key={item.label}>
          <View className="flex-row justify-between gap-4 items-center">
            <Text className="text-gray flex-1 text-sm">{item.label}</Text>
            <Text className="flex-1 text-sm flex-wrap text-right">{item.value}</Text>
          </View>
          {index < info.length - 1 && <View className="h-px bg-border mt-2 w-full" />}
        </View>
      ))}
    </View>
  );
};

export default function OrderDetailsScreen() {
  const { orderId, orderNumber, orderDate } = useLocalSearchParams<{
    orderId: string;
    orderNumber: string;
    orderDate: string;
  }>();

  const settings = useSettings();
  const orderQuery = useOrder(orderId);
  const [visible, setVisible] = React.useState(false);

  const currency = orderQuery.data?.order.region?.currency_code || settings.data?.region?.currency_code || 'EUR';

  const renderItem = ({ item }: { item: AdminOrderLineItem }) => {
    const thumbnail = item.thumbnail || item.product?.thumbnail || item.product?.images?.[0]?.url;
    return (
      <TouchableOpacity className="flex-row gap-4">
        <View className="bg-gray h-16 aspect-square rounded-lg overflow-hidden">
          {thumbnail && <Image source={{ uri: thumbnail }} className="w-full h-full object-cover" />}
        </View>
        <View>
          <Text className="font-medium">{item.title}</Text>
          <Text className="text-gray text-sm mt-auto">{item.variant?.options?.map((o) => o.value).join(', ')}</Text>
        </View>
        <View className="ml-auto">
          <Text className="font-medium">
            {item.total.toLocaleString('en-US', {
              style: 'currency',
              currency,
              currencyDisplay: 'narrowSymbol',
            })}
          </Text>
          <Text className="text-gray text-sm mt-auto text-right">Qty: {item.quantity.toLocaleString('en-US')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    }, 100);
  }, []);

  return (
    <BottomSheet visible={visible} onClose={() => router.back()} showCloseButton={false} dismissOnOverlayPress>
      {({ animateOut }) => (
        <>
          <View className="flex-row gap-4 mb-4 items-center justify-between">
            <Text className="text-2xl">Order #{orderNumber}</Text>
            <Text className="text-gray">{orderDate}</Text>
          </View>
          <FlatList
            data={orderQuery.data?.order.items}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View className="w-full h-px bg-border my-6" />}
            contentContainerClassName="pt-4 grow-0"
            className="grow-0 shrink"
            ListFooterComponent={() =>
              orderQuery.isSuccess && settings.isSuccess ? (
                <>
                  <CustomerInformation order={orderQuery.data.order} />
                  <Text className="mb-4 text-xl">Price</Text>
                  <View className="gap-2">
                    <View className="flex-row justify-between gap-4 items-center">
                      <Text className="text-gray flex-1 text-sm">Taxes</Text>
                      <Text className="flex-1 text-sm flex-wrap text-right">
                        {orderQuery.data.order.tax_total.toLocaleString('en-US', {
                          style: 'currency',
                          currency,
                          currencyDisplay: 'narrowSymbol',
                        })}
                      </Text>
                    </View>
                    <View className="flex-row justify-between gap-4 items-center">
                      <Text className="text-gray flex-1 text-sm">Subtotal</Text>
                      <Text className="flex-1 text-sm flex-wrap text-right">
                        {orderQuery.data.order.subtotal.toLocaleString('en-US', {
                          style: 'currency',
                          currency,
                          currencyDisplay: 'narrowSymbol',
                        })}
                      </Text>
                    </View>
                    {orderQuery.data.order.discount_total > 0 && (
                      <View className="flex-row justify-between gap-4 items-center">
                        <Text className="text-gray flex-1 text-sm">Discount</Text>
                        <Text className="flex-1 text-sm flex-wrap text-right">
                          {(orderQuery.data.order.discount_total * -1).toLocaleString('en-US', {
                            style: 'currency',
                            currency,
                            currencyDisplay: 'narrowSymbol',
                          })}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="h-px bg-border my-4 w-full" />
                  <View className="flex-row justify-between gap-4 mb-4 items-center">
                    <Text className="flex-1 text-lg">Total</Text>
                    <Text className="flex-1 text-lg flex-wrap text-right">
                      {orderQuery.data.order.total.toLocaleString('en-US', {
                        style: 'currency',
                        currency: orderQuery.data.order.region?.currency_code || settings.data?.region?.currency_code,
                        currencyDisplay: 'narrowSymbol',
                      })}
                    </Text>
                  </View>
                  <Button size="lg" variant="outline" onPress={() => animateOut(() => router.back())}>
                    Close
                  </Button>
                </>
              ) : null
            }
            ListFooterComponentClassName="mt-14"
          />
        </>
      )}
    </BottomSheet>
  );
}
