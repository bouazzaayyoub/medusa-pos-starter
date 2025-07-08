import { useMedusaSdk } from '@/contexts/auth';
import { useSettings } from '@/contexts/settings';
import {
  AdminAddDraftOrderItems,
  AdminDraftOrderPreviewResponse,
  AdminUpdateDraftOrder,
  AdminUpdateDraftOrderItem,
} from '@medusajs/types';
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';

const DRAFT_ORDER_ID_STORAGE_KEY = 'draft_order_id';
export const DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL = 'noreply+pos-guest@agilo.com';

const useGetOrSetDraftOrderId = () => {
  const sdk = useMedusaSdk();
  const settings = useSettings();

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

    const newDraftOrder = await sdk.admin.draftOrder.create({
      region_id: settings.data?.region?.id,
      sales_channel_id: settings.data?.sales_channel?.id,
      email: DRAFT_ORDER_DEFAULT_CUSTOMER_EMAIL,
    });

    await SecureStore.setItemAsync(DRAFT_ORDER_ID_STORAGE_KEY, newDraftOrder.draft_order.id);

    return newDraftOrder.draft_order.id;
  }, [sdk, settings.data?.region?.id, settings.data?.sales_channel?.id]);
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
        fields: '+tax_total,+subtotal,+total,+items.variant.inventory_quantity,+customer.*',
      });
    },
  });
};

export const useCancelDraftOrder = (options?: Omit<UseMutationOptions<void>, 'mutationKey' | 'mutationFn'>) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['cancel-draft-order'],
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
      await queryClient.invalidateQueries({
        queryKey: ['draft-order'],
        exact: false,
      });

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
    mutationKey: ['add-to-draft-order'],
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
      await queryClient.invalidateQueries({
        queryKey: ['draft-order'],
        exact: false,
      });

      return options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateDraftOrderItem = (
  options?: Omit<
    UseMutationOptions<
      AdminDraftOrderPreviewResponse,
      Error,
      { id: string; update: AdminUpdateDraftOrderItem },
      unknown
    >,
    'mutationKey' | 'mutationFn'
  >,
) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();
  const getOrSetDraftOrderId = useGetOrSetDraftOrderId();

  return useMutation({
    mutationKey: ['update-draft-order-item'],
    mutationFn: async (item: { id: string; update: AdminUpdateDraftOrderItem }) => {
      const draftOrderId = await getOrSetDraftOrderId();
      await sdk.admin.draftOrder.beginEdit(draftOrderId);
      await sdk.admin.draftOrder.updateItem(draftOrderId, item.id, item.update).catch(async (error) => {
        await sdk.admin.draftOrder.cancelEdit(draftOrderId);
        throw error;
      });
      return sdk.admin.draftOrder.confirmEdit(draftOrderId);
    },
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: ['draft-order'],
        exact: false,
      });

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
    mutationKey: ['add-promotion'],
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
      await queryClient.invalidateQueries({
        queryKey: ['draft-order'],
        exact: false,
      });

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
    mutationKey: ['remove-promotion'],
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
      await queryClient.invalidateQueries({
        queryKey: ['draft-order'],
        exact: false,
      });

      return options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateDraftOrder = (
  options?: Omit<
    UseMutationOptions<AdminDraftOrderPreviewResponse, Error, AdminUpdateDraftOrder, unknown>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  const sdk = useMedusaSdk();
  const queryClient = useQueryClient();
  const getOrSetDraftOrderId = useGetOrSetDraftOrderId();

  return useMutation({
    mutationKey: ['update-draft-order'],
    mutationFn: async (data: AdminUpdateDraftOrder) => {
      const draftOrderId = await getOrSetDraftOrderId();
      await sdk.admin.draftOrder.beginEdit(draftOrderId);
      await sdk.admin.draftOrder.update(draftOrderId, data).catch(async (error) => {
        await sdk.admin.draftOrder.cancelEdit(draftOrderId);
        throw error;
      });
      return sdk.admin.draftOrder.confirmEdit(draftOrderId);
    },
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: ['draft-order'],
        exact: false,
      });

      return options?.onSuccess?.(...args);
    },
  });
};
