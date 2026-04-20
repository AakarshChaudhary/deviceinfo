import { colors } from "@/components/theme/color";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SystemCards } from "../../components/system/SystemCards";
import { SystemCpuVisual } from "../../components/system/SystemCpuVisual";
import { useSystemStatus } from "../../components/system/useSystemStatus";

const Page = () => {
  const systemStatus = useSystemStatus();

  return (
    <View style={styles.container}>
      <View style={styles.visualContainer}>
        <SystemCpuVisual
          cpuBrandFamily={systemStatus.visual.cpuBrandFamily}
          coreFrequenciesMhz={systemStatus.visual.coreFrequenciesMhz}
        />
      </View>

      <SystemCards cards={systemStatus.cards} refresh={systemStatus.refresh} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: "15%",
  },
  visualContainer: {
    width: "90%",
    alignItems: "center",
    backgroundColor: colors.card.base,
    borderRadius: 22,
    padding: 13,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
