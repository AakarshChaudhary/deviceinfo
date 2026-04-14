import { Feather } from "@expo/vector-icons";
import * as Battery from "expo-battery";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle: any = Animated.createAnimatedComponent(Circle);

const SIZE = 260;
const STROKE_WIDTH = 13;

const Page = () => {
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

  return (
    <View style={styles.container}>
      <BatteryRing
        level={batteryLevel}
        size={SIZE}
        strokeWidth={STROKE_WIDTH}
        status={batteryState}
      />
      <Text style={styles.powerSaving}>
        Power saving mode: {powerSaving ? "ENABLED" : "DISABLED"}
      </Text>
    </View>
  );
};

type BatteryRingProps = {
  level: number;
  size: number;
  strokeWidth: number;
  status: Battery.BatteryState;
};

const BatteryRing = ({
  level,
  size,
  strokeWidth,
  status,
}: BatteryRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, level));
  const strokeDashoffset = circumference * (1 - progress);

  const animatedOffset = useRef(new Animated.Value(strokeDashoffset)).current;

  useEffect(() => {
    Animated.timing(animatedOffset, {
      toValue: strokeDashoffset,
      duration: 220,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [animatedOffset, strokeDashoffset]);

  // pulse animation for charging state
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseAnimRef = useRef<any>(null);

  useEffect(() => {
    if (status === Battery.BatteryState.CHARGING) {
      if (!pulseAnimRef.current) {
        pulseAnimRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(pulse, {
              toValue: 1.12,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulse, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
        );
        pulseAnimRef.current.start();
      }
    } else {
      if (pulseAnimRef.current) {
        pulseAnimRef.current.stop();
        pulseAnimRef.current = null;
      }
      pulse.setValue(1);
    }

    return () => {
      if (pulseAnimRef.current) {
        pulseAnimRef.current.stop();
        pulseAnimRef.current = null;
      }
    };
  }, [status, pulse]);

  const label = useMemo(() => `${Math.round(progress * 100)}%`, [progress]);
  const ringColor =
    status === Battery.BatteryState.CHARGING
      ? "#2563EB"
      : progress >= 0.5
        ? "#16A34A"
        : progress >= 0.2
          ? "#EAB308"
          : "#DC2626";

  const statusText = useMemo(() => {
    switch (status) {
      case Battery.BatteryState.CHARGING:
        return <Text style={{ color: "#16A34A" }}><Feather name="zap" /> CHARGING</Text>;
      case Battery.BatteryState.FULL:
        return "FULL";
      case Battery.BatteryState.UNPLUGGED:
        return <Text style={{ color: "#F59E0B" }}>UNPLUGGED</Text>;
      case progress <= 0.2 && Battery.BatteryState.UNKNOWN:
        return "LOW";
      default:
        return "UNKNOWN";
    }
  }, [status, progress]);

  return (
    <Animated.View
      style={[
        styles.ringWrapper,
        { width: size, height: size, transform: [{ scale: pulse }] },
      ]}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={styles.centerContent}>
        <Text style={styles.level}>{label}</Text>
        <Text style={styles.caption}>
          {statusText}
        </Text>
      </View>
    </Animated.View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "35%",
    alignItems: "center",
  },
  ringWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  level: {
    fontSize: 56,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 1,
  },
  caption: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5563",
    letterSpacing: 1,
  },
  powerSaving: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
});
