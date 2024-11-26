import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, useNavigation } from "expo-router";

const authLayout = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signUp" options={{ headerShown: false }} />
    </Stack>
  );
};

export default authLayout;

const styles = StyleSheet.create({});
