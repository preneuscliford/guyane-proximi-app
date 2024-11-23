import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const profileLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ headerShown: false }} />
    </Stack>
  );
};

export default profileLayout;

const styles = StyleSheet.create({});
