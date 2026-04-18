import React from "react";
import { StyleSheet, View } from "react-native";
import { SystemCards } from "../../components/system/SystemCards";
import { useSystemStatus } from "../../components/system/useSystemStatus";

const Page = () => {
  const systemStatus = useSystemStatus();

  return (
    <View style={styles.container}>
      <SystemCards {...systemStatus} />
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
