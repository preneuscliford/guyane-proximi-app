import { Tabs, usePathname } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AntDesign from "@expo/vector-icons/AntDesign";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../provider/AuthProvider";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TRenderEngineProvider",
]);
export default function TabLayout() {
  const { session } = useAuth();
  const pathname = usePathname();

  const isEditeProfile = pathname.startsWith("/editProfile");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          display: isEditeProfile ? "none" : "flex",
          backgroundColor: "#181F27",
        },
        tabBarActiveTintColor: "#F4F7FC",
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="home"
              size={24}
              color={focused ? "#F4F7FC" : "#858a8d"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="search1"
              size={24}
              color={focused ? "#F4F7FC" : "#858a8d"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Créer",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="add-a-photo"
              size={24}
              color={focused ? "#F4F7FC" : "#858a8d"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(community)"
        options={{
          title: "Communauté",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6
              name="users"
              size={24}
              color={focused ? "#F4F7FC" : "#858a8d"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="profile"
              size={24}
              color={focused ? "#F4F7FC" : "#858a8d"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
