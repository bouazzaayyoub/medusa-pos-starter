import { useMedusaSdk } from '@/contexts/auth';
import { useSettings } from '@/contexts/settings';
import {
  AdminAddDraftOrderItems,
  AdminCustomer,
  AdminDraftOrderPreviewResponse,
  AdminDraftOrderResponse,
  AdminUpdateDraftOrderItem,
} from '@medusajs/types';
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';

const DRAFT_ORDER_ID_STORAGE_KEY = 'draft_order_id';
export const DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL = 'noreply+pos-guest@agilo.com';

const useGetOrSetDefaultCustomer = () => {
  const sdk = useMedusaSdk();

  return React.useCallback(async () => {
    const existingCustomer = await sdk.admin.customer.list({
      email: DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL,
      fields: 'id',
      limit: 1,
    });

    if (existingCustomer.customers.length > 0) {
      return existingCustomer.customers[0].id;
    }

    const newCustomer = await sdk.admin.customer.create(
      {
        email: DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL,
      },
      {
        fields: 'id',
      },
    );

    return newCustomer.customer.id;
  }, [sdk]);
};

const useGetOrSetDraftOrderId = () => {
  const sdk = useMedusaSdk();
  const settings = useSettings();
  const getOrSetDefaultCustomer = useGetOrSetDefaultCustomer();

  return React.useCallback(async () => {
    const draftOrderId = await SecureStore.getItemAsync(DRAFT_ORDER_ID_STORAGE_KEY);

    if (draftOrderId) {
      return draftOrderId;
    }

    if (!settings.data?.region?.id) {
      throw new Error('Region ID is not set in settings');
    }

    if (!settings.data?.sales_channel?.id) {
      throw new Error('Sales Channel ID is not set in settings');
    }

    const defaultCustomerId = await getOrSetDefaultCustomer();

    const newDraftOrder = await sdk.admin.draftOrder.create({
      region_id: settings.data?.region?.id,
      sales_channel_id: settings.data?.sales_channel?.id,
      customer_id: defaultCustomerId,
    });

    await SecureStore.setItemAsync(DRAFT_ORDER_ID_STORAGE_KEY, newDraftOrder.draft_order.id);

    return newDraftOrder.draft_order.id;
  }, [getOrSetDefaultCustomer, sdk, settings.data?.region?.id, settings.data?.sales_channel?.id]);
};

export const useDraftOrder = () => {
  const sdk = useMedusaSdk();

  return useQuery({
    queryKey: ['draft-order'],
    queryFn: async () => {
      const draftOrderId = await SecureStore.getItemAsync(DRAFT_ORDER_ID_STORAGE_KEY);

      if (!draftOrderId) {
        return null;
      }

      return sdk.admin.draftOrder.retrieve(draftOrderId, {
        fields:
          '+tax_total,+subtotal,+total,+items.variant.options.*,+items.variant.options.option.*,+items.variant.inventory_quantity,+customer.*',
      });
    },
  });
};

export const useCancelDraftOrder = (options?: Omit<UseMutationOptions<void>, 'mutationKey' | 'mutationFn'>) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['draft-order', 'cancel'],
    mutationFn: async () => {
      const draftOrderId = await SecureStore.getItemAsync(DRAFT_ORDER_ID_STORAGE_KEY);
      if (!draftOrderId) {
        throw new Error('Draft order ID not found');
      }

      await sdk.admin.draftOrder.delete(draftOrderId);
      await SecureStore.deleteItemAsync(DRAFT_ORDER_ID_STORAGE_KEY);
    },
    ...options,
    onSuccess: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSuccess?.(...args);
    },
  });
};

