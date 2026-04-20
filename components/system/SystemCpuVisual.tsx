import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Line, Rect, Text as SvgText } from "react-native-svg";
import { colors } from "../theme/color";

type SystemCpuVisualProps = {
  cpuBrandFamily: string;
  coreFrequenciesMhz: number[];
  size?: number;
};

const CORE_COUNT = 8;

const getCorePoints = (size: number, radius: number, coreCount: number) => {
  const center = size / 2;

  return Array.from({ length: coreCount }, (_, index) => {
    const angle = (Math.PI * 2 * index) / coreCount - Math.PI / 2;

    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });
};

export const SystemCpuVisual = ({
  cpuBrandFamily,
  coreFrequenciesMhz,
  size = 250,
}: SystemCpuVisualProps) => {
  const coreCount =
    coreFrequenciesMhz.length > 0 ? coreFrequenciesMhz.length : CORE_COUNT;
  const center = size / 2;
  const chipWidth = size * 0.41;
  const chipHeight = size * 0.24;
  const coreSize = size * 0.21;
  const orbitRadius = center - coreSize / 2 - 1;

  const corePoints = useMemo(
    () => getCorePoints(size, orbitRadius, coreCount),
    [size, orbitRadius, coreCount],
  );

  const label = cpuBrandFamily.trim() || "Unknown CPU";

  return (
    <View style={styles.container}>
      <View style={[styles.graphArea, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={size * 0.34}
            fill={colors.card.base}
          />

          {corePoints.map((point, index) => (
            <G key={`core-${index}`}>
              <Line
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke={colors.border}
                strokeWidth={1.1}
              />
              <Rect
                x={point.x - coreSize / 2}
                y={point.y - coreSize / 2}
                width={coreSize}
                height={coreSize}
                rx={coreSize * 0.2}
                fill={colors.surface.tintBlue}
                stroke={colors.icon.blue}
                strokeWidth={1.4}
              />
              <SvgText
                x={point.x}
                y={point.y + coreSize * 0.1}
                fill={colors.text.primary}
                fontSize={coreSize * 0.18}
                fontWeight="700"
                textAnchor="middle"
              >
                {coreFrequenciesMhz[index] > 0
                  ? `${coreFrequenciesMhz[index]} MHz`
                  : "--"}
              </SvgText>
            </G>
          ))}

          <Rect
            x={center - chipWidth / 2}
            y={center - chipHeight / 2}
            width={chipWidth}
            height={chipHeight}
            rx={16}
            fill={colors.surface.tintIndigo}
            stroke={colors.icon.blue}
            strokeWidth={1.5}
          />
        </Svg>

        <View
          style={[
            styles.chipLabel,
            {
              left: center - chipWidth / 2,
              top: center - chipHeight / 2,
              width: chipWidth,
              height: chipHeight,
            },
          ]}
        >
          <Text style={styles.labelTitle}>CPU</Text>
          <Text numberOfLines={2} style={styles.labelValue}>
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  graphArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  chipLabel: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  labelTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.text.tertiary,
    letterSpacing: 1,
  },
  labelValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
  },
});
