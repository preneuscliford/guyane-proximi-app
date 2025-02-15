import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import PostsCard from "@/components/PostsCard";
import CommentSection from "@/components/CommentSection";
import { useAuth } from "@/app/provider/AuthProvider";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import BackAppbar from "@/components/AppBar";

const postDetails = () => {
  const { postId } = useLocalSearchParams();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const { userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const getPostDetails = async () => {
    try {
      // Récupérer le post et ses likes
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select(
          "*, profiles(id, username, avatar_url), postLikes(*), comments(*)"
        )
        .eq("id", postId)
        .single();

      if (postError) throw postError;

      // Récupérer les commentaires
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(
          `
          *,
          profiles (
            username,
            avatar_url
          )
        `
        )
        .eq("postId", postId)
        .order("created_at", { ascending: true });

      if (commentsError) throw commentsError;

      setPost(postData);
      setComments(commentsData || []);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erreur", error.message);
      }
    }
  };

  useEffect(() => {
    getPostDetails();

    // Souscription aux changements des commentaires
    const commentsSubscription = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        () => {
          getPostDetails(); // Recharger les données quand il y a un changement
        }
      )
      .subscribe();

    return () => {
      commentsSubscription.unsubscribe();
    };
  }, [postId]);

  if (loading) {
    return (
      <View className="h-full justify-center items-center">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View>
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <BackAppbar title="" />
      <ScrollView
        className="h-full bg-ghost-white"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        <View className="py-6">
          <PostsCard
            item={post}
            currentUser={userData}
            router={router}
            showMoreIcons={false}
          />
          <CommentSection
            postId={postId as string}
            currentUser={userData}
            comments={comments}
            onCommentAdded={getPostDetails}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default postDetails;

const styles = StyleSheet.create({});
