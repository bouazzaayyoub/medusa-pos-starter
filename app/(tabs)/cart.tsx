import { useCustomers } from '@/api/hooks/customers';
import {
  DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL,
  useAddPromotion,
  useCancelDraftOrder,
  useDraftOrder,
  useUpdateDraftOrderCustomer,
  useUpdateDraftOrderItem,
} from '@/api/hooks/draft-orders';
import { Form } from '@/components/form/Form';
import { FormButton } from '@/components/form/FormButton';
import { TextField } from '@/components/form/TextField';
import { ChevronDown } from '@/components/icons/chevron-down';
import { ShoppingCart } from '@/components/icons/shopping-cart';
import { Trash2 } from '@/components/icons/trash-2';
import { UserRoundPlus } from '@/components/icons/user-round-plus';
import { X } from '@/components/icons/x';
import { SwipeableListItem } from '@/components/SwipeableListItem';
import { Button } from '@/components/ui/Button';
import { QuantityPicker } from '@/components/ui/QuantityPicker';
import { useSettings } from '@/contexts/settings';
import { AdminDraftOrder, AdminOrderLineItem } from '@medusajs/types';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { FlashListProps, FlashList as FlashListType } from '@shopify/flash-list';
import { AnimatedFlashList as FlashList, ListRenderItem } from '@shopify/flash-list';
import { useIsMutating } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { SequencedTransition, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod/v4';

const addPromotionFormSchema = z.object({
  promotionCode: z.string().min(1, 'Promotion code is required'),
});

const ItemCell: FlashListProps<AdminOrderLineItem>['CellRendererComponent'] = (props) => {
  return <Animated.View {...props} layout={SequencedTransition} exiting={SlideOutLeft} entering={SlideInRight} />;
};

const DraftOrderItem: React.FC<{ item: AdminOrderLineItem; onRemove?: (item: AdminOrderLineItem) => void }> = ({
  item,
  onRemove,
}) => {
  const settings = useSettings();
  const draftOrder = useDraftOrder();
  const updateDraftOrderItem = useUpdateDraftOrderItem();
  const thumbnail = item.thumbnail || item.product?.thumbnail || item.product?.images?.[0]?.url;

  return (
    <SwipeableListItem
      rightClassName="bg-red-500"
      rightWidth={60}
      rightContent={(reset) => (
        <Pressable
          className="flex-1 w-full h-full justify-center items-center"
          onPress={() => {
            reset();
            onRemove?.(item);
          }}
        >
          <Trash2 size={24} color="white" />
        </Pressable>
      )}
    >
      <View className="flex-row gap-4 px-4 bg-white py-6">
        <View className="h-[5.25rem] w-[5.25rem] rounded-xl bg-border overflow-hidden">
          {thumbnail && <Image source={{ uri: thumbnail }} className="w-full h-full object-cover" />}
        </View>
        <View className="flex-col gap-2 flex-1">
          <Text className="font-medium">{item.product_title}</Text>
          {item.variant && item.variant.options && item.variant.options.length > 0 && (
            <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1">
              {item.variant.options.map((option) => (
                <View className="flex-row" key={option.id}>
                  <Text className="text-gray-dark text-sm">{option.option?.title || option.option_id}:</Text>
                  <Text className="text-sm">{option.value}</Text>
                </View>
              ))}
            </View>
          )}
          <QuantityPicker
            quantity={item.quantity}
            max={item.variant?.inventory_quantity}
            onQuantityChange={(quantity) =>
              updateDraftOrderItem.mutate({
                id: item.id,
                update: {
                  quantity,
                },
              })
            }
            className="self-start"
          />
        </View>
        <Text className="font-medium ml-auto">
          {item.unit_price.toLocaleString('en-US', {
            style: 'currency',
            currency: draftOrder.data?.draft_order.region?.currency_code || settings.data?.region?.currency_code,
            currencyDisplay: 'narrowSymbol',
          })}
        </Text>
      </View>
    </SwipeableListItem>
  );
};

const CustomerBadge: React.FC<{ customer: AdminDraftOrder['customer'] }> = ({ customer }) => {
  const updateDraftOrder = useUpdateDraftOrderCustomer();
  const defaultCustomer = useCustomers({ email: DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL }, 1);

  if (!customer || customer.email === DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL) {
    return (
      <Button
        onPress={() => router.push('/customer-lookup')}
        variant="outline"
        icon={<UserRoundPlus size={20} />}
        className="justify-between mb-6"
      >
        Add Customer
      </Button>
    );
  }

  const customerName = [customer.first_name, customer.last_name].filter(Boolean).join(' ');

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: '/customer-lookup',
          params: {
            customerId: customer.id,
          },
        });
      }}
      className="flex-row mb-6 pb-6 border-b border-border justify-between items-center"
    >
      {customerName.length > 0 ? (
        <View>
          <Text className="text-lg">{customerName}</Text>
          <Text className="text-sm text-gray">{customer.email}</Text>
        </View>
      ) : (
        <View>
          <Text className="text-sm text-gray">Customer</Text>
          <Text className="text-lg">{customer.email}</Text>
        </View>
      )}

      <View className="flex-row">
        <View className="p-2">
          <ChevronDown size={24} />
        </View>
        <TouchableOpacity
          onPress={() => updateDraftOrder.mutate(defaultCustomer.data?.pages[0].customers?.[0])}
          className="p-2"
        >
          <X size={24} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function CartScreen() {
  const settings = useSettings();
  const draftOrder = useDraftOrder();
  const addPromotion = useAddPromotion();
  const cancelDraftOrder = useCancelDraftOrder();
  const updateDraftOrderItem = useUpdateDraftOrderItem();
  const isUpdatingDraftOrder = useIsMutating({ mutationKey: ['draft-order'], exact: false });
  const bottomTabBarHeight = useBottomTabBarHeight();
  const itemsListRef = React.useRef<FlashListType<AdminOrderLineItem>>(null);

  const onItemRemove = React.useCallback(
    (item: AdminOrderLineItem) => {
      updateDraftOrderItem.mutate({ id: item.id, update: { quantity: 0 } });
      itemsListRef.current?.prepareForLayoutAnimationRender();
    },
    [updateDraftOrderItem],
  );

  const renderItem = React.useCallback<ListRenderItem<AdminOrderLineItem>>(
    ({ item }) => <DraftOrderItem item={item} onRemove={onItemRemove} />,
    [onItemRemove],
  );

  if (draftOrder.isLoading || settings.isLoading) {
    return (
      <SafeAreaView className="relative flex-1 px-4 bg-white">
        <View className="py-4">
          <Text className="text-black text-[40px] font-semibold">Cart</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (draftOrder.isError || settings.isError) {
    return (
      <SafeAreaView className="relative flex-1 px-4 bg-white">
        <View className="py-4">
          <Text className="text-black text-[40px] font-semibold">Cart</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">Failed to load cart data.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!draftOrder.data?.draft_order) {
    return (
      <SafeAreaView className="relative flex-1 px-4 bg-white">
        <View className="py-4">
          <Text className="text-black text-[40px] font-semibold">Cart</Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-dark">Cart is not created.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (draftOrder.data?.draft_order.items.length === 0) {
    return (
      <SafeAreaView className="relative flex-1 px-4 bg-white" style={{ paddingBottom: bottomTabBarHeight }}>
        <View className="py-4">
          <Text className="text-black text-[40px] font-semibold">Cart</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ShoppingCart size={24} className="mb-1" />
          <Text className="text-xl mb-1">Your cart is empty</Text>
          <Text className="text-gray text-base">Add products to begin</Text>
        </View>
        <View className="flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => {
              cancelDraftOrder.mutate();
            }}
            isPending={cancelDraftOrder.isPending}
          >
            Cancel Cart
          </Button>
          <Button className="flex-1" disabled>
            Checkout
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const items = draftOrder.data.draft_order.items;

  return (
    <SafeAreaView className="relative flex-1 bg-white">
      <View className="p-4">
        <Text className="text-black text-[40px] font-semibold">Cart</Text>
      </View>

      <View className="px-4">
        <CustomerBadge customer={draftOrder.data.draft_order.customer} />
      </View>

      <FlashList
        ref={itemsListRef}
        data={items}
        keyExtractor={(item) => item.id}
        estimatedItemSize={132}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-px bg-border" />}
        CellRendererComponent={ItemCell}
        disableAutoLayout
      />

      <View className="mt-6 mb-20 px-4">
        <Form
          schema={addPromotionFormSchema}
          onSubmit={(data, form) => {
            addPromotion.mutate(data.promotionCode, {
              onSuccess: () => {
                form.reset();
              },
            });
          }}
          className="flex-row gap-2 items-start mb-6"
        >
          <TextField
            placeholder="Enter promotion code"
            name="promotionCode"
            className="w-[60%] h-[3.125rem]"
            inputClassName="py-0 h-full"
            readOnly={addPromotion.isPending}
            autoComplete="off"
            autoCorrect={false}
            enterKeyHint="send"
            errorVariation="inline"
          />
          <FormButton
            size="sm"
            className="flex-1 h-[3.125rem]"
            isPending={addPromotion.isPending}
            disabled={draftOrder.isFetching || isUpdatingDraftOrder > 0}
          >
            Submit
          </FormButton>
        </Form>
        <View className="flex-row mb-2 justify-between">
          <Text className="text-gray-dark">Taxes</Text>
          {draftOrder.isFetching || isUpdatingDraftOrder > 0 ? (
            <View className="w-1/4 h-[17px] rounded-md bg-gray-200" />
          ) : (
            <Text className="text-gray-dark">
              {draftOrder.data?.draft_order.tax_total?.toLocaleString('en-US', {
                style: 'currency',
                currency: draftOrder.data?.draft_order.region?.currency_code || settings.data?.region?.currency_code,
                currencyDisplay: 'narrowSymbol',
              })}
            </Text>
          )}
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-dark">Subtotal</Text>
          {draftOrder.isFetching || isUpdatingDraftOrder > 0 ? (
            <View className="w-1/4 h-[17px] rounded-md bg-gray-200" />
          ) : (
            <Text className="text-gray-dark">
              {draftOrder.data?.draft_order.subtotal?.toLocaleString('en-US', {
                style: 'currency',
                currency: draftOrder.data?.draft_order.region?.currency_code || settings.data?.region?.currency_code,
                currencyDisplay: 'narrowSymbol',
              })}
            </Text>
          )}
        </View>

        <View className="h-px bg-border my-4" />

        <View className="flex-row justify-between mb-6">
          <Text className="font-medium text-lg">Total</Text>
          {draftOrder.isFetching || isUpdatingDraftOrder > 0 ? (
            <View className="w-1/4 h-7 rounded-md bg-gray-200" />
          ) : (
            <Text className="font-medium text-lg">
              {draftOrder.data?.draft_order.total?.toLocaleString('en-US', {
                style: 'currency',
                currency: draftOrder.data?.draft_order.region?.currency_code || settings.data?.region?.currency_code,
                currencyDisplay: 'narrowSymbol',
              })}
            </Text>
          )}
        </View>

        <View className="flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => {
              Alert.alert('Cancel Cart', 'Are you sure you want to cancel the cart?', [
                {
                  text: 'No',
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  isPreferred: true,
                  onPress: () => {
                    cancelDraftOrder.mutate();
                  },
                  style: 'destructive',
                },
              ]);
            }}
            isPending={cancelDraftOrder.isPending}
            disabled={draftOrder.isFetching || isUpdatingDraftOrder > 0}
          >
            Cancel Cart
          </Button>
          <Button
            className="flex-1"
            disabled={
              draftOrder.data.draft_order.items.length === 0 || draftOrder.isFetching || isUpdatingDraftOrder > 0
            }
            onPress={() => {
              router.push('/checkout');
            }}
          >
            Checkout
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
