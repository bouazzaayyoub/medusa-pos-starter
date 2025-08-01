import { KeyboardAvoidingView } from '@/components/KeyboardAvoidingView';
import { RegionCreateForm } from '@/components/RegionCreateForm';
import { Button } from '@/components/ui/Button';
import { LayoutWithScroll } from '@/components/ui/Layout';
import { useUpdateSettings } from '@/contexts/settings';
import { router } from 'expo-router';
import { Text } from 'react-native';

export default function CreateRegionScreen() {
  const updateSettings = useUpdateSettings();

  return (
    <LayoutWithScroll>
      <KeyboardAvoidingView className="flex-1">
        <Text className="text-4xl mb-6">Setting Up</Text>
        <Text className="text-2xl mb-2">Create a region</Text>
        <Text className="mb-6 text-gray-300">
          Create a new region that defines your market area, currency, and tax settings.
        </Text>

        <RegionCreateForm
          onRegionCreated={(region) => {
            updateSettings.mutate(
              {
                region_id: region.id,
              },
              {
                onSuccess: async () => {
                  router.replace('/settings');
                },
              },
            );
          }}
        />

        <Button variant="outline" className="mt-4" onPress={() => router.replace('/settings/region')}>
          Cancel
        </Button>
      </KeyboardAvoidingView>
    </LayoutWithScroll>
  );
}
