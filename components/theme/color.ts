export const colors = {
  
  text: {
    primary: "#111827",
    secondary: "#334155",
    tertiary: "#64748B",
    muted: "#94A3B8",
  },

  surface: {
    tintBlue: "#DBEAFE",
    tintIndigo: "#EEF2FF",
    tintCyan: "#ECFEFF",
  },

  ring: {
    charging: "#2563EB", // Blue for charging
    high: "#16A34A", // 80–100%
    good: "#F59E0B", // 50–80%
    low: "#F97316", // 20–50%
    critical: "#DC2626", // 0–20%
  },

} as const;

export default colors;
