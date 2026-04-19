import Accelerometer from "expo-sensors/build/Accelerometer";
import Barometer from "expo-sensors/build/Barometer";
import Gyroscope from "expo-sensors/build/Gyroscope";
import Magnetometer from "expo-sensors/build/Magnetometer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NativeModules, Platform } from "react-native";

type VectorReading = {
  x: number;
  y: number;
  z: number;
};

type PressureReading = {
  pressure: number;
};

type NativeExtraSensorDetails = {
  proximitySensor?: string | null;
  ambientLightSensor?: string | null;
  stepCounterSensor?: string | null;
  rotationVectorSensor?: string | null;
  gravitySensor?: string | null;
  linearAccelerationSensor?: string | null;
  relativeHumiditySensor?: string | null;
  ambientTemperatureSensor?: string | null;
};

const sensorInfoModule = NativeModules.SensorInfoModule as {
  getSensorDetails?: () => Promise<NativeExtraSensorDetails>;
};

const getNativeSensorDetails = async (): Promise<NativeExtraSensorDetails> => {
  if (Platform.OS !== "android" || !sensorInfoModule?.getSensorDetails) {
    return {};
  }

  try {
    return await sensorInfoModule.getSensorDetails();
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

  return String(value);
};

const shortenAmbientLightLabel = (label: string) => {
  const cleaned = label
    .replace(/\s+/g, " ")
    .replace(/Non-wakeup|Non wakeup|Non - wakeup|NonWakeup|Wakeup/gi, "")
    .trim();

  if (/Ambient Light/i.test(cleaned)) {
    return cleaned
      .replace(/Light\s+Ambient\s+Light\s+Sensor/gi, "Ambient Light")
      .replace(/Ambient\s+Light\s+Sensor/gi, "Ambient Light")
      .replace(/Light\s+Sensor/gi, "Light")
      .replace(/Sensor$/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  return cleaned;
};

const SENSOR_INTERVAL_MS = 500;

const formatValue = (value?: number | null, unit = "", decimals = 3) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Unknown";
  }

  const fixed = value.toFixed(decimals);
  return unit ? `${fixed} ${unit}` : fixed;
};

const formatMagnitude = (
  reading: VectorReading | null,
  unit: string,
  decimals = 3,
) => {
  const magnitude = getMagnitude(reading);
  if (magnitude === null) {
    return "Unknown";
  }

  return `${magnitude.toFixed(decimals)} ${unit}`;
};

const getMagnitude = (reading: VectorReading | null) => {
  if (!reading) {
    return null;
  }

  return Math.sqrt(
    reading.x * reading.x + reading.y * reading.y + reading.z * reading.z,
  );
};

const getMotionState = (reading: VectorReading | null) => {
  const magnitude = getMagnitude(reading);
  if (magnitude === null) {
    return "Unknown";
  }

  const movementDelta = Math.abs(magnitude - 1);
  if (movementDelta < 0.03) {
    return "Still";
  }

  if (movementDelta < 0.12) {
    return "Light movement";
  }

  return "Moving";
};

const getDeviceTilt = (reading: VectorReading | null) => {
  if (!reading) {
    return "Unknown";
  }

  const pitch =
    Math.atan2(
      -reading.x,
      Math.sqrt(reading.y * reading.y + reading.z * reading.z),
    ) *
    (180 / Math.PI);
  const roll = Math.atan2(reading.y, reading.z) * (180 / Math.PI);

  return `Pitch ${pitch.toFixed(1)} deg, Roll ${roll.toFixed(1)} deg`;
};

const getRotationSpeed = (reading: VectorReading | null) => {
  const magnitude = getMagnitude(reading);
  if (magnitude === null) {
    return "Unknown";
  }

  const degPerSecond = magnitude * (180 / Math.PI);
  return `${degPerSecond.toFixed(1)} deg/s`;
};

const getStabilityState = (reading: VectorReading | null) => {
  const magnitude = getMagnitude(reading);
  if (magnitude === null) {
    return "Unknown";
  }

  if (magnitude < 0.05) {
    return "Stable";
  }

  if (magnitude < 0.25) {
    return "Slight movement";
  }

  return "Rotating";
};

const getHeadingDegrees = (reading: VectorReading | null) => {
  if (!reading) {
    return null;
  }

  return (Math.atan2(reading.y, reading.x) * (180 / Math.PI) + 360) % 360;
};

const formatHeading = (heading: number | null) => {
  if (heading === null) {
    return "Unknown";
  }

  return `${heading.toFixed(0)} deg`;
};

const getCardinalDirection = (heading: number | null) => {
  if (heading === null) {
    return "Unknown";
  }

  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const directionIndex = Math.round(heading / 45) % directions.length;
  return directions[directionIndex];
};

const getEstimatedAltitude = (pressure?: number | null) => {
  if (typeof pressure !== "number" || Number.isNaN(pressure)) {
    return "Unknown";
  }

  const altitude = 44330 * (1 - Math.pow(pressure / 1013.25, 1 / 5.255));
  return `${altitude.toFixed(1)} m`;
};

const getPressureLevel = (pressure?: number | null) => {
  if (typeof pressure !== "number" || Number.isNaN(pressure)) {
    return "Unknown";
  }

  if (pressure < 980) {
    return "Low";
  }

  if (pressure > 1030) {
    return "High";
  }

  return "Normal";
};

const isNativeSensorAvailable = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  const unavailableLabels = [
    "unknown",
    "not available",
    "unavailable",
    "no sensor",
    "none",
    "n/a",
  ];

  return !unavailableLabels.includes(normalized);
};

