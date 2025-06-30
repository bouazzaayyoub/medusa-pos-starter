import { Loader } from '@/components/icons/loader';
import React from 'react';
import { Text, View } from 'react-native';

export default function RootLoadingScreen() {
  return (
    <View
      className="flex-1 justify-center items-center p-5"
      style={{ backgroundColor: '#F4FAFF' }}
    >
      <Loader className="size-14 animate-spin mb-4" />
      <Text>Loading...</Text>
    </View>
  );
}
