import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";

const communityLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen
        name="notifications"
        options={{
          title: "notification(s)",
          headerStyle: { backgroundColor: "#F5F8FD" },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen name="postDetails" options={{ headerShown: false }} />
    </Stack>
  );
};

export default communityLayout;