export const useAddToDraftOrder = (
  options?: Omit<
    UseMutationOptions<AdminDraftOrderPreviewResponse, Error, AdminAddDraftOrderItems, unknown>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();
  const getOrSetDraftOrderId = useGetOrSetDraftOrderId();

  return useMutation({
    mutationKey: ['draft-order', 'items', 'add'],
    mutationFn: async (items: AdminAddDraftOrderItems) => {
      const draftOrderId = await getOrSetDraftOrderId();
      await sdk.admin.draftOrder.beginEdit(draftOrderId);
      await sdk.admin.draftOrder.addItems(draftOrderId, items).catch(async (error) => {
        await sdk.admin.draftOrder.cancelEdit(draftOrderId);
        throw error;
      });
      return sdk.admin.draftOrder.confirmEdit(draftOrderId);
    },
    ...options,
    onSuccess: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSuccess?.(...args);
    },
  });
};

const updateDraftOrderItemActions = new Map<
  string,
  {
    update: Pick<AdminUpdateDraftOrderItem, 'quantity'>;
    resolvers: ((value: AdminDraftOrderPreviewResponse) => void)[];
    rejecters: ((reason: unknown) => void)[];
  }
>();

const debounceTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export const useUpdateDraftOrderItem = (
  options?: Omit<
    UseMutationOptions<
      AdminDraftOrderPreviewResponse,
      Error,
      { id: string; update: Pick<AdminUpdateDraftOrderItem, 'quantity'> },
      unknown
    >,
    'mutationKey' | 'mutationFn'
  >,
) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();
  const getOrSetDraftOrderId = useGetOrSetDraftOrderId();

  return useMutation({
    mutationKey: ['draft-order', 'items', 'update'],
    mutationFn: async (item: { id: string; update: Pick<AdminUpdateDraftOrderItem, 'quantity'> }) => {
      return new Promise<AdminDraftOrderPreviewResponse>((resolve, reject) => {
        if (debounceTimeouts.has(item.id)) {
          clearTimeout(debounceTimeouts.get(item.id)!);
          debounceTimeouts.delete(item.id);
        }

        const existingItem = updateDraftOrderItemActions.get(item.id);
        if (existingItem) {
          existingItem.update.quantity = item.update.quantity;
          existingItem.resolvers.push(resolve);
          existingItem.rejecters.push(reject);
        } else {
          updateDraftOrderItemActions.set(item.id, {
            update: item.update,
            resolvers: [resolve],
            rejecters: [reject],
          });
        }

        debounceTimeouts.set(
          item.id,
          setTimeout(async () => {
            debounceTimeouts.delete(item.id);
            const queueItem = updateDraftOrderItemActions.get(item.id);

            if (!queueItem) {
              throw new Error(`Item with ID ${item.id} not found in update queue`);
            }

            updateDraftOrderItemActions.delete(item.id);

            try {
              const draftOrderId = await getOrSetDraftOrderId();
              await sdk.admin.draftOrder.beginEdit(draftOrderId);

              await sdk.admin.draftOrder.updateItem(draftOrderId, item.id, queueItem.update).catch(async (error) => {
                await sdk.admin.draftOrder.cancelEdit(draftOrderId);
                throw error;
              });
              const result = await sdk.admin.draftOrder.confirmEdit(draftOrderId);

              queueItem.resolvers.forEach((resolveFn) => resolveFn(result));
            } catch (error) {
              queueItem.rejecters.forEach((rejectFn) => rejectFn(error));
            }
          }, 300),
        );
      });
    },
    ...options,
    onMutate(variables) {
      options?.onMutate?.(variables);

      queryClient.cancelQueries({
        queryKey: ['draft-order'],
        exact: false,
      });

      const cachedDraftOrder = queryClient.getQueryData<AdminDraftOrderResponse>(['draft-order']);
      if (cachedDraftOrder) {
        const updatedDraftOrder: AdminDraftOrderResponse = {
          ...cachedDraftOrder,
          draft_order: {
            ...cachedDraftOrder.draft_order,
            items:
              variables.update.quantity === 0
                ? cachedDraftOrder.draft_order.items.filter((item) => item.id !== variables.id)
                : cachedDraftOrder.draft_order.items.map((item) =>
                    item.id === variables.id
                      ? {
                          ...item,
                          ...variables.update,
                        }
                      : item,
                  ),
          },
        };

        queryClient.setQueryData(['draft-order'], updatedDraftOrder);

        return { previousDraftOrder: cachedDraftOrder };
      }

      return { previousDraftOrder: undefined };
    },
    onError: (error, variables, context) => {
      if (context?.previousDraftOrder) {
        queryClient.setQueryData(['draft-order'], context.previousDraftOrder);
      }

      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onError?.(error, variables, context);
    },
    onSuccess: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSuccess?.(...args);
    },
  });
};

