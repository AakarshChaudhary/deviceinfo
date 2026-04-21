import React from "react";
import { StyleSheet, View } from "react-native";
import { SensorsCards } from "../../components/sensors/SensorsCards";
import { SensorsQuickVisual } from "../../components/sensors/SensorsQuickVisual";
import { useSensorsStatus } from "../../components/sensors/useSensorsStatus";
import { colors } from "../../components/theme/color";

const Page = () => {
  const sensorsStatus = useSensorsStatus();

  return (
    <View style={styles.container}>
      <View style={styles.visualContainer}>
        <SensorsQuickVisual cards={sensorsStatus.cards} />
      </View>

      <SensorsCards
        cards={sensorsStatus.cards}
        refresh={sensorsStatus.refresh}
      />
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
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
