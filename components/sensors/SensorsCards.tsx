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

type SensorsCardsProps = {
  statusLabel: string;
  availableSensors: string;
  samplingRate: string;

  accelerometerAvailability: string;
  motionState: string;
  deviceTilt: string;
  accelerometerMagnitude: string;

  gyroscopeAvailability: string;
  rotationSpeed: string;
  stabilityState: string;

  magnetometerAvailability: string;
  compassHeading: string;
  compassDirection: string;
  magneticFieldStrength: string;

  barometerAvailability: string;
  barometricPressure: string;
  estimatedAltitude: string;
  pressureLevel: string;

  proximitySensor: string;
  ambientLightSensor: string;
  stepCounterSensor: string;
  rotationVectorSensor: string;
  gravitySensor: string;
  linearAccelerationSensor: string;
  relativeHumiditySensor: string;
  ambientTemperatureSensor: string;

  refreshing: boolean;
  onRefresh: () => void | Promise<void>;
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

export const SensorsCards = ({
  statusLabel,
  availableSensors,
  samplingRate,
  accelerometerAvailability,
  motionState,
  deviceTilt,
  accelerometerMagnitude,
  gyroscopeAvailability,
  rotationSpeed,
  stabilityState,
  magnetometerAvailability,
  compassHeading,
  compassDirection,
  magneticFieldStrength,
  barometerAvailability,
  barometricPressure,
  estimatedAltitude,
  pressureLevel,
  proximitySensor,
  ambientLightSensor,
  stepCounterSensor,
  rotationVectorSensor,
  gravitySensor,
  linearAccelerationSensor,
  relativeHumiditySensor,
  ambientTemperatureSensor,
  refreshing,
  onRefresh,
}: SensorsCardsProps) => {
  return (
    <View style={styles.cardsSection}>
      <View style={styles.panel}>
        <ScrollView
          contentContainerStyle={styles.panelContent}
          showsVerticalScrollIndicator
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
              <Text style={styles.quickStatValue}>{statusLabel}</Text>
            </View>
            <View style={[styles.quickStatCard, styles.quickStatSecondary]}>
              <Text style={styles.quickStatLabel}>Available Sensors</Text>
              <Text style={styles.quickStatValue}>{availableSensors}</Text>
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
            <DetailRow label="Availability" value={accelerometerAvailability} />
            <DetailRow label="Motion State" value={motionState} />
            <DetailRow
              label="Net Acceleration"
              value={accelerometerMagnitude}
            />
            <DetailRow label="Device Tilt" value={deviceTilt} />
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
            <DetailRow label="Availability" value={gyroscopeAvailability} />
            <DetailRow label="Rotation Speed" value={rotationSpeed} />
            <DetailRow label="Stability" value={stabilityState} />
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
            <DetailRow label="Availability" value={magnetometerAvailability} />
            <DetailRow label="Heading" value={compassHeading} />
            <DetailRow label="Direction" value={compassDirection} />
            <DetailRow label="Field Strength" value={magneticFieldStrength} />
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
            <DetailRow label="Availability" value={barometerAvailability} />
            <DetailRow label="Pressure" value={barometricPressure} />
            <DetailRow label="Estimated Altitude" value={estimatedAltitude} />
            <DetailRow label="Pressure Level" value={pressureLevel} />
            <DetailRow label="Sampling Rate" value={samplingRate} />
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
            <DetailRow label="Proximity" value={proximitySensor} />
            <DetailRow label="Ambient Light" value={ambientLightSensor} />
            <DetailRow label="Step Counter" value={stepCounterSensor} />
            <DetailRow label="Rotation Vector" value={rotationVectorSensor} />
            <DetailRow label="Gravity" value={gravitySensor} />
            <DetailRow
              label="Linear Acceleration"
              value={linearAccelerationSensor}
            />
            <DetailRow
              label="Relative Humidity"
              value={relativeHumiditySensor}
            />
            <DetailRow
              label="Ambient Temperature"
              value={ambientTemperatureSensor}
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
    maxHeight: 735,
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
