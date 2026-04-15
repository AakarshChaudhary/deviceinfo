import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BatteryCardsProps = {
  batteryManufacturer: string;
  batteryTechnology: string;
  batteryTemperature: string;
  batteryVoltage: string;
  batteryCapacity: string;
  chargingSpeed: string;
  healthStatus: string;
  powerSaving: boolean;
};

export const BatteryCards = ({
  batteryManufacturer,
  batteryTechnology,
  batteryTemperature,
  batteryVoltage,
  batteryCapacity,
  chargingSpeed,
  healthStatus,
  powerSaving,
}: BatteryCardsProps) => {
  return (
    <View style={styles.cardsSection}>
      <View style={[styles.card, styles.insightCard]}>
        <View style={styles.insightRow}>
          <View>
            <Text style={styles.cardLabel}>BATTERY INSIGHT</Text>
            <Text style={styles.insightValue}>Default</Text>
          </View>
          <Ionicons name="flash" size={22} color="#2563EB" />
        </View>
        <Text style={styles.insightHint}>0% per minute</Text>
      </View>

      <View style={styles.topRow}>
        <View style={[styles.card, styles.levelCard]}>
          <View style={styles.iconBadge}>
            <Ionicons name="battery-full" size={18} color="#047857" />
          </View>
          <Text style={styles.cardLabel}>BATTERY DETAILS</Text>
          <View style={styles.detailList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Manufacturer</Text>
              <Text style={styles.detailValue}>{batteryManufacturer}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Technology</Text>
              <Text style={styles.detailValue}>{batteryTechnology}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Temperature</Text>
              <Text style={styles.detailValue}>{batteryTemperature}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Voltage</Text>
              <Text style={styles.detailValue}>{batteryVoltage}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Capacity</Text>
              <Text style={styles.detailValue}>{batteryCapacity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Charging Speed</Text>
              <Text style={styles.detailValue}>{chargingSpeed}</Text>
            </View>
          </View>
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
    minHeight: 220,
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
  detailList: {
    marginTop: 8,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
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
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  insightValue: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  insightHint: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
});
