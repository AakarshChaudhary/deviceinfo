import React from "react";
import { StyleSheet, View } from "react-native";

import { BatteryCards } from "../../components/battery/BatteryCards";
import { BatteryRing } from "../../components/battery/BatteryRing";
import { useBatteryStatus } from "../../components/battery/useBatteryStatus";

const Page = () => {
  const batteryStatus = useBatteryStatus();

  return (
    <View style={styles.container}>
      <BatteryRing
        progress={batteryStatus.batteryLevelProgress}
        levelLabel={batteryStatus.batteryLevelLabel}
        statusLabel={batteryStatus.batteryStatusLabel}
        ringColorKey={batteryStatus.batteryRingColorKey}
        isCharging={batteryStatus.isCharging}
        size={250}
        strokeWidth={13}
      />

      <BatteryCards {...batteryStatus} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "25%",
    alignItems: "center",
  },
});
