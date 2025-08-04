import { LoadingBanner } from '@/components/LoadingBanner';
import React from 'react';
import { View } from 'react-native';

export default function RootLoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <LoadingBanner variant="ghost">Loading...</LoadingBanner>
    </View>
  );
}
