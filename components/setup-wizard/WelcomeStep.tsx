import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import React from 'react';
import { View } from 'react-native';

interface WelcomeStepProps {
  onComplete: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onComplete }) => {
  return (
    <View className="flex-1 p-5">
      <Text className="text-4xl mb-6">Welcome</Text>
      <Text className="text-2xl mb-2">You&apos;re all set to start selling</Text>
      <Text className="mb-6 text-gray-600">
        Your Point of Sale system is now configured and ready to use. You can start managing your sales, products, and
        customers right away.
      </Text>

      <Text className="mb-4 text-gray-600">Here are some things you can do next:</Text>
      <Text className="mb-2 text-gray-600">• Browse products and add them to cart</Text>
      <Text className="mb-2 text-gray-600">• Process customer orders</Text>
      <Text className="mb-2 text-gray-600">• Scan barcodes for quick adding to cart</Text>
      <Text className="mb-6 text-gray-600">• Track sales and inventory</Text>

      <View className="flex-1" />

      <Button onPress={onComplete}>Get Started</Button>
    </View>
  );
};
