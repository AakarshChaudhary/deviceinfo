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
  brand: string;
  manufacturer: string;
  modelName: string;
  deviceName: string;
  osName: string;
  osVersion: string;
  osBuildId: string;
  deviceId: string;
  deviceType: string;
  isDevice: string;
  isRooted: string;
  supportedCpuArchitectures: string;
  totalMemory: string;
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
  brand,
  manufacturer,
  modelName,
  deviceName,
  osName,
  osVersion,
  osBuildId,
  deviceId,
  deviceType,
  isDevice,
  isRooted,
  supportedCpuArchitectures,
  totalMemory,
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
              <Text style={styles.headerTitle}>Device Overview</Text>
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
              <Text style={styles.quickStatLabel}>OS</Text>
              <Text style={styles.quickStatValue}>{osName}</Text>
            </View>
            <View style={[styles.quickStatCard, styles.quickStatSecondary]}>
              <Text style={styles.quickStatLabel}>Device Type</Text>
              <Text style={styles.quickStatValue}>{deviceType}</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="hardware-chip"
                size={14}
                color={colors.icon.green}
              />
              <Text style={styles.sectionTitle}>Device identity</Text>
            </View>
            <DetailRow label="Brand" value={brand} />
            <DetailRow label="Manufacturer" value={manufacturer} />
            <DetailRow label="Model Name" value={modelName} />
            <DetailRow label="Device Name" value={deviceName} />
            <DetailRow label="Device ID" value={deviceId} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="phone-portrait-outline"
                size={14}
                color={colors.icon.orange}
              />
              <Text style={styles.sectionTitle}>Platform details</Text>
            </View>
            <DetailRow label="OS Name" value={osName} />
            <DetailRow label="OS Version" value={osVersion} />
            <DetailRow label="OS Build ID" value={osBuildId} />
            <DetailRow label="Physical Device" value={isDevice} />
            <DetailRow label="Rooted" value={isRooted} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="settings-outline"
                size={14}
                color={colors.icon.blue}
              />
              <Text style={styles.sectionTitle}>Hardware details</Text>
            </View>
            <DetailRow
              label="CPU Architectures"
              value={supportedCpuArchitectures}
            />
            <DetailRow label="Total Memory" value={totalMemory} />
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
    maxHeight: 640,
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
