import { useMedusaSdk } from '@/contexts/auth';
import { useSettings } from '@/contexts/settings';
import {
  AdminAddDraftOrderItems,
  AdminDraftOrderPreviewResponse,
} from '@medusajs/types';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';

const useGetOrSetDraftOrderId = () => {
  const sdk = useMedusaSdk();
  const settings = useSettings();

  return React.useCallback(async () => {
    const draftOrderId = await SecureStore.getItemAsync('draft_order_id');

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
      email: 'noreply+pos-guest@agilo.com',
    });

    await sdk.admin.draftOrder.beginEdit(newDraftOrder.draft_order.id);

    await SecureStore.setItemAsync(
      'draft_order_id',
      newDraftOrder.draft_order.id,
    );

    return newDraftOrder.draft_order.id;
  }, []);
};

export const useDraftOrder = () => {
  const sdk = useMedusaSdk();
  const getOrSetDraftOrderId = useGetOrSetDraftOrderId();

  return useQuery({
    queryKey: ['draft-order'],
    queryFn: async () => {
      const draftOrderId = await getOrSetDraftOrderId();
      return sdk.admin.draftOrder.retrieve(draftOrderId);
    },
  });
};

export const useAddToDraftOrder = (
  options?: Omit<
    UseMutationOptions<
      AdminDraftOrderPreviewResponse,
      Error,
      AdminAddDraftOrderItems,
      unknown
    >,
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
      return sdk.admin.draftOrder.addItems(draftOrderId, items);
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
