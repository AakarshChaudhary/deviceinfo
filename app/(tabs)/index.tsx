import * as Device from "expo-device";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BatteryRing } from "../../components/battery/BatteryRing";
import { useBatteryStatus } from "../../components/battery/useBatteryStatus";
import { NetworkQuickVisual } from "../../components/network/NetworkQuickVisual";
import { useNetworkStatus } from "../../components/network/useNetworkStatus";
import {colors} from "../../components/theme/color";

const Page = () => {
  const batteryStatus = useBatteryStatus();
  const networkStatus = useNetworkStatus();

  const deviceName =
    Device.deviceName ?? Device.designName ?? Device.modelName ?? "Device";

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi, {deviceName}</Text>
      <View style={styles.cardcontainer}>
        <View style={styles.row}>
          <View style={[styles.card, styles.card1]}>
            <Text style={styles.cardTitle}>Battery</Text>
            <View style={styles.ringCenter}>
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
            <View style={styles.ringCenter}>
              <NetworkQuickVisual
                networkType={networkStatus.quickVisual.networkType}
                statusLabel={networkStatus.quickVisual.statusLabel}
                internetReachability={
                  networkStatus.quickVisual.internetReachability
                }
                wifiSignalQuality={networkStatus.quickVisual.wifiSignalQuality}
                cellularSignalStrength={
                  networkStatus.quickVisual.cellularSignalStrength
                }
              />
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.card, styles.card3]} />
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
    marginTop: "20%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  greeting: {
    alignSelf: "flex-start",
    marginBottom: 16,
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 24,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    padding: 18,
  },
  card1: {
    flex: 1,
    height: 230,
    marginRight: 10,
  },
  ringCenter: {
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
