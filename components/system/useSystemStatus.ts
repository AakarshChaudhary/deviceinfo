import * as Device from "expo-device";
import { useCallback, useEffect, useState } from "react";
import { NativeModules, Platform } from "react-native";

type NativeSystemDetails = {
  hardware?: string | null;
  board?: string | null;
  cpuBrandFamily?: string | null;
  coreFrequenciesMhz?: number[] | null;
  codename?: string | null;
  incrementalVersion?: string | null;
  systemUiVersion?: string | null;
  resolution?: string | null;
  densityDpi?: string | null;
  physicalSizeDiagonal?: string | null;
  refreshRate?: string | null;
  rotationOrientation?: string | null;
  displayCutoutSafeArea?: string | null;
  availableRam?: string | null;
  memoryClass?: string | null;
  largeMemoryClass?: string | null;
  numberOfCores?: string | null;
  totalInternalStorage?: string | null;
  freeSpace?: string | null;
  usedPercent?: string | null;
  sdCardCapacity?: string | null;
  deviceSecureLockStatus?: string | null;
  fingerprintSensorPresence?: string | null;
  emulatorDetection?: string | null;
  bootloaderStatus?: string | null;
  secureSettingsAvailability?: string | null;
  localeLanguage?: string | null;
  region?: string | null;
  timezoneId?: string | null;
  clockFormat?: string | null;
};

export type SystemCardsModel = {
  summary: {
    androidVersion: string;
    systemUiVersion: string;
  };
  device: {
    brand: string;
    model: string;
    manufacturer: string;
    name: string;
    product: string;
    hardware: string;
    board: string;
  };
  software: {
    androidVersion: string;
    apiLevel: string;
    codename: string;
    buildId: string;
    buildDisplay: string;
    incrementalVersion: string;
    systemUiVersion: string;
  };
  display: {
    resolution: string;
    densityDpi: string;
    physicalSize: string;
    refreshRate: string;
    orientation: string;
    cutout: string;
  };
  performance: {
    totalRam: string;
    availableRam: string;
    memoryClass: string;
    largeMemoryClass: string;
    cpuAbiList: string;
    numberOfCores: string;
  };
  storage: {
    totalInternalStorage: string;
    freeSpace: string;
    usedPercent: string;
    sdCardCapacity: string;
  };
  security: {
    deviceSecureLockStatus: string;
    fingerprintSensorPresence: string;
    emulatorDetection: string;
    rootDetection: string;
    bootloaderStatus: string;
    secureSettingsAvailability: string;
  };
  regionAndTime: {
    localeLanguage: string;
    region: string;
    timezoneId: string;
    clockFormat: string;
  };
};

export type SystemCpuVisualModel = {
  cpuBrandFamily: string;
  coreFrequenciesMhz: number[];
};

export type SystemRefreshModel = {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
};

const systemInfoModule = NativeModules.SystemInfoModule as {
  getSystemDetails?: () => Promise<NativeSystemDetails>;
};

const getNativeSystemDetails = async (): Promise<NativeSystemDetails> => {
  if (Platform.OS !== "android" || !systemInfoModule?.getSystemDetails) {
    return {};
  }

  try {
    return await systemInfoModule.getSystemDetails();
  } catch {
    return {};
  }
};

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

const toNumberArray = (value: unknown): number[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const parsed = typeof item === "number" ? item : Number(item);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 0;
    }

    return Math.round(parsed);
  });
};

