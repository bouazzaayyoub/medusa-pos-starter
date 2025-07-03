import { usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export const AppStatusBar = () => {
  const pathname = usePathname();

  return <StatusBar style={pathname === '/scan' ? 'light' : 'auto'} />;
};
