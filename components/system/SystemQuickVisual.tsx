import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/color";

type SystemQuickVisualProps = {
  cpuBrandFamily: string;
  coreFrequenciesMhz: number[];
};

type CoreBar = {
  id: number;
  mhz: number;
  height: number;
};

const DEFAULT_CORE_COUNT = 8;

const getCoreBars = (frequencies: number[]): CoreBar[] => {
  const coreCount =
    frequencies.length > 0
      ? Math.min(frequencies.length, 8)
      : DEFAULT_CORE_COUNT;
  const values = Array.from({ length: coreCount }, (_, index) => {
    const value = frequencies[index] ?? 0;
    return value > 0 ? value : 0;
  });
  const maxValue = Math.max(...values, 1);

  return values.map((mhz, index) => {
    const normalized = mhz > 0 ? mhz / maxValue : 0;
    return {
      id: index + 1,
      mhz,
      height: mhz > 0 ? 14 + normalized * 32 : 10,
    };
  });
};

const getAverageFrequency = (cores: CoreBar[]) => {
  const active = cores.filter((core) => core.mhz > 0);
  if (active.length === 0) {
    return "Idle";
  }

  const total = active.reduce((sum, core) => sum + core.mhz, 0);
  return `${Math.round(total / active.length)} MHz`;
};

const toCpuLabel = (value: string) => {
  const text = value.trim();
  if (!text || text.toLowerCase() === "unknown") {
    return "CPU";
  }

  return text;
};

export const SystemQuickVisual = ({
  cpuBrandFamily,
  coreFrequenciesMhz,
}: SystemQuickVisualProps) => {
  const bars = useMemo(
    () => getCoreBars(coreFrequenciesMhz),
    [coreFrequenciesMhz],
  );
  const activeCores = useMemo(
    () => bars.filter((item) => item.mhz > 0).length,
    [bars],
  );
  const averageFrequency = useMemo(() => getAverageFrequency(bars), [bars]);
  const chipLabel = toCpuLabel(cpuBrandFamily);

  return (
    <View style={styles.container}>
      <View style={styles.visualBlock}>
        <View style={styles.chipFrame}>
          <View style={styles.chipInner}>
            <View style={styles.chipCore} />
          </View>
        </View>

        <View style={styles.barsRow}>
          {bars.map((core) => (
            <View key={`core-${core.id}`} style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: core.height,
                    opacity: core.mhz > 0 ? 1 : 0.28,
                    backgroundColor:
                      core.mhz > 0 ? colors.icon.blue : colors.text.muted,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </View>

      <Text numberOfLines={1} style={styles.cpuName}>
        {chipLabel}
      </Text>
      <Text
        style={styles.metaText}
      >{`${activeCores}/${bars.length} cores | Avg ${averageFrequency}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  visualBlock: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 7,
    paddingHorizontal: 8,
  },
  chipFrame: {
    width: 54,
    height: 54,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.icon.blue,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card.elevated,
    marginBottom: 15,
  },
  chipInner: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.tintBlue,
  },
  chipCore: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.icon.blue,
  },
  barsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 48,
  },
  barTrack: {
    width: 9,
    height: 46,
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: colors.surface.tintBlue,
  },
  barFill: {
    width: "100%",
    borderRadius: 5,
  },
  cpuName: {
    width: "100%",
    marginTop: 3,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
  },
  metaText: {
    marginTop: 2,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: colors.text.secondary,
  },
});
