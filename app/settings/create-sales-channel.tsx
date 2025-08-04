import { KeyboardAvoidingView } from '@/components/KeyboardAvoidingView';
import { SalesChannelCreateForm } from '@/components/SalesChannelCreateForm';
import { Button } from '@/components/ui/Button';
import { LayoutWithScroll } from '@/components/ui/Layout';
import { useUpdateSettings } from '@/contexts/settings';
import { router } from 'expo-router';
import { Text } from 'react-native';

export default function CreateSalesChannelScreen() {
  const updateSettings = useUpdateSettings();

  return (
    <LayoutWithScroll>
      <KeyboardAvoidingView className="flex-1">
        <Text className="mb-6 text-4xl">Setting Up</Text>
        <Text className="mb-2 text-2xl">Create a sales channel</Text>
        <Text className="mb-6 text-gray-300">Enter the details below to create a new sales channel.</Text>

        <SalesChannelCreateForm
          onSalesChannelCreated={(salesChannel) => {
            updateSettings.mutate(
              {
                sales_channel_id: salesChannel.id,
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
