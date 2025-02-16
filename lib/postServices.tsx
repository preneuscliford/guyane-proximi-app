import { Post } from "@/types/postTypes";
import { supabase } from "./supabase";

// Créer un fichier imageService.ts
import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";

export const fetchPostDetails = async (postId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(*), post_likes(*), comments(*)")
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data as Post;
};

export const fetchComments = async (postId: string) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles(*)")
    .eq("postId", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Comment[];
};

export interface ImageAsset extends ImagePicker.ImagePickerAsset {
  id?: string;
}

export const uploadImages = async (images: ImageAsset[]) => {
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
          .from("products/listings")
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
