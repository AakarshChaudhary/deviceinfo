import React from "react";
import { StyleSheet, View } from "react-native";
import { NetworkCards } from "../../components/network/NetworkCards";
import { NetworkQuickVisual } from "../../components/network/NetworkQuickVisual";
import { useNetworkStatus } from "../../components/network/useNetworkStatus";
import colors from "@/components/theme/color";

const Page = () => {
  const networkStatus = useNetworkStatus();

  return (
    <View style={styles.container}>
      <View style={styles.networkContainer}>
        <NetworkQuickVisual
          networkType={networkStatus.quickVisual.networkType}
          statusLabel={networkStatus.quickVisual.statusLabel}
          internetReachability={networkStatus.quickVisual.internetReachability}
          wifiSignalQuality={networkStatus.quickVisual.wifiSignalQuality}
          cellularSignalQuality={
            networkStatus.quickVisual.cellularSignalQuality
          }
          wifiSize={185}
          barSize={185}
        />
      </View>

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
    marginTop: "15%",
  },
  networkContainer: {
    width: "90%",
    alignItems: "center",
    backgroundColor: colors.card.base,
    borderRadius: 22,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
