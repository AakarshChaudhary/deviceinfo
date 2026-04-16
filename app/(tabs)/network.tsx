import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNetworkStatus } from "../../components/network/useNetworkStatus";
import { colors } from "../../components/theme/color";

const Page = () => {
  const {
    statusLabel,
    networkType,
    ipAddress,
    airplaneMode,
    internetReachability,
    mobileNetwork,
    meteredNetwork,
    refreshing,
    errorText,
    onRefresh,
  } = useNetworkStatus();

  return (
    <View style={styles.container}>
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
                <Text style={styles.quickStatValue}>{statusLabel}</Text>
              </View>
              <View style={[styles.quickStatCard, styles.quickStatSecondary]}>
                <Text style={styles.quickStatLabel}>Network Type</Text>
                <Text style={styles.quickStatValue}>{networkType}</Text>
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
              <DetailRow label="IP Address" value={ipAddress} />
              <DetailRow label="Airplane Mode" value={airplaneMode} />
              <DetailRow
                label="Internet Reachability"
                value={internetReachability}
              />
              <DetailRow label="Mobile Network" value={mobileNetwork} />
              <DetailRow label="Metered Network" value={meteredNetwork} />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
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

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
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
