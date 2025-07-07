import {
  useAddPromotion,
  useCancelDraftOrder,
  useDraftOrder,
  useUpdateDraftOrderItem,
} from '@/api/hooks/draft-orders';
import Form from '@/components/form/Form';
import FormButton from '@/components/form/FormButton';
import TextField from '@/components/form/TextField';
import { Button } from '@/components/ui/Button';
import QuantityPicker from '@/components/ui/QuantityPicker';
import { useSettings } from '@/contexts/settings';
import { AdminOrderLineItem } from '@medusajs/types';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod/v4';

const addPromotionFormSchema = z.object({
  promotionCode: z.string().min(1, 'Promotion code is required'),
});

const DraftOrderItem: React.FC<{ item: AdminOrderLineItem }> = ({ item }) => {
  const settings = useSettings();
  const draftOrder = useDraftOrder();
  const updateDraftOrderItem = useUpdateDraftOrderItem();
  const thumbnail =
    item.thumbnail || item.product?.thumbnail || item.product?.images?.[0]?.url;

  return (
    <View className="flex-row gap-4">
      <View className="h-[5.25rem] w-[5.25rem] rounded-xl bg-border overflow-hidden">
        {thumbnail && (
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full object-cover"
          />
        )}
      </View>
      <View>
        <Text className="font-medium mb-2">{item.product_title}</Text>
        {item.variant &&
          item.variant.options &&
          item.variant.options.length > 0 && (
            <View className="flex-row items-center mb-2 gap-4">
              {item.variant.options.map((option) => (
                <View className="flex-row" key={option.id}>
                  <Text className="text-gray-dark text-sm">
                    {option.option?.title || option.option_id}:
                  </Text>
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
          isPending={updateDraftOrderItem.isPending}
        />
      </View>
      <Text className="font-medium ml-auto">
        {item.unit_price.toLocaleString('en-US', {
          style: 'currency',
          currency:
            draftOrder.data?.draft_order.region?.currency_code ||
            settings.data?.region?.currency_code,
          currencyDisplay: 'narrowSymbol',
        })}
      </Text>
    </View>
  );
};

export default function CartScreen() {
  const settings = useSettings();
  const draftOrder = useDraftOrder();
  const addPromotion = useAddPromotion();
  const cancelDraftOrder = useCancelDraftOrder();
  const bottomTabBarHeight = useBottomTabBarHeight();

  const renderItem = React.useCallback<ListRenderItem<AdminOrderLineItem>>(
    ({ item }) => <DraftOrderItem item={item} />,
    [],
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
      <SafeAreaView
        className="relative flex-1 px-4 bg-white"
        style={{ paddingBottom: bottomTabBarHeight }}
      >
        <View className="py-4">
          <Text className="text-black text-[40px] font-semibold">Cart</Text>
        </View>
        <View className="items-center justify-center flex-grow">
          <Text className="text-gray-dark">Your cart is empty.</Text>
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

  return (
    <SafeAreaView className="relative flex-1 px-4 bg-white">
      <View className="py-4">
        <Text className="text-black text-[40px] font-semibold">Cart</Text>
      </View>

      <FlashList
        data={draftOrder.data?.draft_order.items || []}
        contentContainerClassName="mt-4"
        estimatedItemSize={86}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-px bg-border my-6" />}
      />

      <View className="mt-6 mb-20">
        <Form
          schema={addPromotionFormSchema}
          onSubmit={(data, form) => {
            console.log('Submitting promotion code:', data);
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
          />
          <FormButton
            size="sm"
            className="flex-1 h-[3.125rem]"
            isPending={addPromotion.isPending}
          >
            Submit
          </FormButton>
        </Form>
        <View className="flex-row mb-2 justify-between">
          <Text className="text-gray-dark">Taxes</Text>
          <Text className="text-gray-dark">
            {draftOrder.data?.draft_order.tax_total?.toLocaleString('en-US', {
              style: 'currency',
              currency:
                draftOrder.data?.draft_order.region?.currency_code ||
                settings.data?.region?.currency_code,
              currencyDisplay: 'narrowSymbol',
            })}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-dark">Subtotal</Text>
          <Text className="text-gray-dark">
            {draftOrder.data?.draft_order.subtotal?.toLocaleString('en-US', {
              style: 'currency',
              currency:
                draftOrder.data?.draft_order.region?.currency_code ||
                settings.data?.region?.currency_code,
              currencyDisplay: 'narrowSymbol',
            })}
          </Text>
        </View>

        <View className="h-px bg-border my-4" />

        <View className="flex-row justify-between mb-6">
          <Text className="font-medium text-lg">Total</Text>
          <Text className="font-medium text-lg">
            {draftOrder.data?.draft_order.total?.toLocaleString('en-US', {
              style: 'currency',
              currency:
                draftOrder.data?.draft_order.region?.currency_code ||
                settings.data?.region?.currency_code,
              currencyDisplay: 'narrowSymbol',
            })}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => {
              Alert.alert(
                'Cancel Cart',
                'Are you sure you want to cancel the cart?',
                [
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
                ],
              );
            }}
            isPending={cancelDraftOrder.isPending}
          >
            Cancel Cart
          </Button>
          <Button
            className="flex-1"
            disabled={
              cancelDraftOrder.isPending ||
              draftOrder.data.draft_order.items.length === 0
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
