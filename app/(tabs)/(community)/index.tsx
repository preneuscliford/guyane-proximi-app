import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";

import { Appbar, Avatar } from "react-native-paper";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import RemoteImage from "@/components/RemoteImage";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/provider/AuthProvider";
import { useRouter } from "expo-router";
import PostsCard from "@/components/PostsCard";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";
interface UserData {
  avatar_url: string;
  username: string;
  // Add other properties as needed
}

interface Post {
  id: number;
  avatar_url: string;
  username: string;
  body: string;
}
const index = () => {
  const [post, setPost] = useState<Post[]>([]);
  const { session, user, userData } = useAuth();

  const router = useRouter();
  useEffect(() => {
    if (session) getPosts();
  }, [session]);

  async function getPosts() {
    try {
      const { data, error, status } = await supabase
        .from("posts")
        .select("*, profiles(id, username, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }
      setPost(data as any);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
    }
  }

  console.log(post);
  return (
    <SafeAreaView className=" h-full bg-white ">
      <StatusBar style="light" backgroundColor="#0a7ea4" />
      <Appbar.Header style={{ backgroundColor: "white" }}>
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
      <FlatList
        data={post}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 10 }}
        keyExtractor={(item) => item?.id.toString() as any}
        renderItem={({ item }) => (
          <PostsCard item={item} router={router} currentUser={userData} />
        )}
      />
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
