import React from "react";
import { StyleSheet, View } from "react-native";
import { SensorsCards } from "../../components/sensors/SensorsCards";
import { useSensorsStatus } from "../../components/sensors/useSensorsStatus";

const Page = () => {
  const sensorsStatus = useSensorsStatus();

  return (
    <View style={styles.container}>
      <SensorsCards {...sensorsStatus} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
});
