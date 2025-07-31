import { KeyboardAvoidingView } from '@/components/KeyboardAvoidingView';
import { SalesChannelCreateForm } from '@/components/SalesChannelCreateForm';
import { Button } from '@/components/ui/Button';
import { LayoutWithScroll } from '@/components/ui/Layout';
import { router } from 'expo-router';
import { Text } from 'react-native';

export default function CreateSalesChannelScreen() {
  return (
    <LayoutWithScroll>
      <KeyboardAvoidingView className="flex-1">
        <Text className="text-4xl mb-6">Setting Up</Text>
        <Text className="text-2xl mb-2">Choose a sales channel</Text>
        <Text className="mb-6 text-gray-300">
          Select an existing sales channel from the list or create a new one to proceed.
        </Text>

        <SalesChannelCreateForm onSalesChannelCreated={() => {}} />

        <Button variant="outline" className="mt-4" onPress={() => router.back()}>
          Cancel
        </Button>
      </KeyboardAvoidingView>
    </LayoutWithScroll>
  );
}
