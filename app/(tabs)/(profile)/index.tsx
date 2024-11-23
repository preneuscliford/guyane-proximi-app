import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "@/app/provider/AuthProvider";
import { supabase } from "@/lib/supabase";
import RemoteImage from "@/components/RemoteImage";

const editProfil = () => {
  const navigation = useNavigation();
  interface UserData {
    avatar_url: string;
    username: string;
    // Add other properties as needed
  }
  const [userData, setUserData] = useState<UserData | null>(null);
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
    <SafeAreaView className=" h-full bg-white">
      <StatusBar style="light" backgroundColor="#0a7ea4" />
      <ScrollView className=" h-full">
        <View className=" bg-[#0a7ea4] w-[100%] h-[200px] rounded-br-[80px]">
          <View className="flex-row items-center justify-between px-4 py-6">
            <Text className="  font-medium">Profile</Text>

            <Link href={"/(profile)/editProfile"}>
              <AntDesign name="edit" size={24} color="white" />
            </Link>
          </View>
        </View>
        <View className=" relative justify-center items-center mt-20 px-4 ">
          <View className="absolute bg-slate-50 w-[100%] h-[400px]  px-4 rounded-[10px]">
            <View className=" relative justify-center items-center">
              <RemoteImage
                path={userData?.avatar_url}
                fallback=" avatarImage"
                resizeMode="cover"
                className=" w-28 h-28 rounded-2xl justify-center items-center mt-4"
              />

              <View className=" mt-2 ">
                <Text className=" text-center font-bold">
                  {userData?.username}
                </Text>
                <Text> {session?.user?.email} </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default editProfil;

const styles = StyleSheet.create({});
