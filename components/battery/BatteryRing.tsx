import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../theme/color";

type BatteryRingProps = {
  progress: number;
  levelLabel: string;
  statusLabel: string;
  ringColorKey: string;
  isCharging: boolean;
  size: number;
  strokeWidth: number;
  levelFontSize?: number;
  statusFontSize?: number;
};

const AnimatedCircle: any = Animated.createAnimatedComponent(Circle);

export const BatteryRing = ({
  progress,
  levelLabel,
  statusLabel,
  ringColorKey,
  isCharging,
  size,
  strokeWidth,
  levelFontSize,
  statusFontSize,
}: BatteryRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const ringColorMap: Record<string, string> = {
    charging: colors.ring.charging,
    high: colors.ring.high,
    good: colors.ring.good,
    low: colors.ring.low,
    critical: colors.ring.critical,
  };
  const ringColor = ringColorMap[ringColorKey] ?? colors.ring.critical;

  const animatedOffset = useRef(new Animated.Value(strokeDashoffset)).current;

  useEffect(() => {
    Animated.timing(animatedOffset, {
      toValue: strokeDashoffset,
      duration: 220,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [animatedOffset, strokeDashoffset]);

  const pulse = useRef(new Animated.Value(1)).current;
  const pulseAnimRef = useRef<any>(null);

  useEffect(() => {
    if (isCharging) {
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
  }, [isCharging, pulse]);

  const statusText = isCharging ? (
    <Text style={styles.chargingStatus}>
      <Ionicons name="flash" size={statusFontSize ?? 15} /> {statusLabel}
    </Text>
  ) : (
    statusLabel
  );

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
          stroke={colors.ring.stroke}
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
        <Text style={[styles.level, { fontSize: levelFontSize ?? 56 }]}>
          {levelLabel}
        </Text>
        <Text style={[styles.caption, { fontSize: statusFontSize ?? 13 }]}>
          {statusText}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
    color: colors.text.primary,
    letterSpacing: 1,
  },
  caption: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.secondary,
    letterSpacing: 1,
  },
  chargingStatus: {
    flexDirection: "row",
    alignItems: "center",
    color: colors.text.green,
  },
});
