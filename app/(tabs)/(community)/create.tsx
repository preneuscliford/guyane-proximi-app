import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import { useAuth } from "@/app/provider/AuthProvider";
import { Appbar, Button, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import RemoteImage from "@/components/RemoteImage";
import RichTextEditor from "@/components/RichTextEditor";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

import BackAppbar from "@/components/AppBar";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

interface RichTextEditor {
  setContentHTML(html: string): void;
}

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const { session, userData } = useAuth();
  const router = useRouter();
  const bodyRef = useRef("");
  const editorRef = useRef<RichTextEditor>(null);

  const pickImages = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Nous avons besoin de votre permission pour accéder à vos photos"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages(result.assets); // ✅ Stocker toutes les images sélectionnées
      }
    } catch (error) {
      console.error("Image selection error:", error);
      if (error instanceof Error) {
        Alert.alert("Erreur", error.message);
      }
    }
  };

  const uploadImages = async (images: ImagePicker.ImagePickerAsset[]) => {
    if (!images || images.length === 0) return [];

    try {
      const uploadedPaths = await Promise.all(
        images.map(async (image) => {
          // Vérification renforcée de l'URI
          if (!image.uri) {
            console.warn("Image URI is missing, skipping upload");
            return null;
          }

          try {
            // Conversion sécurisée en base64
            const base64 = await FileSystem.readAsStringAsync(image.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

            // Conversion alternative pour React Native
            const raw = Buffer.from(base64, "base64");
            const arraybuffer = new Uint8Array(raw).buffer;

            // Génération du nom de fichier
            const fileExt = image.uri.split(".").pop()?.toLowerCase() || "jpeg";
            const path = `${Date.now()}-${Math.random()
              .toString(36)
              .substring(7)}.${fileExt}`;

            // Upload avec type MIME par défaut
            const { data, error: uploadError } = await supabase.storage
              .from("products/listings")
              .upload(path, arraybuffer, {
                contentType: image.mimeType || "image/jpeg",
              });

            console.log(data?.path);
            if (uploadError) throw uploadError;
            return data?.path;
          } catch (error) {
            console.error("Image processing error:", error);
            return null;
          }
        })
      );

      return uploadedPaths.filter((path): path is string => !!path);
    } catch (error) {
      console.error("Global upload error:", error);
      return [];
    }
  };

  const createPost = async () => {
    try {
      setLoading(true);

      const mediaUrls = await uploadImages(images);

      if (mediaUrls.length === 0) {
        throw new Error("Aucune image n'a pu être téléversée");
      }

      const { data, error, status } = await supabase
        .from("posts")
        .upsert({
          body: bodyRef.current,
          userId: session?.user.id,
          file: mediaUrls,
        })
        .select()
        .single();

      if (error) {
        console.log(error);
        setLoading(false);
      }

      setLoading(false);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View className="flex-1 bg-ghost-white">
      <BackAppbar title="Créer un post" />

      <ScrollView className="flex-1 px-4">
        <View className="flex-row items-center my-6 space-x-3">
          <RemoteImage
            path={userData?.avatar_url}
            fallback="profile"
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
          />
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              {userData?.username}
            </Text>
            <Text className="text-sm text-gray-500">Post public</Text>
          </View>
        </View>

        <RichTextEditor
          editorRef={editorRef}
          onchange={(body: string) => (bodyRef.current = body)}
        />

        {/* {images && !uploading && (
          <TouchableOpacity
            onPress={pickImages}
            className="ml-4 w-24 h-24 bg-gray-100 rounded-lg items-center justify-center"
          >
            <MaterialIcons name="add-a-photo" size={32} color="black" />
          </TouchableOpacity>
        )} */}

        {images.length > 0 ? (
          <View className="my-4 px-4">
            <Text className="text-gray-600 mb-2">{images.length} photo(s)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((uri, index) => (
                <View key={index} className="relative mr-2">
                  <Image
                    source={{ uri: uri.uri }}
                    className="w-24 h-24 rounded-lg"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                  >
                    <MaterialIcons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className="my-4 px-4">
            <TouchableOpacity
              onPress={pickImages}
              className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center"
            >
              <MaterialIcons name="add-a-photo" size={32} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-100">
        <Button
          mode="contained"
          loading={loading || uploading}
          disabled={loading || uploading || !bodyRef.current}
          onPress={createPost}
          className="rounded-full py-2 shadow-sm"
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
          contentStyle={{ height: 48 }}
        >
          {uploading ? "Publication..." : "Publier"}
        </Button>
      </View>

      {(loading || uploading) && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-2">
            {uploading
              ? "Téléversement des images..."
              : "Publication en cours..."}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CreatePost;

const styles = StyleSheet.create({});
