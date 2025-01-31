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
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

import { ActivityIndicator } from "react-native-paper";
import { EventForm } from "@/components/EventPicker";

type ListingType = "product" | "service" | "event" | "rental";

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "product" as ListingType,
    specs: {} as Record<string, any>,
    tags: [] as string[],
    startDate: new Date(),
    endDate: new Date(),
    location: "",
  });

  const { session } = useAuth();
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

    // if (
    //   (!form.price && form.type !== "event") ||
    //   isNaN(parseFloat(form.price))
    // ) {
    //   Alert.alert("Erreur", "Le prix doit être un nombre valide");
    //   return false;
    // }

    // if (!images ) {
    //   Alert.alert("Erreur", "Veuillez ajouter une image");
    //   return false;
    // }

    if (form.type === "event") {
      if (!form.location.trim()) {
        Alert.alert("Erreur", "Le lieu est obligatoire pour les événements");
        return false;
      }

      if (form.startDate >= form.endDate) {
        Alert.alert(
          "Erreur",
          "La date de fin doit être après la date de début"
        );
        return false;
      }
    }

    return true;
  };

  const submitForm = async () => {
    try {
      if (!validateForm()) return;
      setUploading(true);

      const mediaUrls = await uploadImages(images);

      if (mediaUrls.length === 0) {
        throw new Error("Aucune image n'a pu être téléversée");
      }

      let error;
      if (form.type === "event") {
        const { data, error: eventError } = await supabase
          .from("events")
          .insert({
            title: form.title.trim(),
            description: form.description.trim(),
            start_date: form.startDate.toISOString(),
            end_date: form.endDate.toISOString(),
            file: mediaUrls,
            location: form.location,
            organizer_id: session?.user?.id,
          });
        error = eventError;

        if (error) throw error;

        Alert.alert("Succès", "Votre événement a été ajouté avec succès");
        resetForm();
      } else {
        const { error } = await supabase.from("product_listings").insert({
          user_id: session?.user?.id,
          title: form.title.trim(),
          description: form.description.trim(),
          price: parseFloat(form.price),
          type: form.type,
          specs: form.specs,
          media_urls: mediaUrls,
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
      }
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
      location: "",
      startDate: new Date(),
      endDate: new Date(),
    });
    setImages([]);
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

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
              Ajouter des images ({images.length}/10)
            </Text>
          </TouchableOpacity>

          <ScrollView horizontal className="mb-4">
            {images.map((image, index) => (
              <View key={index} className="mr-2 relative">
                <Image
                  source={{ uri: image.uri }}
                  className="w-24 h-24 rounded-lg"
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                >
                  <Text className="text-white text-sm">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

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
              <Picker.Item label="Événement" value="event" />
            </Picker>
          </View>

          {form.type === "event" && (
            <>
              <EventForm form={form} setForm={setForm} />
            </>
          )}

          <TextInput
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
            placeholder={form.type !== "event" ? "Titre de l'annonce" : "Titre"}
            maxLength={100}
            className="bg-white-2 text-textgray rounded-xl py-3 px-5 mb-4"
          />

          <TextInput
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            placeholder={
              form.type !== "event" ? "Description de l'annonce" : "Description"
            }
            multiline
            numberOfLines={5}
            maxLength={1500}
            textAlignVertical="top"
            className="bg-white-2 text-textgray rounded-xl py-3 px-5 mb-4"
          />

          {form.type !== "event" ? (
            <TextInput
              value={form.price}
              onChangeText={(text) =>
                setForm({ ...form, price: text.replace(/[^0-9.]/g, "") })
              }
              placeholder="Prix"
              keyboardType="numeric"
              className="bg-white-2 text-textgray rounded-xl py-3 px-5 mb-4"
            />
          ) : (
            <TextInput
              value={form.location}
              onChangeText={(text) => setForm({ ...form, location: text })}
              placeholder="lieu"
              maxLength={100}
              className="bg-white-2 text-textgray rounded-xl py-3 px-5 mb-4"
            />
          )}

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
