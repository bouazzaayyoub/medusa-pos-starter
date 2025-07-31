// import 'react-native-reanimated';
import { AppStatusBar } from '@/components/AppStatusBar';
import '../global.css';

import { ProductDetailsHeader } from '@/components/ProductDetailsHeader';
import { SplashScreenController } from '@/components/SplashScreenController';
import { AuthProvider, useAuthCtx } from '@/contexts/auth';
import { useSettings } from '@/contexts/settings';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

function App() {
  const router = useRouter();
  const auth = useAuthCtx();
  const settings = useSettings();

  React.useEffect(() => {
    if (auth.state.status === 'unauthenticated') {
      // If the user is not authenticated, redirect to the login screen
      router.replace('/login');
      return;
    }

    if (auth.state.status === 'authenticated') {
      if (settings.isSuccess) {
        if (!settings.data || !settings.data.sales_channel || !settings.data.region || !settings.data.stock_location) {
          // If settings are not set, redirect to the setup wizard
          router.replace('/setup-wizard');
          return;
        }

        // If settings are set, redirect to the main app
        if (settings.data.sales_channel && settings.data.region && settings.data.stock_location) {
          router.replace('/(tabs)/products');
          return;
        }
      }
    }
  }, [auth.state, settings.isSuccess, settings.data, router]);

  return (
    <Stack>
      <Stack.Protected
        guard={
          auth.state.status === 'authenticated' &&
          settings.isSuccess &&
          !!settings.data &&
          !!settings.data.sales_channel &&
          !!settings.data.region &&
          !!settings.data.stock_location
        }
      >
        {/* Main App - Tab Navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Checkout Flow */}
        <Stack.Screen name="checkout/[draftOrderId]" options={{ title: 'Checkout', headerShown: false }} />

        {/* Modal Dialogs */}
        <Stack.Screen
          name="product-details"
          options={{
            presentation: 'modal',
            title: 'Product Details',
            header: () => <ProductDetailsHeader />,
          }}
        />
        <Stack.Screen
          name="orders/[orderId]"
          options={{
            presentation: 'transparentModal',
            title: 'Order Details',
            headerShown: false,
            animation: 'none',
            animationDuration: 0,
            gestureEnabled: false,
            fullScreenGestureShadowEnabled: false,
          }}
        />
        <Stack.Screen
          name="customer-lookup"
          options={{
            presentation: 'transparentModal',
            title: 'Customer Lookup',
            headerShown: false,
            animation: 'none',
          }}
        />
        <Stack.Screen name="+not-found" />

        <Stack.Screen name="sales-channel" options={{ headerShown: false }} />

        <Stack.Screen name="create-sales-channel" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected
        guard={
          auth.state.status === 'authenticated' &&
          settings.isSuccess &&
          (!settings.data || !settings.data.sales_channel || !settings.data.region || !settings.data.stock_location)
        }
      >
        <Stack.Screen name="setup-wizard" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={auth.state.status === 'unauthenticated'}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen options={{ headerShown: false }} name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <SplashScreenController loaded={true} />
          <AppStatusBar />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}
