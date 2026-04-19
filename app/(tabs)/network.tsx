import React from "react";
import { StyleSheet, View } from "react-native";
import { NetworkCards } from "../../components/network/NetworkCards";
import { useNetworkStatus } from "../../components/network/useNetworkStatus";

const Page = () => {
  const networkStatus = useNetworkStatus();

  return (
    <View style={styles.container}>
      <NetworkCards
        cards={networkStatus.cards}
        refresh={networkStatus.refresh}
      />
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
