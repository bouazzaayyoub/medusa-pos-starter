import { Dialog } from '@/components/ui/Dialog';
import { router } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function CustomerLookupScreen() {
  return (
    <Dialog
      open={true}
      title="Customer Lookup"
      onClose={() => router.back()}
      dismissOnOverlayPress={true}
      animationType="fade"
    >
      <Text>Customer lookup...</Text>
    </Dialog>
  );
}
