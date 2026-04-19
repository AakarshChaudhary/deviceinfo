import * as Network from "expo-network";
import { useCallback, useEffect, useState } from "react";
import { NativeModules, PermissionsAndroid, Platform } from "react-native";

type NetworkDetails = {
  cellularGeneration?: string | null;
  isConnectionExpensive?: boolean | null;
};

type NativeWifiDetails = {
  ssid?: string | null;
  bssid?: string | null;
  rssi?: number | null;
  linkSpeed?: number | null;
  frequency?: number | null;
  channel?: string | null;
  wifiStandard?: string | null;
  gateway?: string | null;
  subnetMask?: string | null;
  interfaceName?: string | null;
  dns1?: string | null;
  dns2?: string | null;
  leaseDuration?: number | null;
  security?: string | null;
  carrier?: string | null;
  cellularNetworkType?: string | null;
  cellularSignalStrength?: string | null;
  cellularRoaming?: string | null;
  cellularDataState?: string | null;
};

export type NetworkSummaryModel = {
  statusLabel: string;
  networkType: string;
};

export type NetworkQuickVisualModel = {
  networkType: string;
  statusLabel: string;
  internetReachability: string;
  wifiSignalQuality: string;
  cellularSignalStrength: string;
};

export type NetworkCardsModel = {
  summary: NetworkSummaryModel;
  connection: {
    internetReachability: string;
    ipAddress: string;
    subnetMask: string;
    interfaceName: string;
    meteredNetwork: string;
    airplaneMode: string;
  };
  cellular: {
    carrier: string;
    generation: string;
    networkType: string;
    signalStrength: string;
    roaming: string;
    dataState: string;
  };
  wifi: {
    ssid: string;
    security: string;
    bssid: string;
    signalStrength: string;
    signalQuality: string;
    band: string;
    frequency: string;
    channel: string;
    standard: string;
    linkSpeed: string;
    gateway: string;
    dns1: string;
    dns2: string;
    leaseDuration: string;
  };
  errorText: string | null;
};

export type NetworkRefreshModel = {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
};

