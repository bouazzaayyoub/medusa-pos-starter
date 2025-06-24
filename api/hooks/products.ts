import { useMedusaSdk } from '@/contexts/auth';
import { AdminProductListParams } from '@medusajs/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

const PER_PAGE = 20;

export const useProducts = (
  query?: Omit<AdminProductListParams, 'limit' | 'offset'>,
) => {
  const sdk = useMedusaSdk();

  return useInfiniteQuery({
    queryKey: ['products', query],
    queryFn: async ({ pageParam = 1 }) => {
      return sdk.admin.product.list({
        ...query,
        limit: PER_PAGE,
        offset: (pageParam - 1) * PER_PAGE,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.offset / PER_PAGE + 1;
      return lastPage.count > lastPage.offset + lastPage.limit
        ? nextPage
        : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const prevPage = firstPage.offset / PER_PAGE - 1;
      return prevPage >= 1 ? prevPage : undefined;
    },
  });
};

export const useProduct = (productId: string) => {
  const sdk = useMedusaSdk();

  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      return sdk.admin.product.retrieve(productId);
    },
    enabled: !!productId,
  });
};
