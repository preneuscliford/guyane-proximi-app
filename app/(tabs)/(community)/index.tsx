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

import { ActivityIndicator, Appbar, Avatar } from "react-native-paper";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import RemoteImage from "@/components/RemoteImage";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/provider/AuthProvider";
import { useRouter } from "expo-router";
import PostsCard from "@/components/PostsCard";

let limit = 0;

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

interface Post {
  id: number;
  avatar_url: string;
  username: string;
  body: string;
}
const index = () => {
  const [post, setPost] = useState<Post[]>([]);
  const { session, user, userData } = useAuth();

  console.log(userData);

  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  async function getUserData({ userId }: { userId: string }) {
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url,`)
        .eq("id", userId)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    } finally {
    }
  }

  const handleEvent = async ({ payload }: { payload: any }) => {
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData({ userId: newPost.userId });
      if (res) {
        newPost = { ...newPost, profiles: { ...res } };

        setPost((prev) => [newPost, ...prev]);
      }
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          handleEvent({ payload });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  async function getPosts() {
    if (!hasMore) return null;
    limit = limit + 4;
    try {
      const { data, error, status } = await supabase
        .from("posts")
        .select(
          "*, profiles(id, username, avatar_url), postLikes(*), comments(*)"
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      if (post.length === data.length) {
        setHasMore(false);
      }
      setPost(data as any);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
    }
  }

  return (
    <SafeAreaView className=" h-full bg-ghost-white ">
      <StatusBar style="light" backgroundColor="#0a7ea4" />
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <Appbar.Content title="Title" />
        <Appbar.Action
          icon="heart-outline"
          size={28}
          onPress={() => router.push("/(tabs)/(community)/notifications")}
        />
        <Appbar.Action
          icon="plus-box-outline"
          size={28}
          onPress={() => router.push("/(tabs)/(community)/create")}
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
        onEndReached={getPosts}
        onEndReachedThreshold={0}
        ListFooterComponent={
          hasMore ? (
            <View style={{ marginVertical: post?.length === 0 ? 200 : 30 }}>
              <ActivityIndicator size={"small"} />
            </View>
          ) : (
            <View className="items-center">
              <Text className=" text-lg font-medium">
                {" "}
                Il n'y a plus de posts{" "}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
