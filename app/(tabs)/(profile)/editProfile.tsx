import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, ScrollView, BackHandler } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/provider/AuthProvider";
import { Redirect } from "expo-router";
import Avatar from "@/components/Avatar";
import { Button, TextInput, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Account() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState([]);
  const [usernameError, setUsernameError] = useState("");

  const [form, setForm] = useState({
    username: "",
    website: "",
    avatarUrl: "",
    phone: "",
    address: "",
    bio: "",
  });

  const { session, userData, user } = useAuth();
  const router = useRouter();

  if (!session) {
    return <Redirect href={"/"} />;
  }

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  useEffect(() => {
    const backAction = () => {
      if (userData?.username || user?.user_metadata?.full_name === null) {
        Alert.alert(
          "Attention",
          "Vous devez ajouter un nom d'utilisateur avant de quitter.",
          [
            {
              text: "OK",
              onPress: () => null,
              style: "cancel",
            },
          ]
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

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, id, full_name`)
        .eq("id", session?.user.id)
        .single();

      if (error) throw error;
      setUserInfo(data as any);

      if (data) {
        setForm({
          username: data.username || "",
          website: data.website || "",
          avatarUrl: data.avatar_url || "",
          phone: "",
          address: "",
          bio: "",
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

  async function checkUsernameAvailability(username: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .neq("id", session?.user.id)
      .single();

    if (error) throw error;
    return !data;
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      if (form.username === "" && userData?.username === null) {
        Alert.alert("Erreur", "Le nom d'utilisateur est requis.");
        return null;
      }

      // const isUsernameAvailable = await checkUsernameAvailability(
      //   form.username
      // );
      // if (!isUsernameAvailable) {
      //   setUsernameError("Ce nom d'utilisateur est déjà pris.");
      //   return;
      // }

      const updates = {
        id: session?.user.id,
        username: form.username,
        website: form.website,
        avatar_url: form.avatarUrl,
        // phone: form.phone,
        // address: form.address,
        // bio: form.bio,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F8FD" }}>
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Modifier le profil
          </Text>
        </View>

        <View style={styles.avatarContainer}>
          <Avatar
            size={140}
            url={form.avatarUrl ? form.avatarUrl : userData?.avatar_url || ""}
            onUpload={(url: string) => {
              setForm({ ...form, avatarUrl: url });
            }}
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Informations Publiques</Text>

          <TextInput
            mode="outlined"
            label="Nom d'utilisateur"
            value={form.username || user?.user_metadata?.full_name || ""}
            placeholder={
              userData?.username || user?.user_metadata?.full_name
                ? ""
                : "Nom d'utilisateur"
            }
            onChangeText={(text) => {
              setForm({ ...form, username: text });
              setUsernameError("");
            }}
            left={<TextInput.Icon icon="account-circle" />}
            error={!!usernameError}
            style={styles.input}
            autoCapitalize="none"
          />
          {usernameError && (
            <Text style={styles.errorText}>{usernameError}</Text>
          )}

          <TextInput
            mode="outlined"
            label="Email"
            value={session?.user?.email}
            editable={false}
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
          />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Informations de Contact
          </Text>

          <View style={styles.row}>
            <TextInput
              mode="outlined"
              label="Téléphone"
              value={form.phone}
              keyboardType="phone-pad"
              onChangeText={(text) => setForm({ ...form, phone: text })}
              left={<TextInput.Icon icon="phone" />}
              style={[styles.input, { flex: 1 }]}
            />
            <TextInput
              mode="outlined"
              label="Site web"
              value={form.website}
              onChangeText={(text) => setForm({ ...form, website: text })}
              left={<TextInput.Icon icon="web" />}
              style={[styles.input, { flex: 1, marginLeft: 10 }]}
            />
          </View>

          <TextInput
            mode="outlined"
            label="Adresse"
            value={form.address}
            onChangeText={(text) => setForm({ ...form, address: text })}
            left={<TextInput.Icon icon="map-marker" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Bio"
            value={form.bio}
            onChangeText={(text) => setForm({ ...form, bio: text })}
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 120 }]}
            left={<TextInput.Icon icon="text-box" />}
          />

          <Button
            mode="contained"
            onPress={updateProfile}
            loading={loading}
            // disabled={
            //   loading || (form.username === "" && userData?.full_name === null)
            // }
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            {loading ? "Sauvegarde..." : "Enregistrer les modifications"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarButton: {
    marginTop: 12,
  },
  formContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#666",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FCFDFE",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 12,
    marginTop: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#181F27",
    color: "#F4F7FC",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 4,
  },
  buttonContent: {
    height: 48,
  },
  errorText: {
    color: "#ff4444",
    marginTop: -8,
    marginBottom: 12,
    fontSize: 13,
  },
});
