import { useCreateCustomer, useCustomers } from '@/api/hooks/customers';
import { useUpdateDraftOrderCustomer } from '@/api/hooks/draft-orders';
import { Form } from '@/components/form/Form';
import { FormButton } from '@/components/form/FormButton';
import { TextField } from '@/components/form/TextField';
import { CircleAlert } from '@/components/icons/circle-alert';
import { Search } from '@/components/icons/search';
import { InfoBanner } from '@/components/InfoBanner';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { clx } from '@/utils/clx';
import { AdminCustomer } from '@medusajs/types';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod/v4';

const customerFormSchema = z.object({
  email: z.email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
});

const AddNewCustomerButton: React.FC<{ onNewCustomer: (customer: AdminCustomer) => void }> = ({ onNewCustomer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const createCustomer = useCreateCustomer();

  return (
    <>
      <Button
        variant="outline"
        onPress={() => {
          setIsOpen(true);
        }}
      >
        Add New Customer
      </Button>

      <Dialog
        open={isOpen}
        title="Add New Customer"
        onClose={() => setIsOpen(false)}
        dismissOnOverlayPress={true}
        animationType="fade"
        contentClassName="flex-shrink"
      >
        <Form
          schema={customerFormSchema}
          onSubmit={(data, form) => {
            createCustomer.mutate(data, {
              onSuccess: (res) => {
                onNewCustomer(res.customer);
                setIsOpen(false);
                form.reset();
              },
            });
          }}
        >
          <TextField
            name="email"
            placeholder="Email Address"
            autoComplete="off"
            autoCapitalize="none"
            inputMode="email"
          />
          <TextField name="first_name" placeholder="First Name" autoComplete="off" autoCapitalize="words" />
          <TextField name="last_name" placeholder="Last Name" autoComplete="off" autoCapitalize="words" />
          <TextField name="phone" placeholder="Phone Number" autoComplete="off" autoCapitalize="none" inputMode="tel" />
          <FormButton>Create Customer</FormButton>
        </Form>
      </Dialog>
    </>
  );
};

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
                    'text-gray-300': true,
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

    const customers = customersQuery.data?.pages.flatMap((page) => page.customers) || [];

    return customers.length > 0 ? customers : null;
  }, [customersQuery]);

  if (customersQuery.isError) {
    return <InfoBanner colorScheme="error">Error loading customers. Please try again.</InfoBanner>;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderCustomer}
      keyExtractor={(item) => item.id}
      refreshing={customersQuery.isRefetching}
      ItemSeparatorComponent={() => <View className="h-px bg-border mx-4" />}
      className="border overflow-hidden rounded-xl border-[#EDEDED]"
      ListEmptyComponent={
        <View className="py-10 px-4 justify-center items-center">
          <CircleAlert size={24} />
          {typeof q === 'string' && q.length > 1 ? (
            <Text className="text-center mt-1">No customers match{'\n'}the search</Text>
          ) : (
            <Text className="text-center mt-1">No customers found</Text>
          )}
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
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-[50%] text-gray-300" />
        <TextInput
          className="rounded-full py-3 pr-4 pl-10 text-base leading-5 border placeholder:text-gray-300 border-gray-200"
          placeholder="Search customers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          inputMode="search"
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
      <AddNewCustomerButton
        onNewCustomer={(customer) => {
          setSelectedCustomerId(customer.id);
          setSelectedCustomer(customer);
        }}
      />
    </Dialog>
  );
}
