import { useThemedColors } from "@/hooks/useThemedColors";
import { Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { Link, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
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
                <MaterialCommunityIcons name="history" size={24} color={props.tintColor} />
              </Link>
            ),
          }}
        />
        <Stack.Screen name="history" options={{ title: "QR Scan History 📜" }} />
        <Stack.Screen name="result" options={{ title: "Scan Result" }} />
      </Stack>
    </>
  );
}
