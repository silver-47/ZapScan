import { useThemedColors } from "@/hooks/useThemedColors";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function ResultScreen() {
  const colors = useThemedColors();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]} allowFontScaling={false}>
        Result
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  heading: { fontSize: 24, fontFamily: "InterSemiBold" },
});
