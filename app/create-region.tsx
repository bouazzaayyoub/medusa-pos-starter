import { KeyboardAvoidingView } from '@/components/KeyboardAvoidingView';
import { RegionCreateForm } from '@/components/RegionCreateForm';
import { Button } from '@/components/ui/Button';
import { LayoutWithScroll } from '@/components/ui/Layout';
import { router } from 'expo-router';
import { Text } from 'react-native';

export default function CreateRegionScreen() {
  return (
    <LayoutWithScroll>
      <KeyboardAvoidingView className="flex-1">
        <Text className="text-4xl mb-6">Setting Up</Text>
        <Text className="text-2xl mb-2">Choose a region</Text>
        <Text className="mb-6 text-gray-300">
          Create a new region that defines your market area, currency, and tax settings.
        </Text>
        <RegionCreateForm onRegionCreated={() => {}} />
        <Button variant="outline" className="mt-4" onPress={() => router.back()}>
          Cancel
        </Button>
      </KeyboardAvoidingView>
    </LayoutWithScroll>
  );
}
