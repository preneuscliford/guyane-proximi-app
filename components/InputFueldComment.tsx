import React, { useState } from "react";
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface CommentInputProps {
  postId: string;
  currentUser: any;
  onCommentAdded: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  currentUser,
  onCommentAdded,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputScale = new Animated.Value(1);
  const queryClient = useQueryClient();

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
        postId: parseInt(postId, 10),
        userId: currentUser.id,
      });
      if (error) throw error;

      setNewComment("");
      onCommentAdded();
      queryClient.invalidateQueries({ queryKey: ["postDetails", postId] });
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.inputContainer}
    >
      <AnimatedTextInput
        style={[styles.input, { transform: [{ scale: inputScale }] }]}
        mode="outlined"
        placeholder="Écrire un commentaire..."
        value={newComment}
        onChangeText={setNewComment}
        multiline
        outlineColor="transparent"
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
          colors: { primary: "#1E293B", placeholder: "#F5F8FD" },
          roundness: 12,
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default CommentInput;

const styles = StyleSheet.create({
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#F5F8FD",
  },
  input: {
    borderRadius: 12,
    fontSize: 16,
    lineHeight: 24,
  },
});
