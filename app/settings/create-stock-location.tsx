import { KeyboardAvoidingView } from '@/components/KeyboardAvoidingView';
import { StockLocationCreateForm } from '@/components/StockLocationCreateForm';
import { Button } from '@/components/ui/Button';
import { LayoutWithScroll } from '@/components/ui/Layout';
import { useUpdateSettings } from '@/contexts/settings';
import { router } from 'expo-router';
import { Text } from 'react-native';

export default function CreateStockLocationScreen() {
  const updateSettings = useUpdateSettings();

  return (
    <LayoutWithScroll>
      <KeyboardAvoidingView className="flex-1">
        <Text className="mb-6 text-4xl">Setting Up</Text>
        <Text className="mb-2 text-2xl">Create a new stock location</Text>
        <Text className="mb-6 text-gray-300">
          Specify the details for the new stock location where inventory will be sourced.
        </Text>

        <StockLocationCreateForm
          onStockLocationCreated={(stockLocation) => {
            updateSettings.mutate(
              {
                stock_location_id: stockLocation.id,
              },
              {
                onSuccess: async () => {
                  router.dismissTo('/settings');
                },
              },
            );
          }}
        />

        <Button variant="outline" className="mt-4" onPress={() => router.back()}>
          Cancel
        </Button>
      </KeyboardAvoidingView>
    </LayoutWithScroll>
  );
}
