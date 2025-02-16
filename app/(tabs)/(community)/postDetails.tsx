import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import PostsCard from "@/components/PostsCard";
import CommentSection from "@/components/CommentSection";
import { useAuth } from "@/app/provider/AuthProvider";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import BackAppbar from "@/components/AppBar";
import { Post } from "@/types/postTypes";
import { fetchComments, fetchPostDetails } from "@/lib/postServices";
import Toast, { ToastHandles } from "@/components/Toast";
import { Button } from "react-native";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const { userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const toastRef = useRef<ToastHandles>(null);

  const loadData = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        fetchPostDetails(postId as string),
        fetchComments(postId as string),
      ]);

      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      Alert.alert("Erreur", error as string);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  useEffect(() => {
    loadData();

    const commentsSubscription = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          // ... rest of the code ...
        },
        () => {
          // ... rest of the code ...
        }
      )
      .subscribe();

    // Don't forget to return a cleanup function to unsubscribe from the channel
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
    <SafeAreaView className="flex-1 bg-ghost-white">
      <Toast ref={toastRef} />
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <BackAppbar title="" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#9333EA"
            colors={["#9333EA"]}
          />
        }
      >
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
          onCommentAdded={(success) => {
            if (success) {
              loadData();
              toastRef.current?.show("Commentaire ajouté", "success", 1500);
            } else {
              toastRef.current?.show(
                "Échec de l'ajout du commentaire",
                "error",
                2000
              );
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});

export default PostDetails;
