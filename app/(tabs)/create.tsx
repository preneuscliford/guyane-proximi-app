import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";

const create = () => {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [imagePath, setImagePath] = useState("");
  const [form, setForm] = useState({
    title: "",
    desc: "",
    price: "",
    categorie: "",
  });

  const uploadImage = async () => {
    if (image) {
      console.log("uploding");
      const arraybuffer = await fetch(image?.uri).then((res) =>
        res.arrayBuffer()
      );
      const fileExt = image?.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("products")
        .upload(path, arraybuffer, {
          contentType: image?.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      return data.path;
    }
  };

  const submitForm = async () => {
    try {
      await uploadImage();

      const uploadedPath = await uploadImage();
      if (!uploadedPath) {
        throw new Error("Image upload failed");
      }

      console.log(uploadedPath);
      const { data, error } = await supabase.from("products").insert({
        title: form.title,
        desc: form.desc,
        price: form.price,
        imageUrl: uploadedPath,
        category: form.categorie,
      });

      if (error) {
        Alert.alert(error.message);
      }

      setForm({
        title: "",
        desc: "",
        price: "",
        categorie: "",
      });
      setImage(null);

      console.log(data);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setForm({
        title: "",
        desc: "",
        price: "",
        categorie: "",
      });
      setImage(null);
    }
  };

  async function selectImage() {
    try {
      // setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      setImage(image);

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      // onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      // setUploading(false);
    }
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView>
        <View className="p-10">
          <Text className="text-[27px] font-bold text-textgray">
            Ajouter un nouveau Post
          </Text>
          <Text className=" text-gray-500">
            Créer un nouveau post a commencer a vendre
          </Text>
        </View>

        <TouchableOpacity onPress={selectImage} className=" px-10 ">
          {image ? (
            <Image
              source={{ uri: image?.uri }}
              className="w-full h-48 rounded-2xl"
            />
          ) : (
            <Image
              source={require("../../assets/images/placeholder.jpg")}
              style={{ width: 120, height: 120, borderRadius: 10 }}
            />
          )}
        </TouchableOpacity>
        <View className=" px-10 py-4">
          <TextInput
            onChangeText={(text) => setForm({ ...form, title: text })}
            placeholder="Titre"
            placeholderTextColor="#333"
            value={form.title}
            className="bg-zinc-200 text-textgray mt-3 rounded-xl py-3 px-5"
          />
          <TextInput
            onChangeText={(text) => setForm({ ...form, desc: text })}
            placeholder="Description"
            multiline
            numberOfLines={5}
            placeholderTextColor="#333"
            value={form.desc}
            textAlignVertical="top"
            className="bg-zinc-200 text-textgray mt-3 rounded-xl py-3 px-5"
          />
          <TextInput
            onChangeText={(text) => setForm({ ...form, price: text })}
            placeholder="Prix"
            placeholderTextColor="#333"
            keyboardType="numeric"
            value={form.price}
            className="bg-zinc-200 text-textgray mt-3 rounded-xl py-3 px-5"
          />

          <View className="mt-5 bg-zinc-200 rounded-xl">
            <Picker
              selectedValue={form.categorie}
              onValueChange={(itemValue, itemIndex) =>
                setForm({ ...form, categorie: itemValue })
              }
            >
              {/* <Picker.Item label="Catégorie" value="" /> */}
              <Picker.Item
                label="Choisissez une Catégorie"
                value="0"
                enabled={false}
                style={{ color: "#333", opacity: 0.5 }}
              />
              <Picker.Item label="Électronique" value="Électronique" />
              <Picker.Item label="Maison" value="Maison" />
              <Picker.Item label="Beauté" value="Beaute" />
              <Picker.Item label="Santé" value="Sante" />
              <Picker.Item label="Alimentation" value="Alimentation" />
              <Picker.Item label="Sport" value="Sport" />
              <Picker.Item label="Divertissement" value="Divertissement" />
              <Picker.Item label="Tourisme" value="Tourisme" />
            </Picker>
          </View>

          <View className="mt-7">
            <Pressable
              onPress={submitForm}
              className=" bg-slate-500 rounded-lg justify-center items-center py-4 px-3"
            >
              <Text className=" text-white">Se Connecter</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default create;

const styles = StyleSheet.create({});
