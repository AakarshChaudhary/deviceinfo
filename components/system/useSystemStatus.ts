import * as Device from "expo-device";
import { useCallback, useEffect, useState } from "react";

const toDisplay = (value: unknown) => {
  if (value === null || value === undefined) {
    return "Unknown";
  }

  if (typeof value === "string" && value.trim() === "") {
    return "Unknown";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const formatName = (value: string | null | undefined) => {
  if (!value?.trim()) return "Unknown";
  const trimmed = value.trim();
  return `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`;
};

const formatOsName = (value: string | null | undefined) => {
  if (!value?.trim()) return "Unknown";
  const trimmed = value.trim();
  const isFingerprint =
    trimmed.includes("/") &&
    trimmed.includes(":") &&
    trimmed.includes("release-keys");
  if (isFingerprint) {
    return "Android";
  }
  return `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`;
};

const formatDeviceType = (value: Device.DeviceType | null | undefined) => {
  switch (value) {
    case Device.DeviceType.PHONE:
      return "Phone";
    case Device.DeviceType.TABLET:
      return "Tablet";
    case Device.DeviceType.DESKTOP:
      return "Desktop";
    case Device.DeviceType.TV:
      return "TV";
    default:
      return "Unknown";
  }
};

const formatCpuArchitectures = (value: string[] | null | undefined) => {
  if (!value || value.length === 0) {
    return "Unknown";
  }

  return value.join(", ");
};

const formatTotalMemory = (value: number | null | undefined) => {
  if (typeof value !== "number" || value <= 0) {
    return "Unknown";
  }

  const totalMemoryGb = value / (1024 * 1024 * 1024);
  return `${totalMemoryGb.toFixed(2)} GB`;
};

export const useSystemStatus = () => {
  const [brand, setBrand] = useState("Unknown");
  const [manufacturer, setManufacturer] = useState("Unknown");
  const [modelName, setModelName] = useState("Unknown");
  const [deviceName, setDeviceName] = useState("Unknown");
  const [osName, setOsName] = useState("Unknown");
  const [osVersion, setOsVersion] = useState("Unknown");
  const [osBuildId, setOsBuildId] = useState("Unknown");
  const [deviceId, setDeviceId] = useState("Unknown");
  const [deviceType, setDeviceType] = useState("Unknown");
  const [isDevice, setIsDevice] = useState("Unknown");
  const [isRooted, setIsRooted] = useState("Unknown");
  const [supportedCpuArchitectures, setSupportedCpuArchitectures] =
    useState("Unknown");
  const [totalMemory, setTotalMemory] = useState("Unknown");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const rooted =
      typeof Device.isRootedExperimentalAsync === "function"
        ? await Device.isRootedExperimentalAsync().catch(() => null)
        : null;

    const typeValue =
      Device.deviceType ??
      (await Device.getDeviceTypeAsync().catch(() => null));

    setBrand(formatName(Device.brand));
    setManufacturer(formatName(Device.manufacturer));
    setModelName(toDisplay(Device.modelName));
    setDeviceName(toDisplay(Device.deviceName));
    setOsName(formatOsName(Device.osName));
    setOsVersion(toDisplay(Device.osVersion));
    setOsBuildId(toDisplay(Device.osBuildId));

    const rawDeviceId = (Device as any).deviceId;
    setDeviceId(rawDeviceId ? toDisplay(rawDeviceId) : "Unavailable");
    setDeviceType(formatDeviceType(typeValue));
    setIsDevice(toDisplay(Device.isDevice));
    setIsRooted(toDisplay(rooted));
    setSupportedCpuArchitectures(
      formatCpuArchitectures(Device.supportedCpuArchitectures),
    );
    setTotalMemory(formatTotalMemory(Device.totalMemory));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    brand,
    manufacturer,
    modelName,
    deviceName,
    osName,
    osVersion,
    osBuildId,
    deviceId,
    deviceType,
    isDevice,
    isRooted,
    supportedCpuArchitectures,
    totalMemory,
    refreshing,
    onRefresh,
  };
};
