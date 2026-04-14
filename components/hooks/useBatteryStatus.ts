import * as Battery from "expo-battery";
import { useEffect, useState } from "react";

export const useBatteryStatus = () => {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [batteryState, setBatteryState] = useState<Battery.BatteryState>(
    Battery.BatteryState.UNKNOWN,
  );
  const [powerSaving, setPowerSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [level, state, lowPowerMode] = await Promise.all([
        Battery.getBatteryLevelAsync(),
        Battery.getBatteryStateAsync(),
        Battery.isLowPowerModeEnabledAsync(),
      ]);

      if (!mounted) return;

      if (level >= 0) setBatteryLevel(level);
      setBatteryState(state);
      setPowerSaving(lowPowerMode);
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
  };
};
