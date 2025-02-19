import { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { useAuth } from "@/app/provider/AuthProvider";
import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
// import Button from "@/components/Button";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useRouter } from "expo-router";
import { uploadImages } from "@/lib/postServices";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_CHARACTERS = 280;

const CreatePost = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { images, pickImages, removeImage } = useImagePicker();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return;

    try {
      setIsSubmitting(true);

      // Upload des médias
      const mediaUrls = await uploadImages(images);

      // Création du post
      const { error } = await supabase.from("posts").insert({
        body: content.trim(),
        file: mediaUrls,
        userId: user?.id,
      });

      if (error) throw error;

      router.back();
    } catch (error) {
      console.error("Post error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* En-tête */}
          <View style={styles.header}>
            <TouchableOpacity onPress={router.back}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Button
              onPress={handleSubmit}
              disabled={isSubmitting || (!content && images.length === 0)}
              loading={isSubmitting}
              style={styles.postButton}
            >
              Publier
            </Button>
          </View>

          {/* Zone de texte */}
          <View style={styles.contentContainer}>
            <TextInput
              ref={inputRef}
              placeholder="Quoi de neuf ?"
              placeholderTextColor="#666"
              multiline
              maxLength={MAX_CHARACTERS}
              value={content}
              onChangeText={setContent}
              style={styles.input}
              autoFocus
            />

            {/* Galerie de médias */}
            {images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mediaContainer}
              >
                {images.map((image, index) => (
                  <View key={index} style={styles.mediaItem}>
                    <Image source={{ uri: image.uri }} style={styles.media} />
                    <TouchableOpacity
                      style={styles.removeMediaButton}
                      onPress={() => removeImage(index)}
                    >
                      <MaterialIcons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Actions */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={pickImages}>
              <MaterialIcons name="image" size={24} color="#9333EA" />
            </TouchableOpacity>

            <Text style={styles.counter}>
              {MAX_CHARACTERS - content.length}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  postButton: {
    borderRadius: 20,
    paddingHorizontal: 24,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
    maxHeight: 200,
  },
  mediaContainer: {
    gap: 8,
    marginTop: 16,
  },
  mediaItem: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  media: {
    width: 100,
    height: 100,
  },
  removeMediaButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
  },
  counter: {
    color: "#666",
    fontSize: 14,
  },
});

export default CreatePost;
