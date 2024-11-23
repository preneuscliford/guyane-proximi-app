import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const productLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ headerShown: false }} />
    </Stack>
  );
};

export default productLayout;

const styles = StyleSheet.create({});
