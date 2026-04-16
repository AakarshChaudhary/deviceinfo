export const colors = {

  text: {
    primary: "#111827",
    secondary: "#334155",
    tertiary: "#64748B",
    muted: "#94A3B8",
    green: "#16A34A",
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
    stroke: "#E5E7EB", // Light gray for stroke
  },

  card: {
    base: "#F8FAFC",
    elevated: "#FFFFFF",
  },

  icon: {
    green: "#047857",
    blue: "#1D4ED8",
    orange: "#B45309",
  },

  tab: {
    active: "#673ab7",
    inactive: "#222",
  },

  border: "#E2E8F0",
  background: "#FFFFFF",
  shadow: "#000000",


} as const;

export default colors;
