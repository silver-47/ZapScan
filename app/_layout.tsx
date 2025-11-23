/* 
  © 2025 Arnab Ganguly — All Rights Reserved.
  This code is provided solely for evaluation purposes and may not be copied,
  modified, distributed, or used without explicit permission from the author.
*/

import { type QRData } from "@/constants/types";
import { useThemedColors } from "@/hooks/useThemedColors";
import { Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { Link, Stack, useGlobalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Share, TouchableOpacity } from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  let [fontsLoaded, fontsLoadError] = useFonts({
    InterLight: Inter_300Light,
    InterRegular: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
  });
  const colors = useThemedColors();

  useEffect(() => {
    if (fontsLoaded || fontsLoadError) SplashScreen.hideAsync();
  }, [fontsLoadError, fontsLoaded]);

  if (!fontsLoaded && !fontsLoadError) return null;

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: "InterSemiBold" },
          headerBackButtonDisplayMode: "minimal",
          headerBackButtonMenuEnabled: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "ZapScan ⚡",
            headerRight: (props) => (
              <Link href="/history" onPress={() => Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm)}>
                <MaterialCommunityIcons name="history" size={24} color={props.tintColor} allowFontScaling={false} />
              </Link>
            ),
          }}
        />
        <Stack.Screen name="history" options={{ title: "QR Scan History 📜" }} />
        <Stack.Screen
          name="result"
          options={{
            title: "Scan Result",
            headerRight: (props) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const { type, data } = useGlobalSearchParams<QRData>();
              return (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
                    Share.share({ message: data, url: type === "url" ? data : undefined }).catch(console.error);
                  }}
                >
                  <MaterialCommunityIcons name="share" size={24} color={props.tintColor} allowFontScaling={false} />
                </TouchableOpacity>
              );
            },
          }}
          initialParams={{ type: "text", data: "---" }}
        />
      </Stack>
    </>
  );
}
