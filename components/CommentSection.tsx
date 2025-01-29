import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  StyleSheet,
} from "react-native";
import { supabase } from "@/lib/supabase";
import moment from "moment";
import RemoteImage from "./RemoteImage";
import Feather from "@expo/vector-icons/Feather";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Comment {
  id: number;
  text: string;
  created_at: string;
  userId: string;
  postId: number;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface CommentSectionProps {
  postId: string;
  currentUser: any;
  comments: Comment[];
  onCommentAdded: () => void;
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
    try {
      const { error } = await supabase.from("comments").insert({
        text: newComment.trim(),
        postId: parseInt(postId),
        userId: currentUser.id,
      });

      if (error) throw error;

      setNewComment("");
      onCommentAdded();
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="mt-4">
      <Text className="text-lg font-bold mb-4">Commentaire(s)</Text>

      {/* Zone de saisie du commentaire */}
      <Animated.View style={{ transform: [{ scale: inputScale }] }}>
        <TextInput
          mode="outlined"
          placeholder="Écrire un commentaire..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          outlineColor="transparent"
          style={[styles.input, { backgroundColor: "#FCFDFE" }]}
          contentStyle={{ textAlignVertical: "center" }}
          right={
            <TextInput.Icon
              icon={() => (
                <TouchableOpacity
                  onPress={handleAddComment}
                  disabled={isSubmitting || !newComment.trim()}
                >
                  <MaterialCommunityIcons
                    name="send-circle"
                    size={32}
                    color={
                      isSubmitting || !newComment.trim() ? "#181F27" : "#F5F8FD"
                    }
                  />
                </TouchableOpacity>
              )}
            />
          }
          theme={{
            colors: {
              primary: "#1E293B",
              placeholder: "#F5F8FD",
            },
            roundness: 12,
          }}
        />
      </Animated.View>

      {/* Liste des commentaires */}
      <View className="mt-4">
        {comments.map((comment) => (
          <View
            style={{ marginBottom: 4, padding: 5 }}
            key={comment.id}
            className="flex-row gap-6 bg-white p-3 px-4 rounded-lg"
          >
            <RemoteImage
              path={comment.profiles.avatar_url}
              fallback="profile image"
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                marginHorizontal: 5,
              }}
            />
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-bold">{comment.profiles.username}</Text>
                <Text className="text-gray-500 text-xs">
                  {moment(comment.created_at).fromNow()}
                </Text>
              </View>
              <Text className="mt-1">{comment.text}</Text>
              <View className="flex-row items-center mt-3  gap-4">
                <TouchableOpacity className="flex-row items-center space-x-1">
                  <Feather name="heart" size={16} color="#64748B" />
                  <Text className="text-gray-500 text-sm">12</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="message-circle" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    fontSize: 16,
    lineHeight: 24,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
});

export default CommentSection;
