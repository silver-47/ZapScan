import { colors } from "@/constants/theme";
import { useColorScheme } from "react-native";

export const useThemedColors = () => {
  const scheme = useColorScheme();
  return colors[scheme === "dark" ? "dark" : "light"];
};
