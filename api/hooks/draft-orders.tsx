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

export const useDraftOrderOrOrder = (draftOrderId: string) => {
  const sdk = useMedusaSdk();

  return useQuery({
    queryKey: ['draft-order', draftOrderId],
    queryFn: async () => {
      return sdk.admin.draftOrder
        .retrieve(draftOrderId, {
          fields:
            '+tax_total,+discount_total,+subtotal,+total,+items.variant.options.*,+items.variant.options.option.*,+items.variant.inventory_quantity,+customer.*',
        })
        .then((res) => res.draft_order)
        .catch(async () => {
          const res = await sdk.admin.order.retrieve(draftOrderId, {
            fields:
              '+tax_total,+discount_total,+subtotal,+total,+items.variant.options.*,+items.variant.options.option.*,+items.variant.inventory_quantity,+customer.*',
          });
          return res.order;
        });
    },
    enabled: !!draftOrderId,
  });
};

export const useCurrentDraftOrder = () => {
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
          '+tax_total,+discount_total,+subtotal,+total,+items.variant.options.*,+items.variant.options.option.*,+items.variant.inventory_quantity,+customer.*',
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
    onSettled: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSettled?.(...args);
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
    onSettled: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSettled?.(...args);
    },
  });
};

const updateChains = new Map<
  string,
  {
    promise: Promise<void>;
    abortController: AbortController;
  }
>();
const debounceTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

class UpdateDraftOrderItemAborted extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpdateDraftOrderItemAborted';
  }
}

export const useUpdateDraftOrderItem = (
  options?: Omit<
    UseMutationOptions<void, Error, { id: string; update: Pick<AdminUpdateDraftOrderItem, 'quantity'> }, unknown>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();
  const getOrSetDraftOrderId = useGetOrSetDraftOrderId();

  return useMutation({
    mutationKey: ['draft-order', 'items', 'update'],
    mutationFn: async (item: { id: string; update: Pick<AdminUpdateDraftOrderItem, 'quantity'> }) => {
      // Clear existing timeout for this item
      if (debounceTimeouts.has(item.id)) {
        clearTimeout(debounceTimeouts.get(item.id)!);
        debounceTimeouts.delete(item.id);
      }

      // Cancel any existing update for this item
      const existingChain = updateChains.get(item.id);
      if (existingChain) {
        existingChain.abortController.abort();
      }

      // Create new abort controller for this update
      const abortController = new AbortController();

      // Create a new promise that chains after the existing one (if any)
      const previousPromise = existingChain?.promise ?? Promise.resolve();

      const updatePromise = previousPromise
        .catch(() => {
          // Ignore errors from previous updates in the chain
        })
        .then(async () => {
          // Wait for debounce period
          await new Promise<void>((debounceResolve) => {
            const timeoutId = setTimeout(() => {
              debounceTimeouts.delete(item.id);
              debounceResolve();
            }, 300);

            debounceTimeouts.set(item.id, timeoutId);

            // Handle abortion during debounce
            if (abortController.signal.aborted) {
              clearTimeout(timeoutId);
              debounceTimeouts.delete(item.id);
              throw new UpdateDraftOrderItemAborted(
                `Update for item ${item.id} with ${item.update.quantity} quantity aborted`,
              );
            }

            abortController.signal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              debounceTimeouts.delete(item.id);
              debounceResolve(); // Resolve to allow chain to continue
            });
          });

          // Check if aborted after debounce
          if (abortController.signal.aborted) {
            throw new UpdateDraftOrderItemAborted(
              `Update for item ${item.id} with ${item.update.quantity} quantity aborted`,
            );
          }

          // Perform the actual update
          const draftOrderId = await getOrSetDraftOrderId();
          await sdk.admin.draftOrder.beginEdit(draftOrderId);

          try {
            await sdk.admin.draftOrder.updateItem(draftOrderId, item.id, item.update);
            await sdk.admin.draftOrder.confirmEdit(draftOrderId);
          } catch (error) {
            await sdk.admin.draftOrder.cancelEdit(draftOrderId);
            throw error;
          }
        })
        .catch((error) => {
          // Only reject if not aborted (aborted updates should resolve silently)
          if (!(error instanceof UpdateDraftOrderItemAborted)) {
            throw error;
          }
        })
        .finally(() => {
          // Clean up chain if this was the latest update
          const currentChain = updateChains.get(item.id);
          if (currentChain?.abortController === abortController) {
            updateChains.delete(item.id);
          }
        });

      // Store the new chain
      updateChains.set(item.id, {
        promise: updatePromise,
        abortController,
      });

      return updatePromise;
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

      return options?.onError?.(error, variables, context);
    },
    onSettled: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSettled?.(...args);
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
    onSettled: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSettled?.(...args);
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
    onSettled: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSettled?.(...args);
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
      await sdk.admin.draftOrder
        .update(draftOrderId, { customer_id: data?.id, email: data?.email })
        .catch(async (error) => {
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
            email: data?.email ?? null,
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
    onSettled: async (...args) => {
      if (queryClient.isMutating({ mutationKey: ['draft-order'], exact: false }) === 1) {
        await queryClient.invalidateQueries({
          queryKey: ['draft-order'],
          exact: false,
        });
      }

      return options?.onSettled?.(...args);
    },
  });
};

