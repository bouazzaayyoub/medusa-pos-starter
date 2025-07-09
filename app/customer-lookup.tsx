import { useCustomers } from '@/api/hooks/customers';
import { useUpdateDraftOrderCustomer } from '@/api/hooks/draft-orders';
import { CircleAlert } from '@/components/icons/circle-alert';
import { Search } from '@/components/icons/search';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { clx } from '@/utils/clx';
import { AdminCustomer } from '@medusajs/types';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

const isPlaceholderProduct = (
  product: AdminCustomer | { id: `placeholder_${string}` },
): product is { id: `placeholder_${string}` } => {
  return typeof product.id === 'string' && product.id.startsWith('placeholder_');
};

const CustomerListPlaceholder: React.FC = () => {
  return (
    <View className="py-3 justify-between items-center flex-row px-4 gap-4">
      <View className="w-1/3 h-[17px] rounded-md bg-gray-200" />
      <View className="w-1/3 h-[17px] rounded-md bg-gray-200" />
    </View>
  );
};

const CustomersList: React.FC<{
  q?: string;
  selectedCustomerId?: string;
  onCustomerSelect: (customer: AdminCustomer) => void;
}> = ({ q, selectedCustomerId, onCustomerSelect }) => {
  const customersQuery = useCustomers({
    q,
    order: 'email',
  });

  const renderCustomer = React.useCallback(
    ({ item }: { item: AdminCustomer | { id: `placeholder_${string}` } }) => {
      if (isPlaceholderProduct(item)) {
        return <CustomerListPlaceholder />;
      }

      const customerName = [item.first_name, item.last_name].filter(Boolean).join(' ');

      return (
        <TouchableOpacity
          className={clx('py-3 justify-between items-center flex-row px-4 gap-4', {
            'bg-black': selectedCustomerId === item.id,
          })}
          onPress={() => onCustomerSelect(item)}
        >
          {customerName.length > 0 && (
            <Text
              className={clx({
                'text-white': selectedCustomerId === item.id,
              })}
            >
              {customerName}
            </Text>
          )}
          <Text
            className={clx(
              customerName.length > 0
                ? {
                    'text-[#b5b5b5]': true,
                    'text-gray-400': selectedCustomerId === item.id,
                  }
                : {
                    'text-white': selectedCustomerId === item.id,
                  },
            )}
          >
            {item.email}
          </Text>
        </TouchableOpacity>
      );
    },
    [onCustomerSelect, selectedCustomerId],
  );

  const data = React.useMemo(() => {
    if (customersQuery.isLoading) {
      return Array.from({ length: 8 }, (_, index) => ({
        id: `placeholder_${index + 1}` as const,
      }));
    }

    return customersQuery.data?.pages.flatMap((page) => page.customers) || [];
  }, [customersQuery]);

  return (
    <FlatList
      data={data}
      renderItem={renderCustomer}
      keyExtractor={(item) => item.id}
      // estimatedItemSize={70}
      refreshing={customersQuery.isRefetching}
      ItemSeparatorComponent={() => <View className="h-px bg-border mx-4" />}
      className="border overflow-hidden rounded-xl border-[#EDEDED]"
      ListEmptyComponent={
        <View className="flex-1 mt-60 items-center">
          <CircleAlert size={24} />
          <Text className="text-center text-xl mt-1">No customers match{'\n'}the search</Text>
        </View>
      }
      ListFooterComponent={
        customersQuery.isFetchingNextPage ? (
          <View>
            <CustomerListPlaceholder />
            <View className="h-px bg-border mx-4" />
            <CustomerListPlaceholder />
            <View className="h-px bg-border mx-4" />
            <CustomerListPlaceholder />
            <View className="h-px bg-border mx-4" />
            <CustomerListPlaceholder />
            <View className="h-px bg-border mx-4" />
            <CustomerListPlaceholder />
            <View className="h-px bg-border mx-4" />
            <CustomerListPlaceholder />
            <View className="h-px bg-border mx-4" />
            <CustomerListPlaceholder />
            <View className="h-px bg-border mx-4" />
            <CustomerListPlaceholder />
          </View>
        ) : null
      }
      onRefresh={() => {
        customersQuery.refetch();
      }}
      onEndReached={() => {
        if (customersQuery.hasNextPage && !customersQuery.isFetchingNextPage) {
          customersQuery.fetchNextPage();
        }
      }}
    />
  );
};

export default function CustomerLookupScreen() {
  const params = useLocalSearchParams<{
    customerId?: string;
  }>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | undefined>(params.customerId);
  const [selectedCustomer, setSelectedCustomer] = React.useState<AdminCustomer>();
  const updateDraftOrderCustomer = useUpdateDraftOrderCustomer();

  return (
    <Dialog
      open={true}
      title="Customer Lookup"
      onClose={() => router.back()}
      dismissOnOverlayPress={true}
      animationType="fade"
      contentClassName="flex-shrink"
    >
      <View className="mb-4 relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-[50%] text-gray" />
        <TextInput
          className="rounded-full pb-3 pt-2 pr-4 pl-10 text-base border placeholder:text-gray border-border"
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <CustomersList
        q={searchQuery ? searchQuery : undefined}
        selectedCustomerId={selectedCustomerId}
        onCustomerSelect={(customer) => {
          setSelectedCustomerId(customer.id);
          setSelectedCustomer(customer);
        }}
      />

      <Button
        className="mt-4 mb-4"
        disabled={!selectedCustomerId}
        onPress={() => {
          if (!selectedCustomerId) {
            return;
          }

          if (selectedCustomer) {
            updateDraftOrderCustomer.mutate(selectedCustomer);
          }

          router.back();
        }}
      >
        Select Customer
      </Button>
      <Button variant="outline">Add New Customer</Button>
    </Dialog>
  );
}
