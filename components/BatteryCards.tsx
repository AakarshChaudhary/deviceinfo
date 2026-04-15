import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BatteryCardsProps = {
  levelPercent: number;
  healthStatus: string;
  powerSaving: boolean;
};

export const BatteryCards = ({
  levelPercent,
  healthStatus,
  powerSaving,
}: BatteryCardsProps) => {
  return (
    <View style={styles.cardsSection}>
      <View style={[styles.card, styles.insightCard]} />

      <View style={styles.topRow}>
        <View style={[styles.card, styles.levelCard]}>
          <View style={styles.iconBadge}>
            <Ionicons name="battery-full" size={18} color="#047857" />
          </View>
          <Text style={styles.cardLabel}>BATTERY LEVEL</Text>
          <Text style={styles.levelValue}>{levelPercent}%</Text>
          <Text style={styles.levelHint}>
            {levelPercent >= 50 ? "Optimal range" : "Needs charging"}
          </Text>
        </View>

        <View style={styles.rightCards}>
          <View style={[styles.card, styles.smallCard]}>
            <Ionicons name="checkmark-done" size={16} color="#047857" />
            <Text style={styles.smallLabel}>STATUS</Text>
            <Text style={styles.smallValue}>{healthStatus}</Text>
          </View>

          <View style={[styles.card, styles.smallCard]}>
            <Ionicons name="leaf" size={16} color="#047857" />
            <Text style={styles.smallLabel}>SAVING</Text>
            <Text style={styles.smallValue}>
              {powerSaving ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardsSection: {
    width: "90%",
    marginTop: 70,
  },
  topRow: {
    flexDirection: "row",
    gap: 15,
  },
  rightCards: {
    flex: 1,
    gap: 15,
  },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    padding: 14,
  },
  levelCard: {
    flex: 1.3,
    minHeight: 190,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E5F7EF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.8,
  },
  levelValue: {
    marginTop: 6,
    fontSize: 40,
    fontWeight: "800",
    color: "#111827",
  },
  levelHint: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
    color: "#22C55E",
  },
  smallCard: {
    minHeight: 90,
    justifyContent: "center",
  },
  smallLabel: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.8,
  },
  smallValue: {
    marginTop: 2,
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  },
  insightCard: {
    minHeight: 100,
    marginBottom: 20,
  },
  stateCard: {
    marginTop: 10,
    minHeight: 86,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stateValue: {
    marginTop: 2,
    fontSize: 33,
    fontWeight: "700",
    color: "#1F2937",
  },
  livePill: {
    backgroundColor: "#E5F7EF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.6,
  },
});
