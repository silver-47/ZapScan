import { useThemedColors } from "@/hooks/useThemedColors";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const colors = useThemedColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]} allowFontScaling={false}>
        Welcome!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  heading: { fontSize: 24, fontFamily: "InterSemiBold" },
});
