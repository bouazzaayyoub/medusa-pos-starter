import Medusa from '@medusajs/js-sdk';
import {
  DefaultError,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { useAuthCtx } from './auth';

export type SettingsStateType = {
  sales_channel_id: string;
  stock_location_id: string;
  region_id: string;
};

export const useSettings = () => {
  const { state } = useAuthCtx();

  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      if (state.status !== 'authenticated') {
        return null;
      }

      const sdk = new Medusa({
        baseUrl: state.medusaUrl,
        debug: true,
        auth: {
          type: 'jwt',
          jwtTokenStorageMethod: 'custom',
          storage: {
            getItem: () => state.apiKey,
            setItem: () => {},
            removeItem: () => {},
          },
        },
      });

      const sales_channel_id = await SecureStore.getItemAsync(
        'sales_channel_id',
      );
      const stock_location_id = await SecureStore.getItemAsync(
        'stock_location_id',
      );
      const region_id = await SecureStore.getItemAsync('region_id');

      if (!sales_channel_id && !stock_location_id && !region_id) {
        return null;
      }

      const sales_channel_response = sales_channel_id
        ? await sdk.admin.salesChannel
            .retrieve(sales_channel_id)
            .catch((error) => {
              console.error(error);
              return undefined;
            })
        : undefined;
      const stock_location_response = stock_location_id
        ? await sdk.admin.stockLocation
            .retrieve(stock_location_id)
            .catch((error) => {
              console.error(error);
              return undefined;
            })
        : undefined;
      const region_response = region_id
        ? await sdk.admin.region.retrieve(region_id).catch((error) => {
            console.error(error);
            return undefined;
          })
        : undefined;

      return {
        sales_channel: sales_channel_response?.sales_channel,
        stock_location: stock_location_response?.stock_location,
        region: region_response?.region,
      };
    },
    enabled: state.status === 'authenticated',
  });
};

export const useUpdateSettings = (
  options?: Omit<
    UseMutationOptions<SettingsStateType, DefaultError, SettingsStateType>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ['update-settings'],
    mutationFn: async (settings) => {
      await SecureStore.setItemAsync(
        'sales_channel_id',
        settings.sales_channel_id,
      );
      await SecureStore.setItemAsync(
        'stock_location_id',
        settings.stock_location_id,
      );
      await SecureStore.setItemAsync('region_id', settings.region_id);
      return settings;
    },
    ...options,
    onSuccess: async (...args) => {
      await client.invalidateQueries({
        queryKey: ['settings'],
      });

      if (options?.onSuccess) {
        return options.onSuccess(...args);
      }
    },
  });
};

export const useClearSettings = () => {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ['clear-settings'],
    mutationFn: async () => {
      await SecureStore.deleteItemAsync('sales_channel_id');
      await SecureStore.deleteItemAsync('stock_location_id');
      await SecureStore.deleteItemAsync('region_id');
      return null;
    },
    onSuccess: async () => {
      await client.invalidateQueries({
        queryKey: ['settings'],
      });
    },
  });
};
