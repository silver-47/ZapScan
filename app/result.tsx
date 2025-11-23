/* 
  © 2025 Arnab Ganguly — All Rights Reserved.
  This code is provided solely for evaluation purposes and may not be copied,
  modified, distributed, or used without explicit permission from the author.
*/

import { type QRData } from "@/constants/types";
import { useThemedColors } from "@/hooks/useThemedColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

export default function ResultScreen() {
  const { type, data } = useLocalSearchParams<QRData>();
  const colors = useThemedColors();

  return type === "url" ? (
    <WebView
      style={{ flex: 1, backgroundColor: colors.background }}
      source={{ uri: data }}
      startInLoadingState={true}
      renderLoading={() => (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.text} size="large" />
        </View>
      )}
    />
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, { color: colors.text }]} allowFontScaling={false}>
          Found Text
        </Text>
        <MaterialCommunityIcons name="text-long" size={36} color={colors.primary} allowFontScaling={false} />
      </View>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary }]}>
        <Text selectable style={[styles.textContent, { color: colors.text }]} allowFontScaling={false}>
          {data}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  container: { flexGrow: 1, padding: 24 },
  titleContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  titleText: { fontSize: 24, fontFamily: "InterSemiBold" },
  card: {
    flex: 1,
    marginTop: 24,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  textContent: { fontSize: 18, fontFamily: "InterRegular" },
});
