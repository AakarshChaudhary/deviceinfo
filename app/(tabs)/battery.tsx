import React from "react";
import { StyleSheet, View } from "react-native";

import { BatteryCards } from "../../components/battery/BatteryCards";
import { BatteryRing } from "../../components/battery/BatteryRing";
import { useBatteryStatus } from "../../components/battery/useBatteryStatus";
import colors from "@/components/theme/color";

const Page = () => {
  const batteryStatus = useBatteryStatus();

  return (
    <View style={styles.container}>
      <View style={styles.ringContainer}>
        <BatteryRing
          progress={batteryStatus.ring.progress}
          levelLabel={batteryStatus.ring.levelLabel}
          statusLabel={batteryStatus.ring.statusLabel}
          ringColorKey={batteryStatus.ring.ringColorKey}
          isCharging={batteryStatus.ring.isCharging}
          size={250}
          strokeWidth={13}
        />
      </View>

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
    marginTop: "15%",
    alignItems: "center",
  },
  ringContainer: {
    width: "90%",
    alignItems: "center",
    backgroundColor: colors.card.base,
    borderRadius: 22,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
