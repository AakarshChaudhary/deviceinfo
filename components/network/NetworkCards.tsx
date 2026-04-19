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
  NetworkCardsModel,
  NetworkRefreshModel,
} from "./useNetworkStatus";

type NetworkCardsProps = {
  cards: NetworkCardsModel;
  refresh: NetworkRefreshModel;
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

export const NetworkCards = ({ cards, refresh }: NetworkCardsProps) => {
  const { summary, connection, cellular, wifi, errorText } = cards;

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
              <Text style={styles.headerLabel}>NETWORK DASHBOARD</Text>
              <Text style={styles.headerTitle}>Connectivity Overview</Text>
            </View>
            <View style={styles.headerIconBadge}>
              <Ionicons name="wifi" size={18} color={colors.icon.blue} />
            </View>
          </View>

          <View style={styles.quickStatsRow}>
            <View style={[styles.quickStatCard, styles.quickStatPrimary]}>
              <Text style={styles.quickStatLabel}>Status</Text>
              <Text style={styles.quickStatValue}>{summary.statusLabel}</Text>
            </View>
            <View style={[styles.quickStatCard, styles.quickStatSecondary]}>
              <Text style={styles.quickStatLabel}>Network Type</Text>
              <Text style={styles.quickStatValue}>{summary.networkType}</Text>
            </View>
          </View>

          {errorText ? (
            <View style={styles.errorCard}>
              <Ionicons
                name="alert-circle"
                size={14}
                color={colors.icon.orange}
              />
              <Text style={styles.errorText}>{errorText}</Text>
            </View>
          ) : null}

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="options" size={14} color={colors.icon.green} />
              <Text style={styles.sectionTitle}>Connection details</Text>
            </View>
            <DetailRow
              label="Internet Reachability"
              value={connection.internetReachability}
            />
            <DetailRow label="IP Address" value={connection.ipAddress} />
            <DetailRow label="Subnet Mask" value={connection.subnetMask} />
            <DetailRow
              label="Interface Name"
              value={connection.interfaceName}
            />
            <DetailRow
              label="Metered Network"
              value={connection.meteredNetwork}
            />
            <DetailRow label="Airplane Mode" value={connection.airplaneMode} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cellular" size={14} color={colors.icon.orange} />
              <Text style={styles.sectionTitle}>Cellular details</Text>
            </View>
            <DetailRow label="Carrier" value={cellular.carrier} />
            <DetailRow label="Generation" value={cellular.generation} />
            <DetailRow label="Network Type" value={cellular.networkType} />
            <DetailRow
              label="Signal Strength"
              value={cellular.signalStrength}
            />
            <DetailRow label="Signal Quality" value={cellular.signalQuality} />
            <DetailRow label="Roaming" value={cellular.roaming} />
            <DetailRow label="Data State" value={cellular.dataState} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="wifi-outline"
                size={14}
                color={colors.icon.blue}
              />
              <Text style={styles.sectionTitle}>Wi-Fi details</Text>
            </View>
            <DetailRow label="SSID" value={wifi.ssid} />
            <DetailRow label="Security" value={wifi.security} />
            <DetailRow label="BSSID" value={wifi.bssid} />
            <DetailRow label="Signal Strength" value={wifi.signalStrength} />
            <DetailRow label="Signal Quality" value={wifi.signalQuality} />
            <DetailRow label="Band" value={wifi.band} />
            <DetailRow label="Frequency" value={wifi.frequency} />
            <DetailRow label="Channel" value={wifi.channel} />
            <DetailRow label="Wi-Fi Standard" value={wifi.standard} />
            <DetailRow label="Link Speed" value={wifi.linkSpeed} />
            <DetailRow label="Gateway" value={wifi.gateway} />
            <DetailRow label="DNS 1" value={wifi.dns1} />
            <DetailRow label="DNS 2" value={wifi.dns2} />
            <DetailRow label="Lease Duration" value={wifi.leaseDuration} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardsSection: {
    width: "90%",
    marginTop: 20,
  },
  panel: {
    backgroundColor: colors.card.base,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 495,
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
  errorCard: {
    backgroundColor: colors.surface.tintCyan,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
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
