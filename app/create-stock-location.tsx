import { KeyboardAvoidingView } from '@/components/KeyboardAvoidingView';
import { StockLocationCreateForm } from '@/components/StockLocationCreateForm';
import { Button } from '@/components/ui/Button';
import { LayoutWithScroll } from '@/components/ui/Layout';
import { router } from 'expo-router';
import { Text } from 'react-native';

export default function CreateStockLocationScreen() {
  return (
    <LayoutWithScroll>
      <KeyboardAvoidingView className="flex-1">
        <Text className="text-4xl mb-6">Setting Up</Text>
        <Text className="text-2xl mb-2">Create a new stock location</Text>
        <Text className="mb-6 text-gray-300">
          Select where inventory will be sourced from, or add a new location if needed.
        </Text>

        <StockLocationCreateForm onStockLocationCreated={() => {}} />

        <Button variant="outline" className="mt-4" onPress={() => router.back()}>
          Cancel
        </Button>
      </KeyboardAvoidingView>
    </LayoutWithScroll>
  );
}
