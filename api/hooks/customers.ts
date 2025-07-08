import { useMedusaSdk } from '@/contexts/auth';
import { AdminCustomerFilters, AdminCustomerListResponse } from '@medusajs/types';
import { InfiniteData, UndefinedInitialDataInfiniteOptions, useInfiniteQuery } from '@tanstack/react-query';

const PER_PAGE = 20;

export const useCustomers = (
  query?: Omit<AdminCustomerFilters, 'limit' | 'offset'>,
  limit = PER_PAGE,
  options?: Omit<
    UndefinedInitialDataInfiniteOptions<
      AdminCustomerListResponse,
      unknown,
      InfiniteData<AdminCustomerListResponse>,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'getPreviousPageParam'
  >,
) => {
  const sdk = useMedusaSdk();

  return useInfiniteQuery({
    queryKey: ['customers', JSON.stringify(query ?? {})],
    queryFn: async ({ pageParam = 1 }) => {
      return sdk.admin.customer.list({
        ...query,
        limit,
        offset: (pageParam - 1) * limit,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = (lastPage.offset + lastPage.limit) / limit + 1;
      return lastPage.count > lastPage.offset + lastPage.limit ? nextPage : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const prevPage = (firstPage.offset + firstPage.limit) / limit - 1;
      return prevPage >= 1 ? prevPage : undefined;
    },
    ...options,
  });
};
