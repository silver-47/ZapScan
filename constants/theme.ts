const PRIMARY_COLOR = ["#06B6D4", "#10B981", "#3B82F6", "#F43F5E", "#F97316"][Math.floor(Math.random() * 5)];

export const colors = {
  light: {
    background: "#F3F4F6",
    card: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    primary: PRIMARY_COLOR,
  },
  dark: {
    background: "#111827",
    card: "#1F2937",
    text: "#F9FAFB",
    textSecondary: "#9CA3AF",
    primary: PRIMARY_COLOR,
  },
};
