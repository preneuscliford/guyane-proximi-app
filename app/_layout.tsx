import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../globals.css";
import { useColorScheme } from "@/hooks/useColorScheme";

import AuthProvider from "./provider/AuthProvider";

import AnimationScreen from "@/components/AnimationScreen";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setAppIsReady(true);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (!appIsReady || !animationFinished) {
    return (
      <AnimationScreen
        onAnimationFinish={(isCancelled) => {
          if (!isCancelled) {
            setAnimationFinished(true);
          }
        }}
      />
    );
  }

  return (
    <AuthProvider>
      <Stack>
        <StatusBar style="dark" backgroundColor="#fff" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}
