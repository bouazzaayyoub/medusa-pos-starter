import { useAuthCtx } from '@/contexts/auth';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController({ loaded }: { loaded: boolean }) {
  const { state } = useAuthCtx();

  useEffect(() => {
    if (state.status !== 'loading' && loaded) {
      SplashScreen.hideAsync();
    }
  }, [state.status, loaded]);

  return null;
}
