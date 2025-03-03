import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Stack, useNavigation } from "expo-router";

const servicesLayout = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="all"
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: "#F5F8FD" },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: "#F5F8FD" },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="category/[id]"
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: "#F5F8FD" },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

export default servicesLayout;

const styles = StyleSheet.create({});
