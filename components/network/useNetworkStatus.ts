import * as Network from "expo-network";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

type NetworkDetails = {
  cellularGeneration?: string | null;
  isConnectionExpensive?: boolean | null;
};

const toDisplay = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const formatCellularGeneration = (value: string | null | undefined) => {
  if (!value) {
    return "N/A";
  }

  const normalized = value.toLowerCase();
  if (
    normalized === "2g" ||
    normalized === "3g" ||
    normalized === "4g" ||
    normalized === "5g"
  ) {
    return normalized.toUpperCase();
  }

  return value.toUpperCase();
};

export const useNetworkStatus = () => {
  const liveState = Network.useNetworkState();
  const [ipAddress, setIpAddress] = useState("Loading...");
  const [airplaneMode, setAirplaneMode] = useState("Checking...");
  const [details, setDetails] = useState<NetworkDetails>({});
  const [refreshing, setRefreshing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const fetchNetworkInfo = useCallback(async () => {
    setErrorText(null);

    try {
      const [state, ip] = await Promise.all([
        Network.getNetworkStateAsync(),
        Network.getIpAddressAsync(),
      ]);

      setIpAddress(ip || "0.0.0.0");

      const stateWithDetails = state as Network.NetworkState & {
        details?: NetworkDetails;
      };
      setDetails(stateWithDetails.details ?? {});

      try {
        const airplane = await Network.isAirplaneModeEnabledAsync();
        setAirplaneMode(airplane ? "Enabled" : "Disabled");
      } catch {
        setAirplaneMode(
          Platform.OS === "android" ? "Unavailable" : "Android only",
        );
      }
    } catch {
      setErrorText("Could not fetch network details right now.");
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNetworkInfo();
    setRefreshing(false);
  }, [fetchNetworkInfo]);

  useEffect(() => {
    fetchNetworkInfo();
  }, [fetchNetworkInfo]);

  const statusLabel = liveState.isConnected === true ? "Connected" : "Offline";
  const networkType = toDisplay(liveState.type);
  const internetReachability = toDisplay(liveState.isInternetReachable);
  const mobileNetwork =
    liveState.type === Network.NetworkStateType.CELLULAR
      ? formatCellularGeneration(details.cellularGeneration)
      : "N/A";
  const meteredNetwork = toDisplay(details.isConnectionExpensive);

  return {
    statusLabel,
    networkType,
    ipAddress,
    airplaneMode,
    internetReachability,
    mobileNetwork,
    meteredNetwork,
    refreshing,
    errorText,
    onRefresh,
  };
};
