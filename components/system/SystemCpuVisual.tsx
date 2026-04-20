import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/color";

type SystemCpuVisualProps = {
  cpuBrandFamily: string;
  coreFrequenciesMhz: number[];
  size?: number;
};

type CoreItem = {
  id: number;
  mhz: number;
  level: number;
};

const CORE_COUNT = 8;

const getCoreList = (frequencies: number[]) => {
  const coreCount = frequencies.length > 0 ? frequencies.length : CORE_COUNT;
  const values = Array.from({ length: coreCount }, (_, index) => {
    const value = frequencies[index] ?? 0;
    return value > 0 ? value : 0;
  });
  const maxValue = Math.max(...values, 1);

  return values.map((mhz, index) => {
    const level = mhz > 0 ? Math.max(mhz / maxValue, 0.12) : 0.08;
    return {
      id: index + 1,
      mhz,
      level,
    } as CoreItem;
  });
};

const getAverageFrequencyText = (cores: CoreItem[]) => {
  const activeCores = cores.filter((core) => core.mhz > 0);
  if (activeCores.length === 0) {
    return "Unknown";
  }

  const total = activeCores.reduce((sum, core) => sum + core.mhz, 0);
  return `${Math.round(total / activeCores.length)} MHz`;
};

export const SystemCpuVisual = ({
  cpuBrandFamily,
  coreFrequenciesMhz,
  size = 250,
}: SystemCpuVisualProps) => {
  const cores = useMemo(
    () => getCoreList(coreFrequenciesMhz),
    [coreFrequenciesMhz],
  );
  const averageFrequency = useMemo(
    () => getAverageFrequencyText(cores),
    [cores],
  );
  const chipLabel = cpuBrandFamily.trim() || "Unknown CPU";
  const chipIconSize = Math.max(42, Math.min(58, size * 0.22));

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View
          style={[
            styles.chipIcon,
            {
              width: chipIconSize,
              height: chipIconSize,
              borderRadius: chipIconSize * 0.22,
            },
          ]}
        >
          <View style={styles.chipIconInner} />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>CPU</Text>
          <Text numberOfLines={1} style={styles.cpuName}>
            {chipLabel}
          </Text>
          <Text
            style={styles.headerMeta}
          >{`${cores.length} cores | Avg ${averageFrequency}`}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {cores.map((core) => (
          <View key={`core-${core.id}`} style={styles.coreCardSlot}>
            <View style={styles.coreCard}>
              <View style={styles.coreRow}>
                <Text style={styles.coreLabel}>{`Core ${core.id}`}</Text>
                <Text style={styles.coreValue}>
                  {core.mhz > 0 ? `${core.mhz} MHz` : "--"}
                </Text>
              </View>

              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${Math.round(core.level * 100)}%`,
                      backgroundColor:
                        core.mhz > 0 ? colors.icon.blue : colors.text.muted,
                      opacity: core.mhz > 0 ? 1 : 0.5,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card.elevated,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipIcon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface.tintIndigo,
    borderWidth: 1,
    borderColor: colors.icon.blue,
    marginRight: 12,
  },
  chipIconInner: {
    width: "48%",
    height: "48%",
    borderRadius: 6,
    backgroundColor: colors.icon.blue,
    opacity: 0.24,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: colors.icon.blue,
  },
  cpuName: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
  },
  headerMeta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.tertiary,
  },
  grid: {
    marginTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  coreCardSlot: {
    width: "50%",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  coreCard: {
    backgroundColor: colors.card.elevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  coreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coreLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.secondary,
  },
  coreValue: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.primary,
  },
  track: {
    marginTop: 8,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.surface.tintBlue,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
