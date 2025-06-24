import React from 'react';
import { Image, View } from 'react-native';

export default function RootLoadingScreen() {
  return (
    <View
      className="flex-1 justify-center items-center p-5"
      style={{ backgroundColor: '#F4FAFF' }}
    >
      <Image
        source={require('../assets/images/splash-icon.png')}
        className="max-w-60 h-full"
        style={{ objectFit: 'contain' }}
      />
    </View>
  );
}
