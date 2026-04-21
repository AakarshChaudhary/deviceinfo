import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/color";
import type { SensorsCardsModel } from "./useSensorsStatus";

type SensorsQuickVisualProps = {
  cards: SensorsCardsModel;
  compact?: boolean;
};

type SignalState = {
  label: string;
  level: number;
};

const parseHeadingDegrees = (value: string) => {
  const match = value.match(/-?\d+(\.\d+)?/);
  if (!match) {
    return 0;
  }

  return Number.parseFloat(match[0]);
};

const getMotionSignal = (state: string): SignalState => {
  const normalized = state.trim().toLowerCase();
  if (normalized === "still") {
    return { label: "Calm", level: 0.25 };
  }

  if (normalized === "light movement") {
    return { label: "Aware", level: 0.56 };
  }

  if (normalized === "moving") {
    return { label: "Dynamic", level: 0.92 };
  }

  return { label: "No feed", level: 0.08 };
};

const getStabilitySignal = (state: string): SignalState => {
  const normalized = state.trim().toLowerCase();
  if (normalized === "stable") {
    return { label: "Locked", level: 0.92 };
  }

  if (normalized === "slight movement") {
    return { label: "Responsive", level: 0.58 };
  }

  if (normalized === "rotating") {
    return { label: "Spinning", level: 0.3 };
  }

  return { label: "No feed", level: 0.08 };
};

const getAirSignal = (state: string): SignalState => {
  const normalized = state.trim().toLowerCase();
  if (normalized === "low") {
    return { label: "Light Air", level: 0.4 };
  }

  if (normalized === "normal") {
    return { label: "Balanced", level: 0.78 };
  }

  if (normalized === "high") {
    return { label: "Dense Air", level: 0.6 };
  }

  return { label: "Unknown", level: 0.1 };
};

export const SensorsQuickVisual = ({
  cards,
  compact,
}: SensorsQuickVisualProps) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse]);

  const headingDegrees = useMemo(
    () => parseHeadingDegrees(cards.magnetometer.heading),
    [cards.magnetometer.heading],
  );
  const compassRotationDegrees = useMemo(
    () => headingDegrees - 45,
    [headingDegrees],
  );
  const directionLabel =
    cards.magnetometer.direction.trim().toLowerCase() === "unknown"
      ? "--"
      : cards.magnetometer.direction;

  const dialSize = compact ? 156 : 192;
  const middleSize = compact ? 124 : 154;
  const pulseSize = compact ? 76 : 96;
  const coreSize = compact ? 60 : 76;
  const iconSize = compact ? 18 : 20;
  const labelSize = compact ? 12 : 13;

  const motionSignal = useMemo(
    () => getMotionSignal(cards.accelerometer.motionState),
    [cards.accelerometer.motionState],
  );
  const stabilitySignal = useMemo(
    () => getStabilitySignal(cards.gyroscope.stability),
    [cards.gyroscope.stability],
  );
  const airSignal = useMemo(
    () => getAirSignal(cards.barometer.pressureLevel),
    [cards.barometer.pressureLevel],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.dialWrap, { width: dialSize, height: dialSize }]}>
        <View
          style={[
            styles.dialOuter,
            { width: dialSize, height: dialSize, borderRadius: dialSize / 2 },
          ]}
        />

        <Text
          style={[styles.edgeLabel, styles.edgeTop, { fontSize: labelSize }]}
        >
          N
        </Text>
        <Text
          style={[styles.edgeLabel, styles.edgeRight, { fontSize: labelSize }]}
        >
          E
        </Text>
        <Text
          style={[styles.edgeLabel, styles.edgeBottom, { fontSize: labelSize }]}
        >
          S
        </Text>
        <Text
          style={[styles.edgeLabel, styles.edgeLeft, { fontSize: labelSize }]}
        >
          W
        </Text>

        <Animated.View
          style={[
            styles.centerPulse,
            {
              width: pulseSize,
              height: pulseSize,
              borderRadius: pulseSize / 2,
              transform: [{ scale: pulse }],
            },
          ]}
        />

        <View
          style={[
            styles.centerCore,
            { width: coreSize, height: coreSize, borderRadius: coreSize / 2 },
          ]}
        >
          <Ionicons
            name="navigate"
            size={iconSize}
            color={colors.icon.blue}
            style={{ transform: [{ rotate: `${compassRotationDegrees}deg` }] }}
          />
          <Text style={[styles.directionLabel, { fontSize: labelSize }]}>
            {directionLabel}
          </Text>
        </View>
      </View>

      {!compact && (
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons
                name="walk-outline"
                size={13}
                color={colors.icon.blue}
              />
              <Text style={styles.metricTitle}>Motion</Text>
            </View>
            <Text style={styles.metricValue}>{motionSignal.label}</Text>
            <View style={styles.metricTrack}>
              <View
                style={[
                  styles.metricFill,
                  {
                    width: `${Math.round(motionSignal.level * 100)}%`,
                    backgroundColor: colors.icon.blue,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons
                name="radio-button-on-outline"
                size={13}
                color={colors.icon.green}
              />
              <Text style={styles.metricTitle}>Balance</Text>
            </View>
            <Text style={styles.metricValue}>{stabilitySignal.label}</Text>
            <View style={styles.metricTrack}>
              <View
                style={[
                  styles.metricFill,
                  {
                    width: `${Math.round(stabilitySignal.level * 100)}%`,
                    backgroundColor: colors.icon.green,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons
                name="cloud-outline"
                size={13}
                color={colors.icon.orange}
              />
              <Text style={styles.metricTitle}>Air</Text>
            </View>
            <Text style={styles.metricValue}>{airSignal.label}</Text>
            <View style={styles.metricTrack}>
              <View
                style={[
                  styles.metricFill,
                  {
                    width: `${Math.round(airSignal.level * 100)}%`,
                    backgroundColor: colors.icon.orange,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  dialWrap: {
    width: 192,
    height: 192,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dialOuter: {
    position: "absolute",
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card.elevated,
  },
  edgeLabel: {
    position: "absolute",
    fontSize: 15,
    fontWeight: "800",
    color: colors.text.secondary,
  },
  edgeTop: {
    top: 14,
  },
  edgeRight: {
    right: 14,
  },
  edgeBottom: {
    bottom: 14,
  },
  edgeLeft: {
    left: 14,
  },
  centerPulse: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface.tintIndigo,
  },
  centerCore: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card.elevated,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  directionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  metricsRow: {
    width: "100%",
    marginTop: 14,
    flexDirection: "row",
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card.elevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 8,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.text.tertiary,
    letterSpacing: 0.4,
  },
  metricValue: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: colors.text.primary,
  },
  metricTrack: {
    marginTop: 7,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.surface.tintBlue,
    overflow: "hidden",
  },
  metricFill: {
    height: "100%",
    borderRadius: 999,
  },
});
