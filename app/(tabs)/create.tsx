import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../provider/AuthProvider";
import { ActivityIndicator } from "react-native-paper";

type ListingType = "product" | "service" | "rental";

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "product" as ListingType,
    specs: {} as Record<string, any>,
    tags: [] as string[],
  });

  const { session } = useAuth();

  const uploadImage = async () => {
    if (image) {
      const arraybuffer = await fetch(image?.uri).then((res) =>
        res.arrayBuffer()
      );
      const fileExt = image?.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("products/listings")
        .upload(path, arraybuffer, {
          contentType: image?.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      return data.path;
    }
  };

  const validateForm = () => {
    if (!session?.user?.id) {
      Alert.alert("Erreur", "Vous devez être connecté pour créer une annonce");
      return false;
    }

    if (!form.title.trim()) {
      Alert.alert("Erreur", "Le titre est obligatoire");
      return false;
    }

    if (!form.description.trim()) {
      Alert.alert("Erreur", "La description est obligatoire");
      return false;
    }

    if (!form.price || isNaN(parseFloat(form.price))) {
      Alert.alert("Erreur", "Le prix doit être un nombre valide");
      return false;
    }

    if (!image) {
      Alert.alert("Erreur", "Veuillez ajouter une image");
      return false;
    }

    return true;
  };

  const submitForm = async () => {
    try {
      if (!validateForm()) return;

      setUploading(true);

      const mediaUrl = await uploadImage();

      if (!mediaUrl) {
        throw new Error("Échec du téléchargement de l'image");
      }

      const { error } = await supabase.from("product_listings").insert({
        user_id: session?.user?.id,
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        type: form.type,
        specs: form.specs,
        media_urls: [mediaUrl],
        tags: form.tags,
        status: "draft",
      });

      if (error) {
        console.error("Insert error:", error);
        Alert.alert("Erreur", error.message);
        return;
      }

      Alert.alert("Succès", "Votre annonce a été créée avec succès");
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      if (error instanceof Error) {
        Alert.alert("Erreur", error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      type: "product",
      specs: {},
      tags: [],
    });
    setImage(null);
  };

  const selectImage = async () => {
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
        allowsMultipleSelection: false,
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Image selection error:", error);
      if (error instanceof Error) {
        Alert.alert("Erreur", error.message);
      }
    }
  };

  return (
    <SafeAreaView className="h-full bg-ghost-white">
      <ScrollView>
        <View className="p-10">
          <Text className="text-[27px] font-bold text-rich-black">
            Créer une nouvelle annonce
          </Text>
          <Text className="text-rich-black">
            Remplissez les informations de votre annonce
          </Text>
        </View>

        <View className="px-10">
          <TouchableOpacity
            onPress={selectImage}
            className="bg-white-2 p-4 rounded-xl mb-4"
          >
            <Text className="text-center text-deep-blue mb-2">
              {image ? "Changer l'image" : "Ajouter une image"}
            </Text>
          </TouchableOpacity>

          {image && (
            <View className="mb-4 relative">
              <Image
                source={{ uri: image.uri }}
                className="w-full h-48 rounded-lg"
              />
              <TouchableOpacity
                onPress={() => setImage(null)}
                className="absolute top-2 right-2 bg-red-500 rounded-full w-8 h-8 items-center justify-center"
              >
                <Text className="text-white text-lg">×</Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="bg-white-2 rounded-xl mb-4">
            <Picker
              selectedValue={form.type}
              onValueChange={(value: ListingType) =>
                setForm({ ...form, type: value })
              }
            >
              <Picker.Item label="Produit" value="product" />
              <Picker.Item label="Service" value="service" />
              <Picker.Item label="Location" value="rental" />
            </Picker>
          </View>

          <TextInput
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
            placeholder="Titre de l'annonce"
            maxLength={100}
            className="bg-white-2 text-textgray rounded-xl py-3 px-5 mb-4"
          />

          <TextInput
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            placeholder="Description détaillée"
            multiline
            numberOfLines={5}
            maxLength={1500}
            textAlignVertical="top"
            className="bg-white-2 text-textgray rounded-xl py-3 px-5 mb-4"
          />

          <TextInput
            value={form.price}
            onChangeText={(text) =>
              setForm({ ...form, price: text.replace(/[^0-9.]/g, "") })
            }
            placeholder="Prix"
            keyboardType="numeric"
            className="bg-white-2 text-textgray rounded-xl py-3 px-5 mb-4"
          />

          <TouchableOpacity
            disabled={uploading || !session}
            onPress={submitForm}
            className={`${
              !session || uploading
                ? "bg-rich-black opacity-85"
                : "bg-deep-blue opacity-100"
            } rounded-lg justify-center items-center py-4 px-3 mb-6`}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                className={`${
                  !session || uploading ? "text-gray-400" : "text-white-2"
                }`}
              >
                Publier l'annonce
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
