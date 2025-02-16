import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import moment from "moment";
import RemoteImage from "./RemoteImage";
import Feather from "@expo/vector-icons/Feather";

// Type du commentaire
export type CommentType = {
  id: number;
  text: string;
  created_at: string;
  userId: string;
  postId: number;
  profiles: {
    username: string;
    avatar_url: string;
  };
};

interface CommentListProps {
  comments: CommentType[];
  currentUser: any;
}

const CommentList: React.FC<CommentListProps> = ({ comments, currentUser }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commentaire(s)</Text>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentContainer}>
          {comment.profiles.avatar_url.startsWith("https://") ? (
            <Image
              source={{ uri: comment.profiles.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <RemoteImage
              path={comment?.profiles?.avatar_url}
              fallback={"product image"}
              className="w-12 h-12 rounded-full"
            />
          )}
          <View style={styles.textContainer}>
            <View style={styles.header}>
              <Text style={styles.username}>
                {comment.profiles.username || currentUser?.full_name}
              </Text>
              <Text style={styles.timestamp}>
                {moment(comment.created_at).fromNow()}
              </Text>
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="heart" size={16} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="message-circle" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default CommentList;

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  commentContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "flex-start",
    gap: 6,
  },
  avatar: { width: 24, height: 24, borderRadius: 15 },
  textContainer: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  username: { fontWeight: "bold" },
  timestamp: { fontSize: 12, color: "gray" },
  commentText: { marginTop: 4 },
  actions: { flexDirection: "row", marginTop: 8, gap: 16 },
  actionButton: { flexDirection: "row", alignItems: "center" },
});
