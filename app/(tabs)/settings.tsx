import { useAuthCtx } from '@/contexts/auth';
import { useClearSettings, useSettings } from '@/contexts/settings';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const queryClient = useQueryClient();
  const auth = useAuthCtx();
  const settings = useSettings();
  const clearSettings = useClearSettings();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          queryClient.clear();
          router.replace('/login');
          await auth.logout();
        },
      },
    ]);
  };

  const renderMenuButton = (
    title: string,
    description: string,
    onPress: () => void,
    style?: 'default' | 'destructive',
  ) => (
    <TouchableOpacity
      className={`bg-white px-5 py-4 border-b border-gray-200 ${
        style === 'destructive' ? '' : ''
      }`}
      onPress={onPress}
    >
      <View>
        <Text
          className={`text-base font-medium mb-1 ${
            style === 'destructive' ? 'text-red-500' : ''
          }`}
        >
          {title}
        </Text>
        <Text
          className={`text-sm ${
            style === 'destructive'
              ? 'text-red-500 opacity-70'
              : 'text-gray-600'
          }`}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-5 pt-15">
          <Text className="text-3xl">Settings</Text>
        </View>

        {/* Store Information */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4 mx-5 text-gray-600">
            Store Information
          </Text>

          <TouchableOpacity
            className="bg-white px-5 py-4 border-b border-gray-200"
            onPress={() => {
              // TODO: Navigate to tax settings screen
              Alert.alert(
                'Tax Settings',
                'Configure tax settings functionality',
              );
            }}
          >
            <View>
              <Text className="text-base font-medium mb-1">Sales Channel</Text>
              <Text className="text-sm text-gray-600">
                {settings.data?.sales_channel?.name || '—'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white px-5 py-4 border-b border-gray-200"
            onPress={() => {
              // TODO: Navigate to tax settings screen
              Alert.alert(
                'Tax Settings',
                'Configure tax settings functionality',
              );
            }}
          >
            <View>
              <Text className="text-base font-medium mb-1">Stock Location</Text>
              <Text className="text-sm text-gray-600">
                {settings.data?.stock_location?.name || '—'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white px-5 py-4 border-b border-gray-200"
            onPress={() => {
              clearSettings.mutate();
            }}
          >
            <View>
              <Text className="text-base font-medium mb-1">Clear Settings</Text>
              <Text className="text-sm text-gray-600">
                Reset settings to default
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4 mx-5 text-gray-600">
            Support
          </Text>

          {renderMenuButton('Help & FAQ', 'Get help and find answers', () => {
            // TODO: Navigate to help screen
            Alert.alert('Help & FAQ', 'Help and FAQ functionality');
          })}

          {renderMenuButton('Contact Support', 'Get technical support', () => {
            // TODO: Navigate to contact support screen
            Alert.alert('Contact Support', 'Contact support functionality');
          })}

          {renderMenuButton(
            'About',
            'App version and legal information',
            () => {
              Alert.alert('About', 'Agilo POS v1.0.0\n\nBuilt with Expo');
            },
          )}
        </View>

        {/* Account */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4 mx-5 text-gray-600">
            Account
          </Text>

          {renderMenuButton(
            'Logout',
            'Sign out of your account',
            handleLogout,
            'destructive',
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
