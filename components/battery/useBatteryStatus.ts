import * as Battery from "expo-battery";
import { useEffect, useState } from "react";
import { NativeModules, Platform } from "react-native";

type NativeBatteryDetails = {
  manufacturer?: string;
  temperatureC?: number | null;
  voltageMv?: number | null;
  capacityMah?: number | null;
  chargingCurrentMa?: number | null;
  chargingType?: string | null;
  batteryHealth?: string | null;
  batteryTechnology?: string | null;
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
) => {
  if (typeof currentMa !== "number" || currentMa <= 0) return "N/A";
  if (typeof capacityMah !== "number" || capacityMah <= 0) return "N/A";
  if (typeof batteryLevel !== "number" || batteryLevel < 0 || batteryLevel >= 1)
    return "N/A";

  const remainingRatio = 1 - batteryLevel;
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
  const [estimatedTime, setEstimatedTime] = useState("N/A");
  const [batteryHealth, setBatteryHealth] = useState("Unknown");
  const [batteryTechnology, setBatteryTechnology] = useState("Unknown");
  const [chargingType, setChargingType] = useState("Battery");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [level, state, lowPowerMode, nativeDetails] = await Promise.all([
        Battery.getBatteryLevelAsync(),
        Battery.getBatteryStateAsync(),
        Battery.isLowPowerModeEnabledAsync(),
        getNativeBatteryDetails(),
      ]);

      if (!mounted) return;

      if (level >= 0) setBatteryLevel(level);
      setBatteryState(state);
      setPowerSaving(lowPowerMode);
      setBatteryManufacturer(formatManufacturer(nativeDetails.manufacturer));
      setBatteryTemperature(formatTemperature(nativeDetails.temperatureC));
      setBatteryVoltage(formatVoltage(nativeDetails.voltageMv));
      setBatteryCapacity(formatCapacity(nativeDetails.capacityMah));
      setChargingSpeed(
        formatChargingSpeed(
          nativeDetails.chargingCurrentMa,
          nativeDetails.capacityMah,
        ),
      );
      setEstimatedTime(
        formatEstimatedTime(
          nativeDetails.chargingCurrentMa,
          nativeDetails.capacityMah,
          level,
        ),
      );
      setChargingType(nativeDetails.chargingType ?? "Unplugged");
      setBatteryHealth(nativeDetails.batteryHealth ?? "Unknown");
      setBatteryTechnology(nativeDetails.batteryTechnology ?? "Unknown");
    };

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
      mounted = false;
      clearInterval(intervalId);
      levelSubscription.remove();
      stateSubscription.remove();
      powerSubscription.remove();
    };
  }, []);

  return {
    batteryLevel,
    batteryState,
    powerSaving,
    batteryManufacturer,
    batteryTemperature,
    batteryVoltage,
    batteryCapacity,
    chargingSpeed,
    estimatedTime,
    chargingType,
    batteryHealth,
    batteryTechnology,
  };
};
