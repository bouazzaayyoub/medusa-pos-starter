import { useScanBarcode } from '@/api/hooks/products';
import { X } from '@/components/icons/x';
import { IconSymbol } from '@/components/ui/IconSymbol';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {
  BarcodeScanningResult,
  Camera,
  CameraView,
  FlashMode,
} from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanScreen() {
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashMode, setFlashMode] = useState<FlashMode>('auto');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scanBarcodeMutation = useScanBarcode({
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: (data) => {
      if (data) {
        setIsProductModalOpen(true);
        bottomSheetModalRef.current?.snapToIndex(0);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setErrorMessage('Product not found');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
  });

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsProductModalOpen(false);
      scanBarcodeMutation.reset();
    }
  }, []);

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
  }: BarcodeScanningResult) => {
    if (
      isProductModalOpen ||
      scanBarcodeMutation.isPending ||
      (scanBarcodeMutation.isSuccess && scanBarcodeMutation.variables === data)
    ) {
      return;
    }

    scanBarcodeMutation.mutate(data);
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
    <View className="flex-1 bg-black relative">
      <StatusBar style="light" />

      {/* Camera View - Full Screen */}
      <CameraView
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        facing="back"
        flash={flashMode}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'ean13',
            'ean8',
            'upc_a',
            'upc_e',
            'code128',
            'code93',
            'code39',
          ],
        }}
        autofocus="on"
      />

      {/* Top Navigation with Safe Area */}
      <View className="absolute top-0 left-0 right-0 z-30 px-6 flex-row justify-between items-center py-safe-offset-3">
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
      <View className="flex-1 justify-center items-center px-8 relative">
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
            {scanBarcodeMutation.isPending && (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="absolute inset-0 justify-center items-center"
              >
                <ActivityIndicator size="large" color="white" />
              </Animated.View>
            )}
          </View>

          {/* Scan Text */}
          {!scanBarcodeMutation.isPending && !isProductModalOpen && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="absolute top-full mt-6"
            >
              <Text className="text-white text-xl text-center">
                Scan barcode
              </Text>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Bottom Searching Indicator with Safe Area */}
      {scanBarcodeMutation.isPending && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="absolute bottom-0 left-0 right-0 px-6 pb-safe-offset-4 flex items-center"
        >
          <View className="bg-white px-4 py-2 rounded-3xl">
            <Text className="text-black text-center text-base">
              Searching...
            </Text>
          </View>
        </Animated.View>
      )}

      {!scanBarcodeMutation.isPending && errorMessage && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="absolute bottom-0 left-0 right-0 px-6 pb-safe-offset-4 flex items-center z-50"
        >
          <TouchableOpacity
            className="bg-red px-4 py-2 rounded-3xl"
            onPress={() => {
              setErrorMessage(null);
              scanBarcodeMutation.reset();
            }}
          >
            <Text className="text-white text-center text-base">
              {errorMessage}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <GestureHandlerRootView className="absolute top-0 left-0 right-0 bottom-0 z-20">
        <BottomSheet
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          index={-1}
          enablePanDownToClose
        >
          <BottomSheetView className="flex-1 items-center pb-safe-offset-4">
            <Text>Awesome 🎉</Text>
            <Text>Awesome 🎉</Text>
            <Text>Awesome 🎉</Text>
            <Text>Awesome 🎉</Text>
            <Text>Awesome 🎉</Text>
            <Text>Awesome 🎉</Text>
            <Text>Awesome 🎉</Text>
            <Text>Awesome 🎉</Text>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </View>
  );
}