const formatName = (value: string | null | undefined) => {
  if (!value?.trim()) return "Unknown";
  const trimmed = value.trim();
  return `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`;
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
  const [deviceBrand, setDeviceBrand] = useState("Unknown");
  const [deviceModel, setDeviceModel] = useState("Unknown");
  const [deviceManufacturer, setDeviceManufacturer] = useState("Unknown");
  const [deviceName, setDeviceName] = useState("Unknown");
  const [deviceProduct, setDeviceProduct] = useState("Unknown");
  const [deviceHardware, setDeviceHardware] = useState("Unknown");
  const [deviceBoard, setDeviceBoard] = useState("Unknown");

  const [androidVersion, setAndroidVersion] = useState("Unknown");
  const [apiLevel, setApiLevel] = useState("Unknown");
  const [codename, setCodename] = useState("Unknown");
  const [buildId, setBuildId] = useState("Unknown");
  const [buildDisplay, setBuildDisplay] = useState("Unknown");
  const [incrementalVersion, setIncrementalVersion] = useState("Unknown");
  const [systemUiVersion, setSystemUiVersion] = useState("Unknown");

  const [resolution, setResolution] = useState("Unknown");
  const [densityDpi, setDensityDpi] = useState("Unknown");
  const [physicalSize, setPhysicalSize] = useState("Unknown");
  const [refreshRate, setRefreshRate] = useState("Unknown");
  const [rotationOrientation, setRotationOrientation] = useState("Unknown");
  const [displayCutout, setDisplayCutout] = useState("Unknown");

  const [totalRam, setTotalRam] = useState("Unknown");
  const [availableRam, setAvailableRam] = useState("Unknown");
  const [memoryClass, setMemoryClass] = useState("Unknown");
  const [largeMemoryClass, setLargeMemoryClass] = useState("Unknown");
  const [cpuAbiList, setCpuAbiList] = useState("Unknown");
  const [numberOfCores, setNumberOfCores] = useState("Unknown");
  const [cpuBrandFamily, setCpuBrandFamily] = useState("Unknown");
  const [coreFrequenciesMhz, setCoreFrequenciesMhz] = useState<number[]>([]);

  const [totalInternalStorage, setTotalInternalStorage] = useState("Unknown");
  const [freeSpace, setFreeSpace] = useState("Unknown");
  const [usedPercent, setUsedPercent] = useState("Unknown");
  const [sdCardCapacity, setSdCardCapacity] = useState("Unknown");

  const [deviceSecureLockStatus, setDeviceSecureLockStatus] =
    useState("Unknown");
  const [fingerprintSensorPresence, setFingerprintSensorPresence] =
    useState("Unknown");
  const [emulatorDetection, setEmulatorDetection] = useState("Unknown");
  const [rootDetection, setRootDetection] = useState("Unknown");
  const [bootloaderStatus, setBootloaderStatus] = useState("Unknown");
  const [secureSettingsAvailability, setSecureSettingsAvailability] =
    useState("Unknown");

  const [localeLanguage, setLocaleLanguage] = useState("Unknown");
  const [region, setRegion] = useState("Unknown");
  const [timezoneId, setTimezoneId] = useState("Unknown");
  const [clockFormat, setClockFormat] = useState("Unknown");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [rooted, nativeDetails] = await Promise.all([
      typeof Device.isRootedExperimentalAsync === "function"
        ? Device.isRootedExperimentalAsync().catch(() => null)
        : Promise.resolve(null),
      getNativeSystemDetails(),
    ]);

    setDeviceBrand(formatName(Device.brand));
    setDeviceModel(toDisplay(Device.modelName));
    setDeviceManufacturer(formatName(Device.manufacturer));
    setDeviceName(
      toDisplay(Device.deviceName ?? Device.designName ?? Device.modelName),
    );
    setDeviceProduct(toDisplay(Device.productName));
    setDeviceHardware(toDisplay(nativeDetails.hardware));
    setDeviceBoard(toDisplay(nativeDetails.board));

    setAndroidVersion(toDisplay(Device.osVersion));
    setApiLevel(toDisplay(Device.platformApiLevel));
    setCodename(toDisplay(nativeDetails.codename));
    setBuildId(toDisplay(Device.osInternalBuildId));
    setBuildDisplay(toDisplay(Device.osBuildId));
    setIncrementalVersion(toDisplay(nativeDetails.incrementalVersion));
    setSystemUiVersion(toDisplay(nativeDetails.systemUiVersion));

    setResolution(toDisplay(nativeDetails.resolution));
    setDensityDpi(toDisplay(nativeDetails.densityDpi));
    setPhysicalSize(toDisplay(nativeDetails.physicalSizeDiagonal));
    setRefreshRate(toDisplay(nativeDetails.refreshRate));
    setRotationOrientation(toDisplay(nativeDetails.rotationOrientation));
    setDisplayCutout(toDisplay(nativeDetails.displayCutoutSafeArea));

    setTotalRam(formatTotalMemory(Device.totalMemory));
    setAvailableRam(toDisplay(nativeDetails.availableRam));
    setMemoryClass(toDisplay(nativeDetails.memoryClass));
    setLargeMemoryClass(toDisplay(nativeDetails.largeMemoryClass));
    setCpuAbiList(formatCpuArchitectures(Device.supportedCpuArchitectures));
    setNumberOfCores(toDisplay(nativeDetails.numberOfCores));
    setCpuBrandFamily(toDisplay(nativeDetails.cpuBrandFamily));
    setCoreFrequenciesMhz(toNumberArray(nativeDetails.coreFrequenciesMhz));

    setTotalInternalStorage(toDisplay(nativeDetails.totalInternalStorage));
    setFreeSpace(toDisplay(nativeDetails.freeSpace));
    setUsedPercent(toDisplay(nativeDetails.usedPercent));
    setSdCardCapacity(toDisplay(nativeDetails.sdCardCapacity));

    setDeviceSecureLockStatus(toDisplay(nativeDetails.deviceSecureLockStatus));
    setFingerprintSensorPresence(
      toDisplay(nativeDetails.fingerprintSensorPresence),
    );
    setEmulatorDetection(toDisplay(nativeDetails.emulatorDetection));
    setRootDetection(toDisplay(rooted));
    setBootloaderStatus(toDisplay(nativeDetails.bootloaderStatus));
    setSecureSettingsAvailability(
      toDisplay(nativeDetails.secureSettingsAvailability),
    );

    setLocaleLanguage(toDisplay(nativeDetails.localeLanguage));
    setRegion(toDisplay(nativeDetails.region));
    setTimezoneId(toDisplay(nativeDetails.timezoneId));
    setClockFormat(toDisplay(nativeDetails.clockFormat));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    load();
    intervalId = setInterval(() => {
      load();
    }, 2000);

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [load]);

  const cards: SystemCardsModel = {
    summary: {
      androidVersion,
      systemUiVersion,
    },
    device: {
      brand: deviceBrand,
      model: deviceModel,
      manufacturer: deviceManufacturer,
      name: deviceName,
      product: deviceProduct,
      hardware: deviceHardware,
      board: deviceBoard,
    },
    software: {
      androidVersion,
      apiLevel,
      codename,
      buildId,
      buildDisplay,
      incrementalVersion,
      systemUiVersion,
    },
    display: {
      resolution,
      densityDpi,
      physicalSize,
      refreshRate,
      orientation: rotationOrientation,
      cutout: displayCutout,
    },
    performance: {
      totalRam,
      availableRam,
      memoryClass,
      largeMemoryClass,
      cpuAbiList,
      numberOfCores,
    },
    storage: {
      totalInternalStorage,
      freeSpace,
      usedPercent,
      sdCardCapacity,
    },
    security: {
      deviceSecureLockStatus,
      fingerprintSensorPresence,
      emulatorDetection,
      rootDetection,
      bootloaderStatus,
      secureSettingsAvailability,
    },
    regionAndTime: {
      localeLanguage,
      region,
      timezoneId,
      clockFormat,
    },
  };

  const visual: SystemCpuVisualModel = {
    cpuBrandFamily,
    coreFrequenciesMhz,
  };

  const refresh: SystemRefreshModel = {
    refreshing,
    onRefresh,
  };

  return {
    visual,
    cards,
    refresh,
  };
};