const toAvailability = (isAvailable: boolean) =>
  isAvailable ? "Available" : "Not available";

export const useSensorsStatus = () => {
  const [accelerometer, setAccelerometer] = useState<VectorReading | null>(
    null,
  );
  const [gyroscope, setGyroscope] = useState<VectorReading | null>(null);
  const [magnetometer, setMagnetometer] = useState<VectorReading | null>(null);
  const [barometer, setBarometer] = useState<PressureReading | null>(null);

  const [accelerometerAvailability, setAccelerometerAvailability] =
    useState("Checking...");
  const [gyroscopeAvailability, setGyroscopeAvailability] =
    useState("Checking...");
  const [magnetometerAvailability, setMagnetometerAvailability] =
    useState("Checking...");
  const [barometerAvailability, setBarometerAvailability] =
    useState("Checking...");

  const [proximitySensor, setProximitySensor] = useState("Unknown");
  const [ambientLightSensor, setAmbientLightSensor] = useState("Unknown");
  const [stepCounterSensor, setStepCounterSensor] = useState("Unknown");
  const [rotationVectorSensor, setRotationVectorSensor] = useState("Unknown");
  const [gravitySensor, setGravitySensor] = useState("Unknown");
  const [linearAccelerationSensor, setLinearAccelerationSensor] =
    useState("Unknown");
  const [relativeHumiditySensor, setRelativeHumiditySensor] =
    useState("Unknown");
  const [ambientTemperatureSensor, setAmbientTemperatureSensor] =
    useState("Unknown");

  const [refreshing, setRefreshing] = useState(false);

  const loadAvailability = useCallback(async () => {
    const [
      isAccelerometerAvailable,
      isGyroscopeAvailable,
      isMagnetometerAvailable,
      isBarometerAvailable,
      nativeSensorDetails,
    ] = await Promise.all([
      Accelerometer.isAvailableAsync().catch(() => false),
      Gyroscope.isAvailableAsync().catch(() => false),
      Magnetometer.isAvailableAsync().catch(() => false),
      Barometer.isAvailableAsync().catch(() => false),
      getNativeSensorDetails(),
    ]);

    setAccelerometerAvailability(toAvailability(isAccelerometerAvailable));
    setGyroscopeAvailability(toAvailability(isGyroscopeAvailable));
    setMagnetometerAvailability(toAvailability(isMagnetometerAvailable));
    setBarometerAvailability(toAvailability(isBarometerAvailable));

    setProximitySensor(toDisplay(nativeSensorDetails.proximitySensor));
    setAmbientLightSensor(
      shortenAmbientLightLabel(
        toDisplay(nativeSensorDetails.ambientLightSensor),
      ),
    );
    setStepCounterSensor(toDisplay(nativeSensorDetails.stepCounterSensor));
    setRotationVectorSensor(
      toDisplay(nativeSensorDetails.rotationVectorSensor),
    );
    setGravitySensor(toDisplay(nativeSensorDetails.gravitySensor));
    setLinearAccelerationSensor(
      toDisplay(nativeSensorDetails.linearAccelerationSensor),
    );
    setRelativeHumiditySensor(
      toDisplay(nativeSensorDetails.relativeHumiditySensor),
    );
    setAmbientTemperatureSensor(
      toDisplay(nativeSensorDetails.ambientTemperatureSensor),
    );
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAvailability();
    setRefreshing(false);
  }, [loadAvailability]);

  useEffect(() => {
    let isMounted = true;

    Accelerometer.setUpdateInterval(SENSOR_INTERVAL_MS);
    Gyroscope.setUpdateInterval(SENSOR_INTERVAL_MS);
    Magnetometer.setUpdateInterval(SENSOR_INTERVAL_MS);
    Barometer.setUpdateInterval(SENSOR_INTERVAL_MS);

    const accelerometerSubscription = Accelerometer.addListener((reading) => {
      if (isMounted) {
        setAccelerometer(reading);
      }
    });

    const gyroscopeSubscription = Gyroscope.addListener((reading) => {
      if (isMounted) {
        setGyroscope(reading);
      }
    });

    const magnetometerSubscription = Magnetometer.addListener((reading) => {
      if (isMounted) {
        setMagnetometer(reading);
      }
    });

    const barometerSubscription = Barometer.addListener((reading) => {
      if (isMounted) {
        setBarometer(reading);
      }
    });

    loadAvailability();

    return () => {
      isMounted = false;
      accelerometerSubscription.remove();
      gyroscopeSubscription.remove();
      magnetometerSubscription.remove();
      barometerSubscription.remove();
    };
  }, [loadAvailability]);

  const availableCount = useMemo(() => {
    const expoCounts = [
      accelerometerAvailability,
      gyroscopeAvailability,
      magnetometerAvailability,
      barometerAvailability,
    ].filter((value) => value === "Available").length;

    const nativeCounts = [
      proximitySensor,
      ambientLightSensor,
      stepCounterSensor,
      rotationVectorSensor,
      gravitySensor,
      linearAccelerationSensor,
      relativeHumiditySensor,
      ambientTemperatureSensor,
    ].filter(isNativeSensorAvailable).length;

    return expoCounts + nativeCounts;
  }, [
    accelerometerAvailability,
    gyroscopeAvailability,
    magnetometerAvailability,
    barometerAvailability,
    proximitySensor,
    ambientLightSensor,
    stepCounterSensor,
    rotationVectorSensor,
    gravitySensor,
    linearAccelerationSensor,
    relativeHumiditySensor,
    ambientTemperatureSensor,
  ]);

  const totalSensors = 12;
  const statusLabel =
    availableCount === totalSensors
      ? "All Online"
      : availableCount === 0
        ? "Unavailable"
        : "Partial";
  const headingDegrees = getHeadingDegrees(magnetometer);

  return {
    statusLabel,
    availableSensors: `${availableCount}/${totalSensors}`,
    samplingRate: `${SENSOR_INTERVAL_MS} ms`,

    accelerometerAvailability,
    motionState: getMotionState(accelerometer),
    deviceTilt: getDeviceTilt(accelerometer),
    accelerometerMagnitude: formatMagnitude(accelerometer, "g"),

    gyroscopeAvailability,
    rotationSpeed: getRotationSpeed(gyroscope),
    stabilityState: getStabilityState(gyroscope),

    magnetometerAvailability,
    compassHeading: formatHeading(headingDegrees),
    compassDirection: getCardinalDirection(headingDegrees),
    magneticFieldStrength: formatMagnitude(magnetometer, "uT"),

    barometerAvailability,
    barometricPressure: formatValue(barometer?.pressure, "hPa", 2),
    estimatedAltitude: getEstimatedAltitude(barometer?.pressure),
    pressureLevel: getPressureLevel(barometer?.pressure),

    proximitySensor,
    ambientLightSensor,
    stepCounterSensor,
    rotationVectorSensor,
    gravitySensor,
    linearAccelerationSensor,
    relativeHumiditySensor,
    ambientTemperatureSensor,

    refreshing,
    onRefresh,
  };
};