const wifiInfoModule = NativeModules.WifiInfoModule as {
  getWifiDetails?: () => Promise<NativeWifiDetails>;
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

const formatSignalStrength = (value?: number | null) => {
  if (typeof value !== "number") {
    return "Unknown";
  }
  return `${value} dBm`;
};

const getSignalStrengthLabel = (value?: number | null) => {
  if (typeof value !== "number") {
    return "Unknown";
  }

  if (value >= -60) {
    return "Excellent";
  }

  if (value >= -70) {
    return "Good";
  }

  if (value >= -80) {
    return "Fair";
  }

  return "Weak";
};

const formatLinkSpeed = (value?: number | null) => {
  if (typeof value !== "number") {
    return "Unknown";
  }
  return `${value} Mbps`;
};

const formatLeaseDuration = (value?: number | null) => {
  if (typeof value !== "number" || value <= 0) {
    return "Unknown";
  }
  const hours = value / 3600;
  return `${hours.toFixed(2)} hr`;
};

const formatFrequency = (value?: number | null) => {
  if (typeof value !== "number") {
    return "Unknown";
  }
  return `${(value / 1000).toFixed(2)} GHz`;
};

const getWifiBand = (value?: number | null) => {
  if (typeof value !== "number") return "Unknown";
  if (value >= 5925 && value <= 7125) return "6 GHz";
  if (value >= 5170 && value <= 5895) return "5 GHz";
  if (value >= 2400 && value <= 2500) return "2.4 GHz";
  return "Unknown";
};

const requestWifiPermission = async () => {
  if (Platform.OS !== "android") {
    return false;
  }

  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (granted) {
      return true;
    }

    const permissionResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return permissionResult === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};

const getNativeWifiDetails = async (): Promise<NativeWifiDetails> => {
  if (Platform.OS !== "android" || !wifiInfoModule?.getWifiDetails) {
    return {};
  }

  const hasPermission = await requestWifiPermission();
  if (!hasPermission) {
    return {
      ssid: "Permission required",
      bssid: "Permission required",
      gateway: "Permission required",
    };
  }

  try {
    return await wifiInfoModule.getWifiDetails();
  } catch {
    return {};
  }
};

export const useNetworkStatus = () => {
  const liveState = Network.useNetworkState();
  const [ipAddress, setIpAddress] = useState("Loading...");
  const [airplaneMode, setAirplaneMode] = useState("Checking...");
  const [details, setDetails] = useState<NetworkDetails>({});
  const [wifiSsid, setWifiSsid] = useState("Unknown");
  const [wifiBssid, setWifiBssid] = useState("Unknown");
  const [wifiRssi, setWifiRssi] = useState("Unknown");
  const [wifiSignalQuality, setWifiSignalQuality] = useState("Unknown");
  const [wifiLinkSpeed, setWifiLinkSpeed] = useState("Unknown");
  const [wifiFrequency, setWifiFrequency] = useState("Unknown");
  const [wifiBand, setWifiBand] = useState("Unknown");
  const [wifiChannel, setWifiChannel] = useState("Unknown");
  const [wifiGateway, setWifiGateway] = useState("Unknown");
  const [networkSubnetMask, setNetworkSubnetMask] = useState("Unknown");
  const [networkInterfaceName, setNetworkInterfaceName] = useState("Unknown");
  const [wifiDns1, setWifiDns1] = useState("Unknown");
  const [wifiDns2, setWifiDns2] = useState("Unknown");
  const [wifiLeaseDuration, setWifiLeaseDuration] = useState("Unknown");
  const [wifiStandard, setWifiStandard] = useState("Unknown");
  const [wifiSecurity, setWifiSecurity] = useState("Unknown");
  const [carrier, setCarrier] = useState("Unknown");
  const [cellularNetworkType, setCellularNetworkType] = useState("Unknown");
  const [cellularSignalStrength, setCellularSignalStrength] =
    useState("Unknown");
  const [cellularRoaming, setCellularRoaming] = useState("Unknown");
  const [cellularDataState, setCellularDataState] = useState("Unknown");
  const [refreshing, setRefreshing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const fetchNetworkInfo = useCallback(async () => {
    setErrorText(null);

    try {
      const [state, ip, wifiDetails] = await Promise.all([
        Network.getNetworkStateAsync(),
        Network.getIpAddressAsync(),
        getNativeWifiDetails(),
      ]);

      setIpAddress(ip || "0.0.0.0");

      const stateWithDetails = state as Network.NetworkState & {
        details?: NetworkDetails;
      };
      setDetails(stateWithDetails.details ?? {});
      setWifiSsid(toDisplay(wifiDetails.ssid));
      setWifiBssid(toDisplay(wifiDetails.bssid));
      setWifiRssi(formatSignalStrength(wifiDetails.rssi));
      setWifiSignalQuality(getSignalStrengthLabel(wifiDetails.rssi));
      setWifiLinkSpeed(formatLinkSpeed(wifiDetails.linkSpeed));
      setWifiFrequency(formatFrequency(wifiDetails.frequency));
      setWifiBand(getWifiBand(wifiDetails.frequency));
      setWifiChannel(toDisplay(wifiDetails.channel));
      setWifiGateway(toDisplay(wifiDetails.gateway));
      setNetworkSubnetMask(toDisplay(wifiDetails.subnetMask));
      setNetworkInterfaceName(toDisplay(wifiDetails.interfaceName));
      setWifiDns1(toDisplay(wifiDetails.dns1));
      setWifiDns2(toDisplay(wifiDetails.dns2));
      setWifiLeaseDuration(formatLeaseDuration(wifiDetails.leaseDuration));
      setWifiStandard(toDisplay(wifiDetails.wifiStandard));
      setWifiSecurity(toDisplay(wifiDetails.security));
      setCarrier(toDisplay(wifiDetails.carrier));
      setCellularNetworkType(toDisplay(wifiDetails.cellularNetworkType));
      setCellularSignalStrength(toDisplay(wifiDetails.cellularSignalStrength));
      setCellularRoaming(toDisplay(wifiDetails.cellularRoaming));
      setCellularDataState(toDisplay(wifiDetails.cellularDataState));

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

  const summary: NetworkSummaryModel = {
    statusLabel: liveState.isConnected === true ? "Connected" : "Offline",
    networkType: toDisplay(liveState.type),
  };

  const internetReachability = toDisplay(liveState.isInternetReachable);
  const mobileNetwork =
    liveState.type === Network.NetworkStateType.CELLULAR
      ? formatCellularGeneration(details.cellularGeneration)
      : "N/A";
  const meteredNetwork = toDisplay(details.isConnectionExpensive);

  const quickVisual: NetworkQuickVisualModel = {
    networkType: summary.networkType,
    statusLabel: summary.statusLabel,
    internetReachability,
    wifiSignalQuality,
    cellularSignalStrength,
  };

  const cards: NetworkCardsModel = {
    summary,
    connection: {
      internetReachability,
      ipAddress,
      subnetMask: networkSubnetMask,
      interfaceName: networkInterfaceName,
      meteredNetwork,
      airplaneMode,
    },
    cellular: {
      carrier,
      generation: mobileNetwork,
      networkType: cellularNetworkType,
      signalStrength: cellularSignalStrength,
      roaming: cellularRoaming,
      dataState: cellularDataState,
    },
    wifi: {
      ssid: wifiSsid,
      security: wifiSecurity,
      bssid: wifiBssid,
      signalStrength: wifiRssi,
      signalQuality: wifiSignalQuality,
      band: wifiBand,
      frequency: wifiFrequency,
      channel: wifiChannel,
      standard: wifiStandard,
      linkSpeed: wifiLinkSpeed,
      gateway: wifiGateway,
      dns1: wifiDns1,
      dns2: wifiDns2,
      leaseDuration: wifiLeaseDuration,
    },
    errorText,
  };

  const refresh: NetworkRefreshModel = {
    refreshing,
    onRefresh,
  };

  return {
    quickVisual,
    cards,
    refresh,
  };
};
