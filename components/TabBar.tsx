import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ReactNode } from "react";
import colors from "./theme/color";

type RouteName = "index" | "battery" | "sensors" | "network" | "system";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {

  const icon: Record<RouteName, (focused: boolean, props: any) => ReactNode> = {
    index: (focused: boolean, props: any) => <Ionicons name={focused ? "home" : "home-outline"} size={24} {...props} />,
    battery: (focused: boolean, props: any) => <Ionicons name={focused ? "battery-half" : "battery-half-outline"} size={24} {...props} />,
    sensors: (focused: boolean, props: any) => <Ionicons name={focused ? "pulse" : "pulse-outline"} size={24} {...props} />,
    network: (focused: boolean, props: any) => <Ionicons name={focused ? "wifi" : "wifi-outline"} size={24} {...props} />,
    system: (focused: boolean, props: any) => <Ionicons name={focused ? "cog" : "cog-outline"} size={24} {...props} />,
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const routeName = route.name as RouteName;
        const labelText = typeof label === "string" ? label : route.name;

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {icon[routeName](isFocused, {
              color: isFocused ? colors.tab.active : colors.tab.inactive,
            })}
            <Text style={{ color: isFocused ? colors.tab.active : colors.tab.inactive }}>
              {labelText}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    marginHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 50,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.08,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
