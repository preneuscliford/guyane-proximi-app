import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/app/provider/AuthProvider";

const profileLayout = () => {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (!session) router.push("/(auth)/signUp");
  }, [session]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ headerShown: false }} />
    </Stack>
  );
};

export default profileLayout;

const styles = StyleSheet.create({});
