import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const communiyLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen
        name="postDetails"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
};

export default communiyLayout;

const styles = StyleSheet.create({});
