import React from "react";
import { StyleSheet, View } from "react-native";
import { NetworkCards } from "../../components/network/NetworkCards";
import { NetworkQuickVisual } from "../../components/network/NetworkQuickVisual";
import { useNetworkStatus } from "../../components/network/useNetworkStatus";

const Page = () => {
  const networkStatus = useNetworkStatus();

  return (
    <View style={styles.container}>
      <NetworkQuickVisual
        networkType={networkStatus.quickVisual.networkType}
        statusLabel={networkStatus.quickVisual.statusLabel}
        internetReachability={networkStatus.quickVisual.internetReachability}
        wifiSignalQuality={networkStatus.quickVisual.wifiSignalQuality}
        cellularSignalQuality={networkStatus.quickVisual.cellularSignalQuality}
        wifiSize={150}
        barSize={150}
      />

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
    marginTop: "20%",
  },
});
