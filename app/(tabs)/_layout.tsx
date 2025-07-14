import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';

import { useDraftOrder } from '@/api/hooks/draft-orders';
import { HapticTab } from '@/components/HapticTab';
import { ClipboardList } from '@/components/icons/clipboard-list';
import { ScanBarcode } from '@/components/icons/scan-barcode';
import { Settings } from '@/components/icons/settings';
import { ShoppingCart } from '@/components/icons/shopping-cart';
import { Store } from '@/components/icons/store';

export default function TabLayout() {
  const draftOrder = useDraftOrder();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#282828',
        tabBarInactiveTintColor: '#B5B5B5',
        tabBarIconStyle: {
          marginBottom: 4,
        },
        headerShown: false,
        tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <Store size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <ScanBarcode size={28} color={color} />,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <View>
              <ShoppingCart size={28} color={color} />
              {draftOrder.data && draftOrder.data.draft_order.items.length > 0 && (
                <View
                  style={{ backgroundColor: color }}
                  className="absolute -right-1 -top-0.5 w-3.5 h-3.5 rounded-full justify-center items-center"
                >
                  <Text className="text-white text-[0.5625rem] font-bold">
                    {draftOrder.data.draft_order.items.length}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <ClipboardList size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