export const useCompleteDraftOrder = (
  draftOrderId: string,
  options?: Omit<UseMutationOptions<void, Error, void, unknown>, 'mutationKey' | 'mutationFn'>,
) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();
  const settings = useSettings();

  return useMutation({
    mutationKey: ['draft-order', draftOrderId, 'complete'],
    mutationFn: async () => {
      if (!draftOrderId) {
        throw new Error('Draft order ID is required to complete the order');
      }

      const { draft_order } = await sdk.admin.draftOrder.retrieve(draftOrderId, {
        fields:
          '+tax_total,+discount_total,+subtotal,+total,+items.variant.options.*,+items.variant.options.option.*,+items.variant.inventory_quantity,+customer.*,+customer.addresses.*',
      });

      const stockLocation = settings.data?.stock_location;
      const billingAddress =
        draft_order.customer?.addresses.find(
          (address) => address.is_default_billing || address.id === draft_order.customer?.default_billing_address_id,
        ) || draft_order.customer?.addresses[0];

      await sdk.admin.draftOrder.beginEdit(draftOrderId);
      await sdk.admin.draftOrder.update(draftOrderId, {
        billing_address: billingAddress
          ? {
              first_name: billingAddress.first_name ?? undefined,
              last_name: billingAddress.last_name ?? undefined,
              company: billingAddress.company ?? undefined,
              address_1: billingAddress.address_1 ?? undefined,
              address_2: billingAddress.address_2 ?? undefined,
              postal_code: billingAddress.postal_code ?? undefined,
              city: billingAddress.city ?? undefined,
              province: billingAddress.province ?? undefined,
              country_code: billingAddress.country_code ?? undefined,
              phone: billingAddress.phone ?? undefined,
            }
          : undefined,
        shipping_address: stockLocation
          ? {
              company: stockLocation.name,
              address_1: stockLocation.address?.address_1 ?? undefined,
              address_2: stockLocation.address?.address_2 ?? undefined,
              postal_code: stockLocation.address?.postal_code ?? undefined,
              city: stockLocation.address?.city ?? undefined,
              province: stockLocation.address?.province ?? undefined,
              country_code: stockLocation.address?.country_code ?? undefined,
              phone: stockLocation.address?.phone ?? undefined,
            }
          : undefined,
      });
      await sdk.admin.draftOrder.confirmEdit(draftOrderId);

      await sdk.admin.draftOrder.convertToOrder(draftOrderId);
      await sdk.client.fetch(`/admin/orders/${draftOrderId}/complete`, {
        method: 'POST',
      });
      await SecureStore.deleteItemAsync(DRAFT_ORDER_ID_STORAGE_KEY);
    },
    ...options,
    onSettled: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: ['draft-order'],
        exact: false,
      });

      return options?.onSettled?.(...args);
    },
  });
};

export const useDraftOrderPromotions = (codes: string[]) => {
  const sdk = useMedusaSdk();

  return useQuery({
    queryKey: ['promotions', ...codes],
    queryFn: async () => {
      return sdk.admin.promotion.list({
        code: codes,
        limit: codes.length,
      });
    },
    enabled: codes.length > 0,
  });
};
