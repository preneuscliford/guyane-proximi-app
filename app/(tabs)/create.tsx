import {
  Image,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../provider/AuthProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { ActivityIndicator } from "react-native-paper";
import { EventForm } from "@/components/EventPicker";
import { uploadServicesImages } from "@/lib/homeService";
import { useImagePicker } from "@/hooks/useImagePicker";
import Toast, { ToastHandles } from "@/components/Toast";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Pour simplifier, nous limitons ici les types à "service" et "event"
type ListingType = "service" | "event";

// Tableau de catégories de services (vous pourrez le récupérer depuis votre table "categories" ultérieurement)
const serviceCategories = [
  { id: 1, name: "Nettoyage" },
  { id: 2, name: "Réparation" },
  { id: 3, name: "Peinture" },
  { id: 4, name: "Déménagement" },
  { id: 5, name: "Jardinage" },
  { id: 6, name: "Plomberie" },
  { id: 7, name: "Électricité" },
  { id: 8, name: "Décoration" },
];

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const { images, pickImages, removeImage, setImages } = useImagePicker();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "service" as ListingType,
    categoryId: "",
    location: "",
    startDate: new Date(),
    endDate: new Date(),
    // Vous pouvez ajouter "duration" ici si nécessaire (ex: "01:00:00" pour 1 heure)
  });

  const toastRef = useRef<ToastHandles>(null);

  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (!session) router.push("/(auth)/signUp");
  }, [session, router]);

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
    if (form.type === "service") {
      if (!form.price.trim() || isNaN(parseFloat(form.price))) {
        Alert.alert("Erreur", "Le prix doit être un nombre valide");
        return false;
      }
      if (!form.categoryId) {
        Alert.alert("Erreur", "Veuillez sélectionner une catégorie de service");
        return false;
      }
    }
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
      const mediaUrls = await uploadServicesImages(images);
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
      } else if (form.type === "service") {
        const { error: serviceError } = await supabase.from("services").insert({
          title: form.title.trim(),
          description: form.description.trim(),
          price: parseFloat(form.price),
          gallery: mediaUrls,
          provider_id: session?.user?.id,
          category_id: form.categoryId, // Utilisation de la catégorie sélectionnée
          // Vous pouvez ajouter "duration" ici si nécessaire
        });
        error = serviceError;
        if (error) throw error;

        toastRef.current?.show(
          "Votre service a été ajouté avec succès",
          "success",
          1500
        );

        resetForm();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      if (error instanceof Error) {
        toastRef.current?.show(
          "Une erreur est survenue lors de la soumission de l'annonce",
          "error",
          1500
        );
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
      type: "service",
      categoryId: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(),
    });
    setImages([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <Toast ref={toastRef} />
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Créer une nouvelle annonce</Text>
          <Text style={styles.headerSubtitle}>
            Remplissez les informations de votre annonce
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={pickImages} style={styles.imagePicker}>
            <Text style={styles.imagePickerText}>
              Ajouter des images ({images.length}/10)
            </Text>
          </TouchableOpacity>

          <ScrollView
            horizontal
            style={styles.imageScroll}
            contentContainerStyle={styles.imageScrollContent}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  style={styles.removeImageButton}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.type}
              onValueChange={(value: ListingType) =>
                setForm({ ...form, type: value })
              }
            >
              <Picker.Item label="Service" value="service" />
              <Picker.Item label="Événement" value="event" />
            </Picker>
          </View>

          {/* Pour les services, affichage du Picker de catégories */}
          {form.type === "service" && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.categoryId}
                onValueChange={(value: string) =>
                  setForm({ ...form, categoryId: value })
                }
              >
                <Picker.Item label="Sélectionnez une catégorie" value="" />
                {serviceCategories.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                ))}
              </Picker>
            </View>
          )}

          {form.type === "event" && (
            <>
              <EventForm form={form} setForm={setForm} />
            </>
          )}

          <RNTextInput
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
            placeholder={
              form.type !== "event"
                ? "Titre du service"
                : "Titre de l'événement"
            }
            maxLength={100}
            multiline
            style={styles.input}
          />

          <RNTextInput
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            placeholder={
              form.type !== "event"
                ? "Description du service"
                : "Description de l'événement"
            }
            multiline
            numberOfLines={5}
            maxLength={1500}
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
          />

          {form.type === "service" ? (
            <RNTextInput
              value={form.price}
              onChangeText={(text) =>
                setForm({ ...form, price: text.replace(/[^0-9.]/g, "") })
              }
              placeholder="Prix"
              keyboardType="numeric"
              style={styles.input}
            />
          ) : (
            <RNTextInput
              value={form.location}
              onChangeText={(text) => setForm({ ...form, location: text })}
              placeholder="Lieu"
              maxLength={100}
              style={styles.input}
            />
          )}

          <TouchableOpacity
            disabled={uploading || !session}
            onPress={submitForm}
            style={[
              styles.submitButton,
              {
                backgroundColor: !session || uploading ? "#1F2937" : "#7D5FFF",
              },
            ]}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Publier l'annonce</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F8FD",
  },
  headerContainer: {
    padding: 20,
  },
  headerTitle: {
    fontSize: hp("2.5%"),
    letterSpacing: 0.5,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    color: "#111827",
    fontSize: hp("1.5%"),
    letterSpacing: 0.5,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  imagePicker: {
    backgroundColor: "#E5E7EB",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePickerText: {
    textAlign: "center",
    fontSize: hp("1.5%"),
    letterSpacing: 0.5,
    color: "#7D5FFF",

    fontWeight: "bold",
  },
  imageScroll: {
    marginBottom: 10,
  },
  imageScrollContent: {
    paddingHorizontal: 10,
  },
  imageWrapper: {
    marginRight: 10,
    position: "relative",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 5,
  },
  removeImageText: {
    color: "white",
    fontWeight: "bold",
  },
  pickerContainer: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    fontSize: hp("2%"),
    letterSpacing: 0.5,
    color: "#374151",
  },
  textArea: {
    height: 120,
    fontSize: hp("2%"),
    letterSpacing: 0.5,
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#ffffff",

    fontSize: hp("2%"),
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
});

export default Create;
