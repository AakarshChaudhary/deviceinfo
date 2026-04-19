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

type SystemCardsProps = {
  deviceBrand: string;
  deviceModel: string;
  deviceManufacturer: string;
  deviceName: string;
  deviceProduct: string;
  deviceHardware: string;
  deviceBoard: string;

  androidVersion: string;
  apiLevel: string;
  codename: string;
  buildId: string;
  buildDisplay: string;
  incrementalVersion: string;
  systemUiVersion: string;

  resolution: string;
  densityDpi: string;
  physicalSize: string;
  refreshRate: string;
  rotationOrientation: string;
  displayCutout: string;

  totalRam: string;
  availableRam: string;
  memoryClass: string;
  largeMemoryClass: string;
  cpuAbiList: string;
  numberOfCores: string;

  totalInternalStorage: string;
  freeSpace: string;
  usedPercent: string;
  sdCardCapacity: string;

  deviceSecureLockStatus: string;
  fingerprintSensorPresence: string;
  emulatorDetection: string;
  rootDetection: string;
  bootloaderStatus: string;
  secureSettingsAvailability: string;

  localeLanguage: string;
  region: string;
  timezoneId: string;
  clockFormat: string;

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

export const SystemCards = ({
  deviceBrand,
  deviceModel,
  deviceManufacturer,
  deviceName,
  deviceProduct,
  deviceHardware,
  deviceBoard,
  androidVersion,
  apiLevel,
  codename,
  buildId,
  buildDisplay,
  incrementalVersion,
  systemUiVersion,
  resolution,
  densityDpi,
  physicalSize,
  refreshRate,
  rotationOrientation,
  displayCutout,
  totalRam,
  availableRam,
  memoryClass,
  largeMemoryClass,
  cpuAbiList,
  numberOfCores,
  totalInternalStorage,
  freeSpace,
  usedPercent,
  sdCardCapacity,
  deviceSecureLockStatus,
  fingerprintSensorPresence,
  emulatorDetection,
  rootDetection,
  bootloaderStatus,
  secureSettingsAvailability,
  localeLanguage,
  region,
  timezoneId,
  clockFormat,
  refreshing,
  onRefresh,
}: SystemCardsProps) => {
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
              <Text style={styles.headerLabel}>SYSTEM DASHBOARD</Text>
              <Text style={styles.headerTitle}>System Deep Info</Text>
            </View>
            <View style={styles.headerIconBadge}>
              <Ionicons
                name="phone-portrait"
                size={18}
                color={colors.icon.blue}
              />
            </View>
          </View>

          <View style={styles.quickStatsRow}>
            <View style={[styles.quickStatCard, styles.quickStatPrimary]}>
              <Text style={styles.quickStatLabel}>Android Version</Text>
              <Text style={styles.quickStatValue}>{androidVersion}</Text>
            </View>
            <View style={[styles.quickStatCard, styles.quickStatSecondary]}>
              <Text style={styles.quickStatLabel}>Device</Text>
              <Text style={styles.quickStatValue}>{deviceModel}</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="hardware-chip"
                size={14}
                color={colors.icon.green}
              />
              <Text style={styles.sectionTitle}>Device</Text>
            </View>
            <DetailRow label="Brand" value={deviceBrand} />
            <DetailRow label="Model" value={deviceModel} />
            <DetailRow label="Manufacturer" value={deviceManufacturer} />
            <DetailRow label="Device" value={deviceName} />
            <DetailRow label="Product" value={deviceProduct} />
            <DetailRow label="Hardware" value={deviceHardware} />
            <DetailRow label="Board" value={deviceBoard} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="phone-portrait-outline"
                size={14}
                color={colors.icon.orange}
              />
              <Text style={styles.sectionTitle}>Software</Text>
            </View>
            <DetailRow label="Android Version" value={androidVersion} />
            <DetailRow label="API Level" value={apiLevel} />
            <DetailRow label="Codename" value={codename} />
            <DetailRow label="Build ID" value={buildId} />
            <DetailRow label="Build Display" value={buildDisplay} />
            <DetailRow label="Incremental Version" value={incrementalVersion} />
            <DetailRow label="System UI Version" value={systemUiVersion} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="scan-outline"
                size={14}
                color={colors.icon.blue}
              />
              <Text style={styles.sectionTitle}>Display</Text>
            </View>
            <DetailRow label="Resolution" value={resolution} />
            <DetailRow label="Density DPI" value={densityDpi} />
            <DetailRow label="Physical Size / Diagonal" value={physicalSize} />
            <DetailRow label="Refresh Rate" value={refreshRate} />
            <DetailRow label="Orientation" value={rotationOrientation} />
            <DetailRow label="Display Cutout" value={displayCutout} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="speedometer-outline"
                size={14}
                color={colors.icon.yellow}
              />
              <Text style={styles.sectionTitle}>Performance</Text>
            </View>
            <DetailRow label="Total RAM" value={totalRam} />
            <DetailRow label="Available RAM" value={availableRam} />
            <DetailRow label="Memory Class" value={memoryClass} />
            <DetailRow label="Large Memory Class" value={largeMemoryClass} />
            <DetailRow label="CPU ABI List" value={cpuAbiList} />
            <DetailRow label="Number of Cores" value={numberOfCores} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="server-outline"
                size={14}
                color={colors.icon.green}
              />
              <Text style={styles.sectionTitle}>Storage</Text>
            </View>
            <DetailRow
              label="Total Internal Storage"
              value={totalInternalStorage}
            />
            <DetailRow label="Free Space" value={freeSpace} />
            <DetailRow label="Used %" value={usedPercent} />
            <DetailRow label="SD Card Capacity" value={sdCardCapacity} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color={colors.icon.orange}
              />
              <Text style={styles.sectionTitle}>Security</Text>
            </View>
            <DetailRow
              label="Device Secure Lock Status"
              value={deviceSecureLockStatus}
            />
            <DetailRow
              label="Fingerprint Sensor Presence"
              value={fingerprintSensorPresence}
            />
            <DetailRow label="Emulator Detection" value={emulatorDetection} />
            <DetailRow label="Root Detection" value={rootDetection} />
            <DetailRow label="Bootloader Status" value={bootloaderStatus} />
            <DetailRow
              label="Secure Settings Availability"
              value={secureSettingsAvailability}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.icon.blue}
              />
              <Text style={styles.sectionTitle}>Region & Time</Text>
            </View>
            <DetailRow label="Locale / Language" value={localeLanguage} />
            <DetailRow label="Region" value={region} />
            <DetailRow label="Timezone ID" value={timezoneId} />
            <DetailRow label="Clock Format" value={clockFormat} />
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
