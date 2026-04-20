import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BatteryRing } from "../../components/battery/BatteryRing";
import { useBatteryStatus } from "../../components/battery/useBatteryStatus";
import { NetworkQuickVisual } from "../../components/network/NetworkQuickVisual";
import { useNetworkStatus } from "../../components/network/useNetworkStatus";
import { SystemQuickVisual } from "../../components/system/SystemQuickVisual";
import { useSystemStatus } from "../../components/system/useSystemStatus";
import { colors } from "../../components/theme/color";

const Page = () => {
  const batteryStatus = useBatteryStatus();
  const networkStatus = useNetworkStatus();
  const systemStatus = useSystemStatus();

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>
          Hi, {systemStatus.cards.device.name}
        </Text>
      </View>
      <View style={styles.cardcontainer}>
        <View style={styles.row}>
          <View style={[styles.card, styles.card1]}>
            <Text style={styles.cardTitle}>Battery</Text>
            <View style={styles.visualCenter}>
              <BatteryRing
                progress={batteryStatus.ring.progress}
                levelLabel={batteryStatus.ring.levelLabel}
                statusLabel={batteryStatus.ring.statusLabel}
                ringColorKey={batteryStatus.ring.ringColorKey}
                isCharging={batteryStatus.ring.isCharging}
                size={150}
                strokeWidth={7}
                levelFontSize={30}
                statusFontSize={10}
              />
            </View>
          </View>
          <View style={[styles.card, styles.card2]}>
            <Text style={styles.cardTitle}>Network</Text>
            <View style={styles.visualCenter}>
              <NetworkQuickVisual
                networkType={networkStatus.quickVisual.networkType}
                statusLabel={networkStatus.quickVisual.statusLabel}
                internetReachability={
                  networkStatus.quickVisual.internetReachability
                }
                wifiSignalQuality={networkStatus.quickVisual.wifiSignalQuality}
                cellularSignalQuality={
                  networkStatus.quickVisual.cellularSignalQuality
                }
                wifiSize={90}
                barSize={90}
              />
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.card, styles.card3]}>
            <Text style={styles.cardTitle}>System</Text>
            <View style={styles.visualCenter}>
              <SystemQuickVisual
                cpuBrandFamily={systemStatus.visual.cpuBrandFamily}
                coreFrequenciesMhz={systemStatus.visual.coreFrequenciesMhz}
              />
            </View>
          </View>
          <View style={[styles.card, styles.card4]} />
        </View>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    marginTop: 50,
  },
  cardcontainer: {
    flex: 1,
    marginTop: "15%",
  },
  greetingContainer: {
    marginTop: 20,
    backgroundColor: colors.background,
    borderRadius: 22,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  greeting: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 22,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 15,
  },
  card1: {
    flex: 1,
    height: 230,
    marginRight: 10,
  },
  visualCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card2: {
    flex: 1,
    height: 230,
  },
  card3: {
    flex: 1,
    height: 230,
    marginRight: 10,
  },
  card4: {
    flex: 1,
    height: 230,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 10,
  },
});
