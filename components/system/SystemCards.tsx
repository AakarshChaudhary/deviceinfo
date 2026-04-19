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
import type { SystemCardsModel, SystemRefreshModel } from "./useSystemStatus";

type SystemCardsProps = {
  cards: SystemCardsModel;
  refresh: SystemRefreshModel;
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

export const SystemCards = ({ cards, refresh }: SystemCardsProps) => {
  const {
    summary,
    device,
    software,
    display,
    performance,
    storage,
    security,
    regionAndTime,
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
              <Text style={styles.headerLabel}>SYSTEM DASHBOARD</Text>
              <Text style={styles.headerTitle}>System Overview</Text>
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
              <Text style={styles.quickStatValue}>
                {summary.androidVersion}
              </Text>
            </View>
            <View style={[styles.quickStatCard, styles.quickStatSecondary]}>
              <Text style={styles.quickStatLabel}>System UI Version</Text>
              <Text style={styles.quickStatValue}>
                {summary.systemUiVersion}
              </Text>
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
            <DetailRow label="Brand" value={device.brand} />
            <DetailRow label="Model" value={device.model} />
            <DetailRow label="Manufacturer" value={device.manufacturer} />
            <DetailRow label="Device" value={device.name} />
            <DetailRow label="Product" value={device.product} />
            <DetailRow label="Hardware" value={device.hardware} />
            <DetailRow label="Board" value={device.board} />
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
            <DetailRow label="API Level" value={software.apiLevel} />
            <DetailRow label="Codename" value={software.codename} />
            <DetailRow label="Build ID" value={software.buildId} />
            <DetailRow label="Build Display" value={software.buildDisplay} />
            <DetailRow
              label="Incremental Version"
              value={software.incrementalVersion}
            />
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
            <DetailRow label="Resolution" value={display.resolution} />
            <DetailRow label="Density DPI" value={display.densityDpi} />
            <DetailRow
              label="Physical Size / Diagonal"
              value={display.physicalSize}
            />
            <DetailRow label="Refresh Rate" value={display.refreshRate} />
            <DetailRow label="Orientation" value={display.orientation} />
            <DetailRow label="Display Cutout" value={display.cutout} />
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
            <DetailRow label="Total RAM" value={performance.totalRam} />
            <DetailRow label="Available RAM" value={performance.availableRam} />
            <DetailRow label="Memory Class" value={performance.memoryClass} />
            <DetailRow
              label="Large Memory Class"
              value={performance.largeMemoryClass}
            />
            <DetailRow label="CPU ABI List" value={performance.cpuAbiList} />
            <DetailRow
              label="Number of Cores"
              value={performance.numberOfCores}
            />
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
              value={storage.totalInternalStorage}
            />
            <DetailRow label="Free Space" value={storage.freeSpace} />
            <DetailRow label="Used %" value={storage.usedPercent} />
            <DetailRow
              label="SD Card Capacity"
              value={storage.sdCardCapacity}
            />
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
              value={security.deviceSecureLockStatus}
            />
            <DetailRow
              label="Fingerprint Sensor Presence"
              value={security.fingerprintSensorPresence}
            />
            <DetailRow
              label="Emulator Detection"
              value={security.emulatorDetection}
            />
            <DetailRow label="Root Detection" value={security.rootDetection} />
            <DetailRow
              label="Bootloader Status"
              value={security.bootloaderStatus}
            />
            <DetailRow
              label="Secure Settings Availability"
              value={security.secureSettingsAvailability}
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
            <DetailRow
              label="Locale / Language"
              value={regionAndTime.localeLanguage}
            />
            <DetailRow label="Region" value={regionAndTime.region} />
            <DetailRow label="Timezone ID" value={regionAndTime.timezoneId} />
            <DetailRow label="Clock Format" value={regionAndTime.clockFormat} />
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
