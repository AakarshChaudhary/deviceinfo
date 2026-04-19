import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "../theme/color";
import type {
  BatteryCardsModel,
  BatteryRefreshModel,
} from "./useBatteryStatus";

type BatteryCardsProps = {
  cards: BatteryCardsModel;
  refresh: BatteryRefreshModel;
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

export const BatteryCards = ({ cards, refresh }: BatteryCardsProps) => {
  const { overview, charging, condition, details } = cards;
  const healthColor =
    condition.healthTone === "good" ? colors.icon.blue : colors.icon.orange;

  return (
    <View style={styles.cardsSection}>
      <View style={styles.panel}>
        <ScrollView
          contentContainerStyle={styles.panelContent}
          showsVerticalScrollIndicator
          refreshControl={
            <RefreshControl
              refreshing={refresh.refreshing}
              onRefresh={refresh.onRefresh}
            />
          }
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerLabel}>BATTERY DASHBOARD</Text>
              <Text style={styles.headerTitle}>Charging Overview</Text>
            </View>
            <View style={styles.headerIconBadge}>
              <Ionicons
                name="battery-full"
                size={18}
                color={colors.icon.blue}
              />
            </View>
          </View>

          <View style={styles.quickStatsRow}>
            <View style={[styles.quickStatCard, styles.quickStatPrimary]}>
              <Text style={styles.quickStatLabel}>{overview.speedLabel}</Text>
              <Text style={styles.quickStatValue}>
                {overview.chargingSpeed}
              </Text>
            </View>
            <View style={[styles.quickStatCard, styles.quickStatSecondary]}>
              <Text style={styles.quickStatLabel}>
                {overview.estimatedTimeLabel}
              </Text>
              <Text style={styles.quickStatValue}>
                {overview.estimatedTime}
              </Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash" size={14} color={colors.icon.yellow} />
              <Text style={styles.sectionTitle}>Charging</Text>
            </View>
            <DetailRow label="Power Source" value={charging.powerSource} />
            <DetailRow
              label="Power Saving"
              value={charging.powerSavingStatus}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="fitness" size={14} color={healthColor} />
              <Text style={styles.sectionTitle}>Battery Condition</Text>
            </View>
            <DetailRow label="Health" value={condition.health} />
            <DetailRow label="Temperature" value={condition.temperature} />
            <DetailRow label="Voltage" value={condition.voltage} />
            <DetailRow
              label="Estimated Capacity"
              value={condition.estimatedCapacity}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="leaf" size={14} color={colors.icon.green} />
              <Text style={styles.sectionTitle}>Battery Details</Text>
            </View>
            <DetailRow label="Manufacturer" value={details.manufacturer} />
            <DetailRow label="Technology" value={details.technology} />
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
    backgroundColor: colors.card.base,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    marginTop: 5,
    fontSize: 21,
    fontWeight: "800",
    color: colors.text.primary,
  },
  sectionCard: {
    marginTop: 10,
    backgroundColor: colors.card.elevated,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
