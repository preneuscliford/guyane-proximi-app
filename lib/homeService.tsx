import { supabase } from "./supabase";
import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";

export interface ImageAsset extends ImagePicker.ImagePickerAsset {
  id?: string;
}

export const fetchServices = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select(
        `
            *,
            profiles(*),
            categories(*),
            reviews(*)
          `
      )
      .eq("id", id)
      .limit(4)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
  }
};

export const uploadServicesImages = async (images: ImageAsset[]) => {
  if (!images?.length) return [];

  try {
    return await Promise.all(
      images.map(async (image) => {
        if (!image.uri) throw new Error("URI image manquante");

        const base64 = await FileSystem.readAsStringAsync(image.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const arraybuffer = Buffer.from(base64, "base64");
        const fileExt = image.uri.split(".").pop()?.toLowerCase() || "jpeg";
        const path = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("services")
          .upload(path, arraybuffer, {
            contentType: image.mimeType || "image/jpeg",
          });

        if (error) throw error;
        return data?.path;
      })
    );
  } catch (error) {
    throw new Error(
      `Échec du téléversement : ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