export const useAddPromotion = (
  options?: Omit<
    UseMutationOptions<AdminDraftOrderPreviewResponse, Error, string, unknown>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();
  const getOrSetDraftOrderId = useGetOrSetDraftOrderId();

  return useMutation({
    mutationKey: ['draft-order', 'promotions', 'add'],
    mutationFn: async (promotionCode: string) => {
      const draftOrderId = await getOrSetDraftOrderId();
      await sdk.admin.draftOrder.beginEdit(draftOrderId);
      await sdk.admin.draftOrder
        .addPromotions(draftOrderId, {
          promo_codes: [promotionCode],
        })
        .catch(async (error) => {
          await sdk.admin.draftOrder.cancelEdit(draftOrderId);
          throw error;
        });
      return sdk.admin.draftOrder.confirmEdit(draftOrderId);
    },
    ...options,
    onSuccess: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSuccess?.(...args);
    },
  });
};

export const useRemovePromotion = (
  options?: Omit<
    UseMutationOptions<AdminDraftOrderPreviewResponse, Error, string, unknown>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();
  const getOrSetDraftOrderId = useGetOrSetDraftOrderId();

  return useMutation({
    mutationKey: ['draft-order', 'promotions', 'remove'],
    mutationFn: async (promotionCode: string) => {
      const draftOrderId = await getOrSetDraftOrderId();
      await sdk.admin.draftOrder.beginEdit(draftOrderId);
      await sdk.admin.draftOrder
        .removePromotions(draftOrderId, {
          promo_codes: [promotionCode],
        })
        .catch(async (error) => {
          await sdk.admin.draftOrder.cancelEdit(draftOrderId);
          throw error;
        });
      return sdk.admin.draftOrder.confirmEdit(draftOrderId);
    },
    ...options,
    onSuccess: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateDraftOrderCustomer = (
  options?: Omit<
    UseMutationOptions<AdminDraftOrderPreviewResponse, Error, AdminCustomer | undefined, unknown>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();
  const getOrSetDraftOrderId = useGetOrSetDraftOrderId();

  return useMutation({
    mutationKey: ['draft-order', 'customer', 'update'],
    mutationFn: async (data) => {
      const draftOrderId = await getOrSetDraftOrderId();
      await sdk.admin.draftOrder.beginEdit(draftOrderId);
      await sdk.admin.draftOrder.update(draftOrderId, { customer_id: data?.id }).catch(async (error) => {
        await sdk.admin.draftOrder.cancelEdit(draftOrderId);
        throw error;
      });
      return sdk.admin.draftOrder.confirmEdit(draftOrderId);
    },
    ...options,
    onMutate(data) {
      options?.onMutate?.(data);

      const cachedDraftOrder = queryClient.getQueryData<AdminDraftOrderResponse>(['draft-order']);

      if (cachedDraftOrder) {
        const updatedDraftOrder: AdminDraftOrderResponse = {
          ...cachedDraftOrder,
          draft_order: {
            ...cachedDraftOrder.draft_order,
            customer_id: data?.id ?? null,
            customer: data,
          },
        };

        queryClient.setQueryData(['draft-order'], updatedDraftOrder);

        return { previousDraftOrder: cachedDraftOrder };
      }

      return { previousDraftOrder: undefined };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(['draft-order'], context?.previousDraftOrder);
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }
      return options?.onError?.(error, variables, context);
    },
    onSuccess: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSuccess?.(...args);
    },
  });
};
