import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../theme/color";
import type {
  SensorsCardsModel,
  SensorsRefreshModel,
} from "./useSensorsStatus";

type SensorsCardsProps = {
  cards: SensorsCardsModel;
  refresh: SensorsRefreshModel;
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

export const SensorsCards = ({ cards, refresh }: SensorsCardsProps) => {
  const {
    summary,
    accelerometer,
    gyroscope,
    magnetometer,
    barometer,
    nativeSensors,
  } = cards;

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
              <Text style={styles.headerLabel}>SENSORS DASHBOARD</Text>
              <Text style={styles.headerTitle}>Live Sensor Data</Text>
            </View>
            <View style={styles.headerIconBadge}>
              <Ionicons name="pulse" size={18} color={colors.icon.blue} />
            </View>
          </View>

          <View style={styles.quickStatsRow}>
            <View style={[styles.quickStatCard, styles.quickStatPrimary]}>
              <Text style={styles.quickStatLabel}>Status</Text>
              <Text style={styles.quickStatValue}>{summary.statusLabel}</Text>
            </View>
            <View style={[styles.quickStatCard, styles.quickStatSecondary]}>
              <Text style={styles.quickStatLabel}>Available Sensors</Text>
              <Text style={styles.quickStatValue}>
                {summary.availableSensors}
              </Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="pulse-outline"
                size={14}
                color={colors.icon.orange}
              />
              <Text style={styles.sectionTitle}>Accelerometer</Text>
            </View>
            <DetailRow
              label="Availability"
              value={accelerometer.availability}
            />
            <DetailRow label="Motion State" value={accelerometer.motionState} />
            <DetailRow
              label="Net Acceleration"
              value={accelerometer.netAcceleration}
            />
            <DetailRow label="Device Tilt" value={accelerometer.deviceTilt} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="sync-outline"
                size={14}
                color={colors.icon.green}
              />
              <Text style={styles.sectionTitle}>Gyroscope</Text>
            </View>
            <DetailRow label="Availability" value={gyroscope.availability} />
            <DetailRow label="Rotation Speed" value={gyroscope.rotationSpeed} />
            <DetailRow label="Stability" value={gyroscope.stability} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="compass-outline"
                size={14}
                color={colors.icon.blue}
              />
              <Text style={styles.sectionTitle}>Magnetometer</Text>
            </View>
            <DetailRow label="Availability" value={magnetometer.availability} />
            <DetailRow label="Heading" value={magnetometer.heading} />
            <DetailRow label="Direction" value={magnetometer.direction} />
            <DetailRow
              label="Field Strength"
              value={magnetometer.fieldStrength}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="speedometer-outline"
                size={14}
                color={colors.icon.yellow}
              />
              <Text style={styles.sectionTitle}>Barometer</Text>
            </View>
            <DetailRow label="Availability" value={barometer.availability} />
            <DetailRow label="Pressure" value={barometer.pressure} />
            <DetailRow
              label="Estimated Altitude"
              value={barometer.estimatedAltitude}
            />
            <DetailRow label="Pressure Level" value={barometer.pressureLevel} />
            <DetailRow label="Sampling Rate" value={barometer.samplingRate} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="hardware-chip"
                size={14}
                color={colors.icon.orange}
              />
              <Text style={styles.sectionTitle}>Additional Native Sensors</Text>
            </View>
            <DetailRow label="Proximity" value={nativeSensors.proximity} />
            <DetailRow
              label="Ambient Light"
              value={nativeSensors.ambientLight}
            />
            <DetailRow label="Step Counter" value={nativeSensors.stepCounter} />
            <DetailRow
              label="Rotation Vector"
              value={nativeSensors.rotationVector}
            />
            <DetailRow label="Gravity" value={nativeSensors.gravity} />
            <DetailRow
              label="Linear Acceleration"
              value={nativeSensors.linearAcceleration}
            />
            <DetailRow
              label="Relative Humidity"
              value={nativeSensors.relativeHumidity}
            />
            <DetailRow
              label="Ambient Temperature"
              value={nativeSensors.ambientTemperature}
            />
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
    maxHeight: 390,
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
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.secondary,
  },
  detailRow: {
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
