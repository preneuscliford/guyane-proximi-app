import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase";
import moment from "moment";
import RemoteImage from "./RemoteImage";
import Feather from "@expo/vector-icons/Feather";
import { TextInput } from "react-native-paper";

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
      <View style={{ flex: 1, marginBottom: 10 }}>
        <TextInput
          style={{ flex: 1 }}
          placeholder=" Ajouter un commentaire..."
          value={newComment}
          right={
            <TextInput.Icon
              disabled={isSubmitting || !newComment.trim()}
              icon="send"
              onPress={handleAddComment}
            />
          }
          onChangeText={setNewComment}
          multiline
        />
        {/* <TouchableOpacity
          onPress={handleAddComment}
          disabled={isSubmitting || !newComment.trim()}
          className={`px-4 py-2 rounded-lg ${
            isSubmitting || !newComment.trim() ? "bg-gray-300" : "bg-blue-500"
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Feather name="send" size={24} color="black" />
          )}
        </TouchableOpacity> */}
      </View>

      {/* Liste des commentaires */}
      <View className="gap-4 ">
        {comments.map((comment) => (
          <View
            style={{ marginBottom: 10, padding: 5 }}
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
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CommentSection;
