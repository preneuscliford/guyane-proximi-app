import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, useNavigation } from "expo-router";

const eventsLayout = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
      <Stack.Screen
        name="details"
        options={{
          //   headerShown: false,
          title: "",
          headerStyle: { backgroundColor: "#F5F8FD" },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="all"
        options={{
          //   headerShown: false,
          title: "",
          headerStyle: { backgroundColor: "#F5F8FD" },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default eventsLayout;

const styles = StyleSheet.create({});
