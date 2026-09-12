import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  useFonts,
} from '@expo-google-fonts/archivo';
import {
  SourceSerif4_400Regular,
  SourceSerif4_600SemiBold,
  SourceSerif4_700Bold,
} from '@expo-google-fonts/source-serif-4';
import { color } from '@/theme/tokens';
import { useStudyStore } from '@/store/useStudyStore';
import { useAccessStore } from '@/store/useAccessStore';
import { isPreExistingInstall } from '@/access';

// expo-router renders this for any uncaught error in the route tree.
export { ErrorBoundary } from '@/components/ErrorBoundary';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
    SourceSerif4_400Regular,
    SourceSerif4_600SemiBold,
    SourceSerif4_700Bold,
  });
  const hydrated = useStudyStore((s) => s.hydrated);
  const accessHydrated = useAccessStore((s) => s.hydrated);
  const ready = fontsLoaded && hydrated && accessHydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  // Grandfathering is decided here, once, the moment both stores are readable and
  // before the first screen paints. Anyone whose install already shows use — they
  // onboarded, answered anything, studied on any day — predates the paywall and
  // keeps the whole app permanently. Deciding it any later risks a fresh install
  // completing onboarding first and qualifying by accident.
  useEffect(() => {
    if (!hydrated || !accessHydrated) return;
    useAccessStore
      .getState()
      .determineGrandfathering(isPreExistingInstall(useStudyStore.getState()));
  }, [hydrated, accessHydrated]);

  // Ask the store what this install is entitled to. The facade is inert when the
  // build has no purchases key, so this is a no-op in development rather than a
  // reason to guard the call site.
  useEffect(() => {
    if (!accessHydrated) return;
    useAccessStore.getState().refresh();
  }, [accessHydrated]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: color.paper }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: color.paper }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: color.paper },
            animation: 'fade',
          }}
        >
          {/* The exam/level switcher sits above whatever you were doing. */}
          <Stack.Screen
            name="switch"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
