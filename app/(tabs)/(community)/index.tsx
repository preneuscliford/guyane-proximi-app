import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  SegmentedButtons,
} from "react-native-paper";
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
  const [filter, setFilter] = useState<"new" | "trending" | "myPosts">("new"); // Filtre actif
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  // Fonction pour récupérer les posts en fonction du filtre
  async function getPosts() {
    if (!hasMore) return null;
    limit = limit + 4;

    try {
      let query = supabase
        .from("posts")
        .select(
          "*, profiles(id, username, avatar_url), postLikes(*), comments(*)"
        )
        .limit(limit);

      // Appliquer les filtres
      if (filter === "new") {
        query = query.order("created_at", { ascending: false });
      } else if (filter === "trending") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { data, error } = await query
          .gt("created_at", oneWeekAgo.toISOString()) // Posts des 7 derniers jours
          .order("created_at", { ascending: false }); // Ordre initial

        if (error) throw error;

        // Calculer la popularité (likes + commentaires) pour chaque post
        const trendingPosts = (data || []).sort((a, b) => {
          const aPopularity =
            (a.postLikes?.length || 0) + (a.comments?.length || 0);
          const bPopularity =
            (b.postLikes?.length || 0) + (b.comments?.length || 0);
          return bPopularity - aPopularity; // Trier par popularité décroissante
        });

        setPost(trendingPosts);
        setHasMore(trendingPosts.length === limit);
        return; // Les posts avec le plus de likes
      } else if (filter === "myPosts" && user) {
        query = query
          .eq("userId", user.id)
          .order("created_at", { ascending: false });
      }

      const { data, error } = await query;

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
    }
  }

  // Gérer les changements de filtre
  const handleFilterChange = (value: "new" | "trending" | "myPosts") => {
    setFilter(value);
    setHasMore(true); // Réinitialiser la pagination
    limit = 0; // Réinitialiser la limite
    setPost([]); // Réinitialiser les posts
    getPosts(); // Recharger les posts avec le nouveau filtre
  };

  useEffect(() => {
    getPosts();
  }, [filter]);

  console.log(userData);

  return (
    <SafeAreaView className=" h-full bg-ghost-white ">
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <Appbar.Header style={{ backgroundColor: "#F5F8FD" }}>
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
        <TouchableOpacity onPress={() => router.push("/(tabs)/(profile)")}>
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
        ListHeaderComponent={
          <SegmentedButtons
            value={filter}
            onValueChange={handleFilterChange as any}
            buttons={[
              { value: "new", label: "Nouveaux" },
              { value: "trending", label: "Tendances" },
              { value: "myPosts", label: "Mes posts" },
            ]}
            style={{ marginBottom: 16 }}
          />
        }
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
