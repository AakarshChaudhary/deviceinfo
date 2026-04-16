import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import colors from "./theme/color";

type BatteryCardsProps = {
  batteryManufacturer: string;
  batteryTechnology: string;
  batteryTemperature: string;
  batteryVoltage: string;
  batteryCapacity: string;
  chargingSpeed: string;
  estimatedTime: string;
  chargingType: string;
  healthStatus: string;
  powerSaving: boolean;
};

type DetailRowProps = {
  label: string;
  value: string;
};

const DetailRow = ({ label, value }: DetailRowProps) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export const BatteryCards = ({
  batteryManufacturer,
  batteryTechnology,
  batteryTemperature,
  batteryVoltage,
  batteryCapacity,
  chargingSpeed,
  estimatedTime,
  chargingType,
  healthStatus,
  powerSaving,
}: BatteryCardsProps) => {
  const healthColor =
    healthStatus.toLowerCase() === "good" ? "#047857" : "#B45309";

  return (
    <View style={styles.cardsSection}>
      <View style={styles.panel}>
        <ScrollView
          contentContainerStyle={styles.panelContent}
          showsVerticalScrollIndicator
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerLabel}>BATTERY DASHBOARD</Text>
              <Text style={styles.headerTitle}>Charging Overview</Text>
            </View>
            <View style={styles.headerIconBadge}>
              <Ionicons name="battery-full" size={18} color="#1D4ED8" />
            </View>
          </View>

          <View style={styles.quickStatsRow}>
            <View style={[styles.quickStatCard, styles.quickStatPrimary]}>
              <Text style={styles.quickStatLabel}>Charging Speed</Text>
              <Text style={styles.quickStatValue}>{chargingSpeed}</Text>
            </View>
            <View style={[styles.quickStatCard, styles.quickStatSecondary]}>
              <Text style={styles.quickStatLabel}>Time to Full</Text>
              <Text style={styles.quickStatValue}>{estimatedTime}</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash" size={14} color="#1D4ED8" />
              <Text style={styles.sectionTitle}>Charging</Text>
            </View>
            <DetailRow label="Type" value={chargingType} />
            <DetailRow
              label="Power Saving"
              value={powerSaving ? "Active" : "Inactive"}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-done" size={14} color={healthColor} />
              <Text style={styles.sectionTitle}>Battery Condition</Text>
            </View>
            <DetailRow label="Health" value={healthStatus} />
            <DetailRow label="Temperature" value={batteryTemperature} />
            <DetailRow label="Voltage" value={batteryVoltage} />
            <DetailRow label="Capacity" value={batteryCapacity} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="leaf" size={14} color="#047857" />
              <Text style={styles.sectionTitle}>Device Details</Text>
            </View>
            <DetailRow label="Manufacturer" value={batteryManufacturer} />
            <DetailRow label="Technology" value={batteryTechnology} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardsSection: {
    width: "90%",
    marginTop: 25,
  },
  panel: {
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    maxHeight: 435,
  },
  panelContent: {
    paddingBottom: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text.tertiary,
    letterSpacing: 1,
  },
  headerTitle: {
    marginTop: 5,
    fontSize: 21,
    fontWeight: "700",
    color: colors.text.primary,
  },
  headerIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 50,
    backgroundColor: colors.surface.tintBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  quickStatsRow: {
    marginTop: 13,
    flexDirection: "row",
    gap: 10,
  },
  quickStatCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
  },
  quickStatPrimary: {
    backgroundColor: colors.surface.tintIndigo,
  },
  quickStatSecondary: {
    backgroundColor: colors.surface.tintCyan,
  },
  quickStatLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.text.tertiary,
    letterSpacing: 0.8,
  },
  quickStatValue: {
    marginTop: 6,
    fontSize: 21,
    fontWeight: "800",
    color: colors.text.primary,
  },
  sectionCard: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.secondary,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.tertiary,

  },
  detailValue: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.primary,
  },
});
