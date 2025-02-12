import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { router, Stack, useNavigation } from "expo-router";
import { useAuth } from "../provider/AuthProvider";

const authLayout = () => {
  const { session } = useAuth();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    if (session) router.push("/");
  }, [session, navigation]);
  return (
    <Stack>
      <Stack.Screen name="signIn" options={{ headerShown: false }} />
      <Stack.Screen name="signUp" options={{ headerShown: false }} />
    </Stack>
  );
};

export default authLayout;

const styles = StyleSheet.create({});
