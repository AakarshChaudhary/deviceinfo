import * as Battery from "expo-battery";
import { useCallback, useEffect, useRef, useState } from "react";
import { NativeModules, Platform } from "react-native";

type NativeBatteryDetails = {
  manufacturer?: string;
  temperatureC?: number | null;
  voltageMv?: number | null;
  capacityMah?: number | null;
  chargingCurrentMa?: number | null;
  dischargingCurrentMa?: number | null;
  chargingType?: string | null;
  batteryHealth?: string | null;
  batteryTechnology?: string | null;
};

export type BatteryRingModel = {
  progress: number;
  levelLabel: string;
  statusLabel: string;
  ringColorKey: "charging" | "high" | "good" | "low" | "critical";
  isCharging: boolean;
};

export type BatteryCardsModel = {
  overview: {
    speedLabel: string;
    chargingSpeed: string;
    estimatedTimeLabel: string;
    estimatedTime: string;
  };
  charging: {
    powerSource: string;
    powerSavingStatus: string;
  };
  condition: {
    health: string;
    healthTone: "good" | "warning";
    temperature: string;
    voltage: string;
    estimatedCapacity: string;
  };
  details: {
    manufacturer: string;
    technology: string;
  };
};

export type BatteryRefreshModel = {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
};

const batteryInfoModule = NativeModules.BatteryInfoModule as {
  getBatteryDetails?: () => Promise<NativeBatteryDetails>;
};

const getNativeBatteryDetails = async (): Promise<NativeBatteryDetails> => {
  if (Platform.OS !== "android" || !batteryInfoModule?.getBatteryDetails) {
    return {};
  }

  try {
    return await batteryInfoModule.getBatteryDetails();
  } catch {
    return {};
  }
};

const formatTemperature = (value?: number | null) => {
  if (typeof value !== "number" || value < 0) return "N/A";
  return `${value.toFixed(1)}°C`;
};

const formatVoltage = (value?: number | null) => {
  if (typeof value !== "number" || value < 0) return "N/A";
  return `${(value / 1000).toFixed(2)} V`;
};

const formatCapacity = (value?: number | null) => {
  if (typeof value !== "number" || value < 0) return "N/A";
  return `${Math.round(value)} mAh`;
};

const formatChargingSpeed = (
  currentMa?: number | null,
  capacityMah?: number | null,
) => {
  if (typeof currentMa !== "number" || currentMa <= 0) return "N/A";
  if (typeof capacityMah === "number" && capacityMah > 0) {
    const percentPerHour = (currentMa / capacityMah) * 100;
    if (percentPerHour < 1) {
      const percentPerMin = percentPerHour / 60;
      return `${percentPerMin.toFixed(2)}%/min`;
    }
    return `${percentPerHour.toFixed(1)}%/h`;
  }
  return `${Math.round(currentMa)} mA`;
};

const formatManufacturer = (manufacturer?: string | null) => {
  if (!manufacturer?.trim()) return "Unknown";
  const trimmed = manufacturer.trim();
  return `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`;
};

const formatEstimatedTime = (
  currentMa?: number | null,
  capacityMah?: number | null,
  batteryLevel?: number,
  isCharging?: boolean,
) => {
  if (typeof currentMa !== "number" || currentMa <= 0) return "N/A";
  if (typeof capacityMah !== "number" || capacityMah <= 0) return "N/A";
  if (typeof batteryLevel !== "number" || batteryLevel < 0 || batteryLevel >= 1)
    return "N/A";

  const remainingRatio = isCharging ? 1 - batteryLevel : batteryLevel;
  if (remainingRatio <= 0) return "N/A";

  const remainingMah = capacityMah * remainingRatio;
  const hours = remainingMah / currentMa;
  if (hours <= 0) return "N/A";

  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins === 0 ? `${hrs} h` : `${hrs} h ${mins} m`;
};

const clampBatteryLevel = (level: number) => Math.max(0, Math.min(1, level));

const formatBatteryLevelLabel = (level: number) =>
  `${Math.round(clampBatteryLevel(level) * 100)}%`;

const getBatteryStatusLabel = (state: Battery.BatteryState, level: number) => {
  if (state === Battery.BatteryState.CHARGING) {
    return "CHARGING";
  }

  if (state === Battery.BatteryState.FULL) {
    return "FULL";
  }

  if (state === Battery.BatteryState.UNPLUGGED) {
    return "DISCHARGING";
  }

  return clampBatteryLevel(level) <= 0.2 ? "LOW" : "UNKNOWN";
};

const getBatteryRingColorKey = (
  state: Battery.BatteryState,
  level: number,
): BatteryRingModel["ringColorKey"] => {
  const progress = clampBatteryLevel(level);

  if (state === Battery.BatteryState.CHARGING) {
    return "charging";
  }

  if (progress >= 0.8) {
    return "high";
  }

  if (progress >= 0.5) {
    return "good";
  }

  if (progress >= 0.2) {
    return "low";
  }

  return "critical";
};

const getBatteryHealthTone = (health: string): "good" | "warning" =>
  health.trim().toLowerCase() === "good" ? "good" : "warning";

