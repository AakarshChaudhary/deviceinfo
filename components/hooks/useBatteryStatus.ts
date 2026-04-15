import * as Battery from "expo-battery";
import { useEffect, useState } from "react";
import { NativeModules, Platform } from "react-native";

type NativeBatteryDetails = {
  manufacturer?: string;
  temperatureC?: number | null;
  voltageMv?: number | null;
  capacityMah?: number | null;
  chargingCurrentMa?: number | null;
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
  return `${Math.round(value)} mV`;
};

const formatCapacity = (value?: number | null) => {
  if (typeof value !== "number" || value < 0) return "N/A";
  return `${Math.round(value)} mAh`;
};

const formatChargingSpeed = (value?: number | null) => {
  if (typeof value !== "number" || value <= 0) return "N/A";
  return `${Math.round(value)} mA`;
};

const formatManufacturer = (manufacturer?: string | null) => {
  if (!manufacturer?.trim()) return "Unknown";
  const trimmed = manufacturer.trim();
  return `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`;
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
  const [batteryHealth, setBatteryHealth] = useState("Unknown");
  const [batteryTechnology, setBatteryTechnology] = useState("Unknown");

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
      setChargingSpeed(formatChargingSpeed(nativeDetails.chargingCurrentMa));
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
    batteryHealth,
    batteryTechnology,
  };
};
