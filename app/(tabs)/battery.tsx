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
        progress={batteryStatus.ring.progress}
        levelLabel={batteryStatus.ring.levelLabel}
        statusLabel={batteryStatus.ring.statusLabel}
        ringColorKey={batteryStatus.ring.ringColorKey}
        isCharging={batteryStatus.ring.isCharging}
        size={250}
        strokeWidth={13}
      />

      <BatteryCards
        cards={batteryStatus.cards}
        refresh={batteryStatus.refresh}
      />
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
