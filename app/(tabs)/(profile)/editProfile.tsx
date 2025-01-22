import { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/provider/AuthProvider";
import { Redirect } from "expo-router";
import Avatar from "@/components/Avatar";
import { Button, TextInput, Text } from "react-native-paper";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    username: "",
    website: "",
    avatarUrl: "",
    phone: "",
    address: "",
    bio: "",
  });

  const { session } = useAuth();
  const router = useRouter();

  if (!session) {
    return <Redirect href={"/"} />;
  }

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, phone, address, bio`)
        .eq("id", session?.user.id)
        .single();

      if (error && error.status !== 406) throw error;

      if (data) {
        setForm({
          username: data.username || "",
          website: data.website || "",
          avatarUrl: data.avatar_url || "",
          phone: data.phone || "",
          address: data.address || "",
          bio: data.bio || "",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username: form.username,
        website: form.website,
        avatar_url: form.avatarUrl,
        phone: form.phone,
        address: form.address,
        bio: form.bio,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;
      Alert.alert("Succès", "Profil mis à jour avec succès");
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erreur", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 py-6">
        <View className="items-center mb-6">
          <Avatar
            size={120}
            url={form.avatarUrl}
            onUpload={(url: string) => {
              setForm({ ...form, avatarUrl: url });
            }}
          />
        </View>

        <View className="space-y-4">
          <TextInput
            label="Email"
            value={session?.user?.email}
            editable={false}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Nom d'utilisateur"
            value={form.username}
            onChangeText={(text) => setForm({ ...form, username: text })}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Téléphone"
            value={form.phone}
            keyboardType="phone-pad"
            onChangeText={(text) => setForm({ ...form, phone: text })}
            left={<TextInput.Icon icon="phone" />}
          />

          <TextInput
            label="Adresse"
            value={form.address}
            onChangeText={(text) => setForm({ ...form, address: text })}
            left={<TextInput.Icon icon="map-marker" />}
          />

          <TextInput
            label="Site web"
            value={form.website}
            onChangeText={(text) => setForm({ ...form, website: text })}
            left={<TextInput.Icon icon="web" />}
          />

          <TextInput
            label="Bio"
            value={form.bio}
            onChangeText={(text) => setForm({ ...form, bio: text })}
            multiline
            numberOfLines={4}
            style={{ height: 100 }}
          />

          <Button
            mode="contained"
            onPress={updateProfile}
            loading={loading}
            disabled={loading}
            style={{
              marginTop: 20,
              backgroundColor: "#0a7ea4",
              paddingVertical: 8,
            }}
          >
            {loading ? "Mise à jour..." : "Mettre à jour le profil"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
