import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Button,
} from "react-native";
import { supabase } from "@/lib/supabase";
import moment from "moment";
import RemoteImage from "./RemoteImage";
import Feather from "@expo/vector-icons/Feather";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import Burnt from "burnt"; // Assurez-vous d'installer la librairie
import Toast, { ToastHandles } from "./Toast";
import { SafeAreaView } from "react-native-safe-area-context";

interface Comment {
  id: number;
  text: string;
  created_at: string;
  userId: string;
  postId: number;
  profiles: {
    username: string;
    avatar_url: string;
    full_name: string;
  };
}

interface CommentSectionProps {
  postId: string;
  currentUser: any;
  comments: Comment[];
  onCommentAdded: (success: boolean) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  currentUser,
  comments,
  onCommentAdded,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputScale = new Animated.Value(1);
  const router = useRouter();

  const animateInput = () => {
    Animated.sequence([
      Animated.timing(inputScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(inputScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser?.id || isSubmitting) return;

    setIsSubmitting(true);
    animateInput();

    try {
      const { error } = await supabase.from("comment").insert({
        text: newComment.trim(),
        postId: parseInt(postId, 10),
        userId: currentUser.id,
      });

      if (error) {
        onCommentAdded(false); // Signal d'échec
        throw error;
      }

      setNewComment("");
      onCommentAdded(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.commentsContainer}>
          <Text style={styles.title}>Commentaire(s)</Text>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                {comment.profiles.avatar_url.startsWith("https://") ? (
                  <Image
                    source={{ uri: comment.profiles.avatar_url }}
                    style={styles.avatar}
                  />
                ) : (
                  <RemoteImage
                    path={comment.profiles.avatar_url}
                    fallback="profile image"
                    style={styles.avatar}
                  />
                )}
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.username}>
                      {comment.profiles.username || comment.profiles.full_name}
                    </Text>
                    <Text style={styles.timestamp}>
                      {moment(comment.created_at).fromNow()}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Feather name="heart" size={16} color="#64748B" />
                      <Text style={styles.actionText}>12</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Feather
                        name="message-circle"
                        size={16}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Zone de saisie en mode absolute en bas de l'écran */}
        <Animated.View
          style={[
            styles.inputContainer,
            { transform: [{ scale: inputScale }] },
          ]}
        >
          <TextInput
            mode="flat"
            placeholder="Écrire un commentaire..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            style={styles.input}
            underlineColor="transparent"
            theme={{
              colors: {
                primary: "#9333EA",
                placeholder: "#94A3B8",
              },
              roundness: 12,
            }}
            right={
              <TextInput.Icon
                icon={() => (
                  <TouchableOpacity
                    onPress={handleAddComment}
                    disabled={isSubmitting || !newComment.trim()}
                    style={{ padding: 8 }}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#9333EA" />
                    ) : (
                      <MaterialCommunityIcons
                        name="send-circle"
                        size={32}
                        color={newComment.trim() ? "#9333EA" : "#CBD5E1"}
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            }
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 80, // espace pour laisser la zone input visible
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // pour que le dernier commentaire ne soit pas caché
  },
  commentContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontWeight: "bold",
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#64748B",
  },
  commentText: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#F1F5F9",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    maxHeight: 120,
  },
});

export default CommentSection;
