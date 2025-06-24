import { X } from '@/components/icons/x';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Camera, CameraView, FlashMode } from 'expo-camera';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState<FlashMode>('auto');
  const [isSearching, setIsSearching] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const toggleFlashMode = () => {
    setFlashMode((current) => {
      switch (current) {
        case 'off':
          return 'on';
        case 'on':
          return 'auto';
        case 'auto':
          return 'off';
        default:
          return 'auto';
      }
    });
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'off':
        return 'bolt.slash.fill';
      case 'on':
        return 'bolt.fill';
      case 'auto':
        return 'bolt.badge.a.fill';
      default:
        return 'bolt.badge.a.fill';
    }
  };

  const handleBarcodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scanned || isSearching) return;

    setScanned(true);
    setIsSearching(true);

    try {
      // Simulate API call to find product
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to product details or show options
      router.push({
        pathname: '/product-details',
        params: { barcode: data, scannedProduct: 'true' },
      });
    } catch (error) {
      console.error('Error searching for product:', error);
    } finally {
      setIsSearching(false);
      setScanned(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center p-5">
        <StatusBar style="light" />
        <Text className="text-white text-2xl mb-4 text-center">
          Camera Access Required
        </Text>
        <Text className="text-white text-base text-center opacity-70 mb-8">
          Please enable camera access in settings to scan barcodes
        </Text>
        <TouchableOpacity
          className="border border-white rounded-lg p-4 items-center"
          onPress={handleGoBack}
        >
          <Text className="text-white text-base font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Camera View - Full Screen */}
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        flash={flashMode}
        onBarcodeScanned={
          scanned || isSearching ? undefined : handleBarcodeScanned
        }
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'ean13', 'ean8', 'code128', 'code39'],
        }}
      >
        {/* Top Navigation with Safe Area */}
        <View
          className="absolute top-0 left-0 right-0 z-10 px-6 flex-row justify-between items-center"
          style={{ paddingTop: insets.top + 12, paddingBottom: 12 }}
        >
          <TouchableOpacity
            className="w-12 h-12 justify-center items-center"
            onPress={handleGoBack}
          >
            <X size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-12 h-12 justify-center items-center"
            onPress={toggleFlashMode}
          >
            <IconSymbol name={getFlashIcon()} size={26} color="white" />
          </TouchableOpacity>
        </View>

        {/* Center Reticle Overlay */}
        <View className="flex-1 justify-center items-center px-8">
          <View className="items-center">
            {/* Reticle Frame */}
            <View className="w-64 h-64 relative">
              {/* Corner brackets */}
              <View className="absolute top-[3px] left-[3px] right-[3px] bottom-[3px] bg-[#ffffff4d] rounded-[29px]" />
              <View className="absolute top-0 left-0 w-20 h-20 border-l-[3px] border-t-[3px] border-white rounded-tl-[32px]" />
              <View className="absolute top-0 right-0 w-20 h-20 border-r-[3px] border-t-[3px] border-white rounded-tr-[32px]" />
              <View className="absolute bottom-0 left-0 w-20 h-20 border-l-[3px] border-b-[3px] border-white rounded-bl-[32px]" />
              <View className="absolute bottom-0 right-0 w-20 h-20 border-r-[3px] border-b-[3px] border-white rounded-br-[32px]" />

              {/* Loading indicator when searching */}
              {isSearching && (
                <View className="absolute inset-0 justify-center items-center">
                  <ActivityIndicator size="large" color="white" />
                </View>
              )}
            </View>

            {/* Scan Text */}
            {!isSearching && (
              <View className="mt-6">
                <Text className="text-white text-xl text-center">
                  Scan barcode
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom Searching Indicator with Safe Area */}
        {isSearching && (
          <View
            className="absolute bottom-0 left-0 right-0 px-6"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <View className="bg-white px-4 py-2 rounded-3xl">
              <Text className="text-black text-center text-base">
                Searching...
              </Text>
            </View>
          </View>
        )}
      </CameraView>
    </View>
  );
}
