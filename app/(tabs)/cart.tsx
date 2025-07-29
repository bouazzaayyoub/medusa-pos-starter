import { useCustomers } from '@/api/hooks/customers';
import {
  DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL,
  useAddPromotion,
  useCancelDraftOrder,
  useCurrentDraftOrder,
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
import { InfoBanner } from '@/components/InfoBanner';
import { CartSkeleton } from '@/components/skeletons/CartSkeleton';
import { SwipeableListItem } from '@/components/SwipeableListItem';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/ui/Layout';
import { QuantityPicker } from '@/components/ui/QuantityPicker';
import { Text } from '@/components/ui/Text';
import { useSettings } from '@/contexts/settings';
import { AdminDraftOrder, AdminOrderLineItem } from '@medusajs/types';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { FlashListProps, FlashList as FlashListType } from '@shopify/flash-list';
import { AnimatedFlashList as FlashList, ListRenderItem } from '@shopify/flash-list';
import { useIsMutating } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as React from 'react';
import { Alert, Image, Platform, Pressable, TouchableOpacity, View } from 'react-native';
import Animated, { SequencedTransition, SlideOutLeft } from 'react-native-reanimated';
import * as z from 'zod/v4';

const addPromotionFormSchema = z.object({
  promotionCode: z.string().min(1, 'Promotion code is required'),
});

const ItemCell: FlashListProps<AdminOrderLineItem>['CellRendererComponent'] = (props) => {
  return <Animated.View {...props} layout={SequencedTransition} exiting={SlideOutLeft} />;
};

const DraftOrderItem: React.FC<{ item: AdminOrderLineItem; onRemove?: (item: AdminOrderLineItem) => void }> = ({
  item,
  onRemove,
}) => {
  const settings = useSettings();
  const draftOrder = useCurrentDraftOrder();
  const updateDraftOrderItem = useUpdateDraftOrderItem();
  const thumbnail = item.thumbnail || item.product?.thumbnail || item.product?.images?.[0]?.url;

  return (
    <SwipeableListItem
      rightClassName="bg-white"
      rightWidth={80}
      rightContent={(reset) => (
        <View className="flex-1 w-full h-full justify-center items-center p-2">
          <Pressable
            className="flex-1 w-full h-full justify-center items-center rounded-xl bg-error-500"
            onPress={() => {
              reset();
              onRemove?.(item);
            }}
          >
            <Trash2 size={24} color="white" />
          </Pressable>
        </View>
      )}
    >
      <View className="flex-row gap-4 bg-white py-6">
        <View className="h-[5.25rem] w-[5.25rem] rounded-xl bg-gray-200 overflow-hidden">
          {thumbnail && <Image source={{ uri: thumbnail }} className="w-full h-full object-cover" />}
        </View>
        <View className="flex-col gap-2 flex-1">
          <Text>{item.product_title}</Text>
          {item.variant && item.variant.options && item.variant.options.length > 0 && (
            <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
              {item.variant.options.map((option) => (
                <View className="flex-row gap-1" key={option.id}>
                  <Text className="text-gray-400 text-sm">{option.option?.title || option.option_id}:</Text>
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
        <Text className="ml-auto">
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
      className="flex-row mb-6 pb-6 border-b border-gray-200 justify-between items-center"
    >
      {customerName.length > 0 ? (
        <View>
          <Text className="text-lg">{customerName}</Text>
          <Text className="text-sm text-gray-300">{customer.email}</Text>
        </View>
      ) : (
        <View>
          <Text className="text-sm text-gray-300">Customer</Text>
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
  const draftOrder = useCurrentDraftOrder();
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
      <CartSkeleton
        style={Platform.select({
          ios: {
            paddingBottom: bottomTabBarHeight + 10,
          },
        })}
      />
    );
  }

  if (draftOrder.isError || settings.isError) {
    return (
      <Layout
        style={Platform.select({
          ios: {
            paddingBottom: bottomTabBarHeight + 10,
          },
        })}
      >
        <Text className="text-4xl">Cart</Text>
        <View className="flex-1 items-center  gap-2 justify-center">
          <InfoBanner variant="ghost" colorScheme="error" className="w-40">
            Failed to load cart
          </InfoBanner>
          <Button
            onPress={() => {
              draftOrder.refetch();
              settings.refetch();
            }}
            isPending={draftOrder.isRefetching || settings.isRefetching}
            variant="outline"
          >
            Try Again
          </Button>
        </View>
      </Layout>
    );
  }

  if (!draftOrder.data?.draft_order || !draftOrder.data?.draft_order.items.length) {
    return (
      <Layout
        style={Platform.select({
          ios: {
            paddingBottom: bottomTabBarHeight + 10,
          },
        })}
      >
        <Text className="text-4xl">Cart</Text>
        <View className="flex-1 items-center gap-1 justify-center">
          <ShoppingCart size={24} />
          <Text className="text-xl">Your cart is empty</Text>
          <Text className="text-gray-300">Add products to begin</Text>
        </View>
        <View className="flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => {
              cancelDraftOrder.mutate();
            }}
            isPending={cancelDraftOrder.isPending}
            disabled={!draftOrder.data?.draft_order}
          >
            Cancel Cart
          </Button>
          <Button className="flex-1" disabled>
            Checkout
          </Button>
        </View>
      </Layout>
    );
  }

  const items = draftOrder.data.draft_order.items;

  return (
    <Layout>
      <Text className="text-4xl mb-6">Cart</Text>

      <CustomerBadge customer={draftOrder.data.draft_order.customer} />

      <FlashList
        ref={itemsListRef}
        data={items}
        keyExtractor={(item) => item.id}
        estimatedItemSize={132}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-hairline bg-gray-200" />}
        CellRendererComponent={ItemCell}
        disableAutoLayout
      />

      <View
        className="mt-6"
        style={Platform.select({
          ios: {
            paddingBottom: bottomTabBarHeight + 10,
          },
        })}
      >
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
            className="w-[60%] h-14"
            inputClassName="py-0 h-full"
            readOnly={addPromotion.isPending}
            autoComplete="off"
            autoCorrect={false}
            enterKeyHint="send"
            errorVariation="inline"
          />
          <FormButton
            className="flex-1"
            isPending={addPromotion.isPending}
            disabled={draftOrder.isFetching || isUpdatingDraftOrder > 0}
          >
            Submit
          </FormButton>
        </Form>
        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-400 text-sm">Taxes</Text>
            {draftOrder.isFetching || isUpdatingDraftOrder > 0 ? (
              <View className="w-1/4 h-[17px] rounded-md bg-gray-200" />
            ) : (
              <Text className="text-gray-400 text-sm">
                {draftOrder.data.draft_order.tax_total?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: draftOrder.data?.draft_order.region?.currency_code || settings.data?.region?.currency_code,
                  currencyDisplay: 'narrowSymbol',
                })}
              </Text>
            )}
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-400 text-sm">Subtotal</Text>
            {draftOrder.isFetching || isUpdatingDraftOrder > 0 ? (
              <View className="w-1/4 h-[17px] rounded-md bg-gray-200" />
            ) : (
              <Text className="text-gray-400 text-sm">
                {draftOrder.data.draft_order.subtotal?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: draftOrder.data.draft_order.region?.currency_code || settings.data?.region?.currency_code,
                  currencyDisplay: 'narrowSymbol',
                })}
              </Text>
            )}
          </View>
          {draftOrder.data.draft_order.discount_total > 0 && (
            <View className="flex-row justify-between">
              <Text className="text-gray-400">Discount</Text>
              {draftOrder.isFetching || isUpdatingDraftOrder > 0 ? (
                <View className="w-1/4 h-[17px] rounded-md bg-gray-200" />
              ) : (
                <Text className="text-gray-400">
                  {(draftOrder.data.draft_order.discount_total * -1)?.toLocaleString('en-US', {
                    style: 'currency',
                    currency: draftOrder.data.draft_order.region?.currency_code || settings.data?.region?.currency_code,
                    currencyDisplay: 'narrowSymbol',
                  })}
                </Text>
              )}
            </View>
          )}
        </View>

        <View className="h-hairline bg-gray-200 my-4" />

        <View className="flex-row justify-between mb-6">
          <Text className="text-lg">Total</Text>
          {draftOrder.isFetching || isUpdatingDraftOrder > 0 ? (
            <View className="w-1/4 h-7 rounded-md bg-gray-200" />
          ) : (
            <Text className="text-lg">
              {draftOrder.data.draft_order.total?.toLocaleString('en-US', {
                style: 'currency',
                currency: draftOrder.data.draft_order.region?.currency_code || settings.data?.region?.currency_code,
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
              if (!draftOrder.data?.draft_order.id) {
                return;
              }

              router.push(`/checkout/${draftOrder.data.draft_order.id}`);
            }}
          >
            Checkout
          </Button>
        </View>
      </View>
    </Layout>
  );
}
