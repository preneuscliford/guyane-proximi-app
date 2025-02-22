import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  BackHandler,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import { useAuth } from "@/app/provider/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Button, TextInput, Text, useTheme } from "react-native-paper";
import Avatar from "@/components/Avatar";
import * as Burnt from "burnt";

import { StatusBar } from "expo-status-bar";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { Profile, ProfileForm } from "@/types/postTypes";
// import type { Profile, ProfileForm } from "../types/profile";

const INITIAL_FORM: ProfileForm = {
  username: "",
  phone: "",
  address: "",
  bio: "",
  website: "",
  socials: { instagram: "", twitter: "" },
  businessInfo: {},
  innovationBadges: "",
};

export default function AccountScreen() {
  const { session, userData } = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [form, setForm] = useState<ProfileForm>(INITIAL_FORM);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleUpdate = async () => {
    if (!form.username.trim() && !userData?.full_name && !userData?.username) {
      setUsernameError("Le nom d'utilisateur est requis");
      return;
    }
    // Vérification si aucune modification n'a été effectuée
    if (
      form.username === userData?.username &&
      form.phone === userData?.phone &&
      form.address === userData?.address &&
      form.bio === userData?.bio &&
      form.website === userData?.website &&
      JSON.stringify(form?.socials) ===
        JSON.stringify(userData?.social_links) &&
      JSON.stringify(form?.businessInfo) ===
        JSON.stringify(userData?.business_info) &&
      form.innovationBadges === userData?.innovation_badges
    ) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      return;
    }

    const { data: existingUsers, error: checkError } = await supabase
      .from("profiles") // Remplacez "profiles" par le nom de votre table
      .select("id")
      .eq("username", form.username)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // Code 116 = pas de résultats (OK)
      Burnt.toast({
        title: "Erreur",
        preset: "error",
        message: "Erreur lors de la vérification du nom d'utilisateur.",
      });
      setLoading(false);
      return;
    }

    if (existingUsers && userData?.username !== form.username) {
      setLoading(false);
      setUsernameError("Ce nom d'utilisateur est déjà pris.");
      return;
    }

    try {
      setSaving(true);
      const updates: Partial<Profile> = {
        id: session?.user?.id,
        username: form.username || userData?.username,
        phone: form.phone || userData?.phone,
        address: form.address || userData?.address,
        bio: form.bio || userData?.bio,
        website: form.website || userData?.website,
        social_links: form.socials || userData?.social_links,
        business_info: form.businessInfo || userData?.business_info,
        innovation_badges: form.innovationBadges || userData?.innovation_badges,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updates)
        .eq("id", session?.user?.id);

      if (error) throw error;

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (!form.username && !userData?.full_name && !userData?.username) {
        Alert.alert(
          "Attention",
          "Vous devez ajouter un nom d'utilisateur avant de quitter.",
          [{ text: "OK", style: "cancel" }]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [form.username]);

  if (!session) return <Redirect href="/" />;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.avatarWrapper,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Avatar
              size={120}
              url={userData?.avatar_url || ""}
              onUpload={(url) => {
                supabase
                  .from("profiles")
                  .update({
                    avatar_url: url,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("id", session.user.id);
              }}
            />
          </Pressable>
        </View>

        <View style={styles.formContainer}>
          <Section title="Informations de base">
            <TextInput
              mode="outlined"
              label="Nom d'utilisateur"
              value={
                form.username || userData?.username || userData?.full_name || ""
              }
              onChangeText={(text) => {
                setForm({ ...form, username: text });
                setUsernameError("");
              }}
              left={<TextInput.Icon icon="account" />}
              error={!!usernameError}
              style={styles.input}
            />
            {usernameError && (
              <Text style={styles.errorText}>{usernameError}</Text>
            )}

            <TextInput
              mode="outlined"
              label="Email"
              value={session.user.email}
              disabled
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
            />
          </Section>

          <Section title="Coordonnées">
            <TextInput
              mode="outlined"
              label="Téléphone"
              value={form.phone}
              onChangeText={(text) => setForm({ ...form, phone: text })}
              left={<TextInput.Icon icon="phone" />}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Adresse"
              value={form.address}
              onChangeText={(text) => setForm({ ...form, address: text })}
              left={<TextInput.Icon icon="map-marker" />}
              style={styles.input}
            />
          </Section>

          <Section title="À propos">
            <TextInput
              mode="outlined"
              label="Bio"
              value={form.bio}
              onChangeText={(text) => setForm({ ...form, bio: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Section>

          <Section title="Informations professionnelles">
            <TextInput
              mode="outlined"
              label="Site Web"
              value={form.website}
              onChangeText={(text) => setForm({ ...form, website: text })}
              left={<TextInput.Icon icon="web" />}
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Badge d'innovation"
              placeholder="ex: Créativité, Excellence, Innovation"
              value={form.innovationBadges}
              onChangeText={(text) =>
                setForm({ ...form, innovationBadges: text })
              }
              left={<TextInput.Icon icon="star" />}
              style={styles.input}
            />
          </Section>

          <Section title="Réseaux sociaux">
            <SocialInput
              icon="square-instagram"
              value={form.socials.instagram}
              onChange={(val) =>
                setForm({
                  ...form,
                  socials: { ...form.socials, instagram: val },
                })
              }
            />
            <SocialInput
              icon="square-x-twitter"
              value={form.socials.twitter}
              onChange={(val) =>
                setForm({
                  ...form,
                  socials: { ...form.socials, twitter: val },
                })
              }
            />
          </Section>

          <Button
            mode="contained"
            loading={saving}
            onPress={handleUpdate}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
          >
            Sauvegarder
          </Button>
        </View>
      </ScrollView>

      {showSuccessMessage && (
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutDown}
          style={styles.successMessage}
        >
          <MaterialIcons name="check-circle" size={24} color="#fff" />
          <Text style={styles.successText}>Profil mis à jour avec succès</Text>
        </Animated.View>
      )}
    </View>
  );
}

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const SocialInput: React.FC<{
  icon: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ icon, value, onChange }) => (
  <View style={styles.socialInputContainer}>
    <FontAwesome6 name={icon as any} size={20} color="#64748b" />
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={`@nom_utilisateur`}
      style={styles.socialInput}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarWrapper: {
    borderRadius: 60,
    padding: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formContainer: {
    gap: 24,
    marginBottom: 100,
  },
  section: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 16,
  },
  sectionContent: {
    gap: 12,
  },
  input: {
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  socialInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  socialInput: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "transparent",
  },
  saveButton: {
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: "#4f46e5",
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
  successMessage: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  successText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
