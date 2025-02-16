import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Text,
} from "react-native";
import React, { useRef, useState } from "react";
import { useAuth } from "@/app/provider/AuthProvider";
import { Button, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import RemoteImage from "@/components/RemoteImage";
import RichTextEditor from "@/components/RichTextEditor";
import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import BackAppbar from "@/components/AppBar";
import { StatusBar } from "expo-status-bar";
import Toast, { ToastHandles } from "@/components/Toast";
import { uploadImages } from "@/lib/postServices";
import { useImagePicker } from "@/hooks/useImagePicker";

const CreatePost = () => {
  const { userData, user } = useAuth();
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const toastRef = useRef<ToastHandles>(null);
  const { images, pickImages, removeImage } = useImagePicker();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const isValidPost = () => {
    return content.trim().length > 0 || images.length > 0;
  };

  const handleCreatePost = async () => {
    if (!isValidPost()) {
      toastRef.current?.show("Le post ne peut pas être vide", "info", 1500);
      return;
    }

    try {
      setLoading(true);
      const mediaUrls = await uploadImages(images);

      const { error } = await supabase.from("posts").upsert({
        body: content,
        userId: user?.id,
        file: mediaUrls,
      });

      if (error) throw error;

      toastRef.current?.show("Post publié avec succès", "success", 1500);
      router.back();
    } catch (error) {
      console.error("Erreur:", error);
      toastRef.current?.show("Échec de la publication", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-ghost-white">
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <Toast ref={toastRef} />
      <BackAppbar title="Créer un post" />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* En-tête utilisateur */}
        <View className="flex-row items-center my-6 space-x-3">
          <View className="w-9 h-9 rounded-full overflow-hidden bg-gray-100">
            {userData?.avatar_url?.startsWith("https://") ? (
              <Image
                source={{ uri: userData.avatar_url }}
                className="w-full h-full"
              />
            ) : (
              <RemoteImage
                path={userData?.avatar_url}
                fallback="profile-placeholder"
                className="w-full h-full"
              />
            )}
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              {userData?.username || user?.user_metadata?.full_name}
            </Text>
            <Text className="text-sm text-gray-500">Post public</Text>
          </View>
        </View>

        {/* Éditeur de texte enrichi */}
        <RichTextEditor
          editorRef={editorRef}
          onchange={(body: string) => setContent(body)}
        />

        {/* Galerie d'images */}
        <View className="my-4">
          {images.length > 0 ? (
            <>
              <Text className="text-gray-600 mb-2 px-4">
                {images.length} photo(s)
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((uri, index) => (
                  <View key={index} className="relative mr-2 ml-4">
                    <Image
                      source={{ uri: uri.uri }}
                      className="w-28 h-28 rounded-xl"
                    />
                    <TouchableOpacity
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                      onPress={() => removeImage(index)}
                    >
                      <MaterialIcons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <TouchableOpacity
              onPress={pickImages}
              className="mx-4 w-14 h-14 bg-gray-100 rounded-xl items-center justify-center border-2 border-dashed border-gray-300"
            >
              <MaterialIcons name="add-a-photo" size={28} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Bouton de publication */}
      <View className="p-4 bg-white border-t border-gray-100 shadow-md">
        <Button
          mode="contained"
          loading={loading}
          disabled={!isValidPost() || loading}
          onPress={handleCreatePost}
          className="rounded-full py-2 shadow-sm"
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
          contentStyle={{ height: 48 }}
          theme={{
            colors: {
              primary: isValidPost() ? "#9333EA" : "#CBD5E1",
            },
          }}
        >
          {loading ? "Publication..." : "Publier"}
        </Button>
      </View>

      {/* Overlay de chargement */}
      {loading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-2 text-center">
            {images.length > 0
              ? "Téléversement des images..."
              : "Publication en cours..."}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CreatePost;
