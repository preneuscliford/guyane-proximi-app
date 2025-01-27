import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/provider/AuthProvider";
import Feather from "@expo/vector-icons/Feather";
import RemoteImage from "./RemoteImage";
import { supabase } from "@/lib/supabase";
import { Searchbar } from "react-native-paper";
import SearchInput from "./SearchInput";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

interface UserData {
  avatar_url: string;
  username: string;
  // Add other properties as needed
}

const Header = () => {
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
    <View className="p-5">
      <View className="flex-row justify-start items-center">
        <View
          className="rounded-sm justify-center items-center bg-slate-500 pl-3"
          style={{ borderRadius: 100, width: 48, height: 48 }}
        >
          {session ? (
            <RemoteImage
              path={userData?.avatar_url}
              fallback={"profil image"}
              className="justify-center items-center"
              style={{ borderRadius: 100, width: 48, height: 48 }}
            ></RemoteImage>
          ) : (
            <View>
              <AntDesign name="user" size={24} color="black" />
            </View>
          )}
        </View>
        {session ? (
          <View style={{ marginLeft: 6 }}>
            <Link href={"/(auth)/login"}>
              <Text className=" text-xl text-rich-black">Bienvenue</Text>
            </Link>
            <Text className=" font-bold text-[20px] text-rich-black">
              {userData?.username}
            </Text>
          </View>
        ) : null}
      </View>
      <SearchInput />
    </View>
  );
};

export default Header;
