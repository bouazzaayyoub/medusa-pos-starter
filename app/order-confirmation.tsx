import { InfoBanner } from '@/components/InfoBanner';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { router } from 'expo-router';
import React from 'react';

export default function OrderConfirmationScreen() {
  return (
    <Dialog
      open={true}
      title="Order confirmed!"
      onClose={() => router.back()}
      dismissOnOverlayPress={false}
      showCloseButton={false}
      animationType="fade"
      contentClassName="flex-shrink"
    >
      <InfoBanner colorScheme="success" showIcon={false} className="mb-4">
        Your order has been placed successfully. You can track your order status in My Orders.
      </InfoBanner>

      <Button size="lg" className="mb-2">
        View Order
      </Button>
      <Button size="lg" variant="outline">
        Back to shop
      </Button>
    </Dialog>
  );
}
