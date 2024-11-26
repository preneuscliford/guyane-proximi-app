import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

import { Appbar, Avatar } from "react-native-paper";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import RemoteImage from "@/components/RemoteImage";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/provider/AuthProvider";
import { useRouter } from "expo-router";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";
interface UserData {
  avatar_url: string;
  username: string;
  // Add other properties as needed
}
const index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const router = useRouter();

  const { session } = useAuth();
  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }
      setUserData(data as any);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
    }
  }
  return (
    <SafeAreaView>
      <StatusBar style="light" backgroundColor="#0a7ea4" />
      <Appbar.Header style={{ backgroundColor: "#f1f1f1" }}>
        <Appbar.Content title="Title" />
        <Appbar.Action
          icon="heart-outline"
          size={28}
          onPress={() => router.push("/(community)/notifications")}
        />
        <Appbar.Action
          icon="plus-box-outline"
          size={28}
          onPress={() => router.push("/(community)/create")}
        />
        <TouchableOpacity onPress={() => router.push("/(profile)")}>
          <RemoteImage
            path={userData?.avatar_url}
            fallback="profile image"
            style={{
              width: 28,
              height: 28,
              marginHorizontal: 10,
              borderRadius: 5,
            }}
          />
        </TouchableOpacity>
      </Appbar.Header>
      <View></View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