export const useBatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [batteryState, setBatteryState] = useState<Battery.BatteryState>(
    Battery.BatteryState.UNKNOWN,
  );
  const [powerSaving, setPowerSaving] = useState(false);
  const [batteryManufacturer, setBatteryManufacturer] = useState("Unknown");
  const [batteryTemperature, setBatteryTemperature] = useState("N/A");
  const [batteryVoltage, setBatteryVoltage] = useState("N/A");
  const [batteryCapacity, setBatteryCapacity] = useState("N/A");
  const [chargingSpeed, setChargingSpeed] = useState("N/A");
  const [estimatedTimeLabel, setEstimatedTimeLabel] = useState("Time to Full");
  const [estimatedTime, setEstimatedTime] = useState("N/A");
  const [batteryHealth, setBatteryHealth] = useState("Unknown");
  const [batteryTechnology, setBatteryTechnology] = useState("Unknown");
  const [chargingType, setChargingType] = useState("Battery");
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    const [level, state, lowPowerMode, nativeDetails] = await Promise.all([
      Battery.getBatteryLevelAsync(),
      Battery.getBatteryStateAsync(),
      Battery.isLowPowerModeEnabledAsync(),
      getNativeBatteryDetails(),
    ]);

    if (!mounted.current) return;

    if (level >= 0) setBatteryLevel(level);
    setBatteryState(state);
    setPowerSaving(lowPowerMode);
    setBatteryManufacturer(formatManufacturer(nativeDetails.manufacturer));
    setBatteryTemperature(formatTemperature(nativeDetails.temperatureC));
    setBatteryVoltage(formatVoltage(nativeDetails.voltageMv));
    setBatteryCapacity(formatCapacity(nativeDetails.capacityMah));

    const isCharging =
      state === Battery.BatteryState.CHARGING ||
      state === Battery.BatteryState.FULL;
    const activeCurrentMa = isCharging
      ? nativeDetails.chargingCurrentMa
      : nativeDetails.dischargingCurrentMa;

    setChargingSpeed(
      formatChargingSpeed(activeCurrentMa, nativeDetails.capacityMah),
    );

    setEstimatedTimeLabel(isCharging ? "Time to Full" : "Time to Discharge");
    setEstimatedTime(
      formatEstimatedTime(
        activeCurrentMa,
        nativeDetails.capacityMah,
        level,
        isCharging,
      ),
    );
    setChargingType(nativeDetails.chargingType ?? "Discharging");
    setBatteryHealth(nativeDetails.batteryHealth ?? "Unknown");
    setBatteryTechnology(nativeDetails.batteryTechnology ?? "Unknown");
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    if (mounted.current) {
      setRefreshing(false);
    }
  }, [load]);

  useEffect(() => {
    mounted.current = true;
    load();

    const intervalId = setInterval(() => {
      load();
    }, 15000);

    const levelSubscription = Battery.addBatteryLevelListener(
      ({ batteryLevel: nextLevel }) => {
        if (nextLevel >= 0) setBatteryLevel(nextLevel);
      },
    );

    const stateSubscription = Battery.addBatteryStateListener(
      ({ batteryState: nextState }) => {
        setBatteryState(nextState);
      },
    );

    const powerSubscription = Battery.addLowPowerModeListener(
      ({ lowPowerMode }) => {
        setPowerSaving(lowPowerMode);
      },
    );

    return () => {
      mounted.current = false;
      clearInterval(intervalId);
      levelSubscription.remove();
      stateSubscription.remove();
      powerSubscription.remove();
    };
  }, [load]);

  const batteryLevelProgress = clampBatteryLevel(batteryLevel);
  const batteryLevelLabel = formatBatteryLevelLabel(batteryLevel);
  const batteryStatusLabel = getBatteryStatusLabel(batteryState, batteryLevel);
  const batteryRingColorKey = getBatteryRingColorKey(
    batteryState,
    batteryLevel,
  );
  const powerSavingStatus = powerSaving ? "Active" : "Inactive";
  const batteryHealthTone = getBatteryHealthTone(batteryHealth);
  const isCharging = batteryState === Battery.BatteryState.CHARGING;
  const speedLabel = isCharging ? "Charging Speed" : "Discharging Speed";

  const ring: BatteryRingModel = {
    progress: batteryLevelProgress,
    levelLabel: batteryLevelLabel,
    statusLabel: batteryStatusLabel,
    ringColorKey: batteryRingColorKey,
    isCharging,
  };

  const cards: BatteryCardsModel = {
    overview: {
      speedLabel,
      chargingSpeed,
      estimatedTimeLabel,
      estimatedTime,
    },
    charging: {
      powerSource: chargingType,
      powerSavingStatus,
    },
    condition: {
      health: batteryHealth,
      healthTone: batteryHealthTone,
      temperature: batteryTemperature,
      voltage: batteryVoltage,
      estimatedCapacity: batteryCapacity,
    },
    details: {
      manufacturer: batteryManufacturer,
      technology: batteryTechnology,
    },
  };

  const refresh: BatteryRefreshModel = {
    refreshing,
    onRefresh,
  };

  return {
    ring,
    cards,
    refresh,
  };
};
