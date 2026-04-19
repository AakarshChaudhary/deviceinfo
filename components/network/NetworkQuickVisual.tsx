import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "../theme/color";

type NetworkQuickVisualProps = {
  networkType: string;
  statusLabel: string;
  internetReachability: string;
  wifiSignalQuality: string;
  cellularSignalQuality: string;
  wifiSize?: number;
  barSize?: number;
};

const getWifiStrengthLevel = (quality: string) => {
  const normalized = quality.trim().toLowerCase();
  if (normalized === "excellent") return 4;
  if (normalized === "good") return 3;
  if (normalized === "fair") return 2;
  if (normalized === "weak") return 1;
  return 0;
};

const getCellularStrengthLevel = (
  quality: string,
  internetReachability: string,
  statusLabel: string,
) => {
  if (statusLabel !== "Connected") {
    return 0;
  }

  const normalized = quality.trim().toLowerCase();
  if (normalized === "excellent") return 4;
  if (normalized === "good") return 3;
  if (normalized === "fair") return 2;
  if (normalized === "weak") return 1;

  return internetReachability === "Yes" ? 3 : 1;
};

const getStrengthColor = (level: number) => {
  if (level >= 4) return "#16a34a";
  if (level >= 3) return "#2563eb";
  if (level >= 2) return "#d97706";
  if (level >= 1) return "#dc2626";
  return "#94a3b8";
};

const INACTIVE_COLOR = "#cbd5e1";

const WifiArcStrengthIcon = ({
  level,
  size,
}: {
  level: number;
  size: number;
}) => {
  const activeColor = getStrengthColor(level);
  const arc1Color = level >= 4 ? activeColor : INACTIVE_COLOR;
  const arc2Color = level >= 3 ? activeColor : INACTIVE_COLOR;
  const arc3Color = level >= 2 ? activeColor : INACTIVE_COLOR;
  const dotColor = level >= 1 ? activeColor : INACTIVE_COLOR;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.22363 8.81635C4.34165 7.61742 5.69347 6.66028 7.19569 6.00398C8.69791 5.34768 10.3179 5.0058 11.9572 5.00007C13.5966 4.99435 15.2208 5.32472 16.7276 5.97052C18.2344 6.61632 19.5931 7.56458 20.7195 8.75568"
        stroke={arc1Color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.14941 11.5439C6.89476 10.7446 7.79597 10.1066 8.79745 9.66902C9.79893 9.23148 10.8793 9.00389 11.9721 9.00007C13.065 8.99626 14.1466 9.21651 15.1511 9.64704C16.1556 10.0776 17.0617 10.7094 17.8127 11.5035"
        stroke={arc2Color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.34277 14.5899C8.80861 14.0903 9.37187 13.6915 9.9978 13.418C10.6237 13.1446 11.2995 13.0025 11.9826 13.0001C12.6656 12.9977 13.3419 13.1353 13.9697 13.4044C14.5975 13.6735 15.1637 14.0683 15.633 14.5646"
        stroke={arc3Color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={18} r={1.5} fill={dotColor} />
    </Svg>
  );
};

const CellularSignalBars = ({
  level,
  size,
}: {
  level: number;
  size: number;
}) => {
  const activeColor = getStrengthColor(level);
  const barHeights = [14, 22, 30, 38, 46];
  const filledBars = level === 0 ? 0 : Math.min(5, level + 1);

  return (
    <Svg width={size} height={size} viewBox="0 0 86 64" fill="none">
      {barHeights.map((height, index) => {
        const barIndex = index + 1;
        return (
          <Rect
            key={barIndex}
            x={8 + index * 15}
            y={56 - height}
            width={11}
            height={height}
            rx={5.5}
            fill={barIndex <= filledBars ? activeColor : INACTIVE_COLOR}
          />
        );
      })}
    </Svg>
  );
};

export const NetworkQuickVisual = ({
  networkType,
  statusLabel,
  internetReachability,
  wifiSignalQuality,
  cellularSignalQuality,
  wifiSize = 100,
  barSize = 86,
}: NetworkQuickVisualProps) => {
  const normalizedType = networkType.trim().toLowerCase();
  const isWifi = normalizedType.includes("wifi");

  const strengthLevel = isWifi
    ? getWifiStrengthLevel(wifiSignalQuality)
    : getCellularStrengthLevel(
        cellularSignalQuality,
        internetReachability,
        statusLabel,
      );

  return (
    <View style={styles.container}>
      {isWifi ? (
        <WifiArcStrengthIcon level={strengthLevel} size={wifiSize} />
      ) : (
        <CellularSignalBars level={strengthLevel} size={barSize} />
      )}

      <Text style={styles.primaryText}>{networkType}</Text>
      <Text style={styles.secondaryText}>
        {isWifi ? wifiSignalQuality : cellularSignalQuality}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  primaryText: {
    marginTop: 5,
    fontSize: 25,
    fontWeight: "700",
    color: colors.text.primary,
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.secondary,
  },
});
