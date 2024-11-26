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

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const { session } = useAuth();

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

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView>
      <ScrollView className=" h-full bg-white px-4">
        <View>
          <Avatar
            size={120}
            url={avatarUrl}
            onUpload={(url: string) => {
              setAvatarUrl(url);
              updateProfile({ username, website, avatar_url: url });
            }}
          />

          <View style={[styles.verticallySpaced, styles.mt20]}>
            {/* <View className=" pb-4">
          <TextInput
            error={errorEmail}
            onTextInput={() => validateLogin(form.email, form.password)}
            label="Email"
            onChangeText={(text) => setForm({ ...form, email: text })}
            value={form.email}
          />
        </View> */}
            <TextInput
              placeholder="Email"
              value={session?.user?.email}
              editable={false}
              left={<TextInput.Icon icon="email" />}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
              placeholder="Username"
              value={username || ""}
              onChangeText={(text) => setUsername(text)}
              left={<TextInput.Icon icon="account" />}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
              placeholder="Télephone"
              value={""}
              keyboardType="phone-pad"
              onChangeText={(text) => {}}
              left={<TextInput.Icon icon="phone" />}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
              placeholder="Adresse"
              value={""}
              onChangeText={(text) => {}}
              left={<TextInput.Icon icon="crosshairs-gps" />}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
              placeholder="Website"
              value={website || ""}
              onChangeText={(text) => setWebsite(text)}
              left={<TextInput.Icon icon="web" />}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TextInput
              className=" h-32"
              contentStyle={{
                flexDirection: "row",

                paddingVertical: 15,
                alignItems: "flex-start",
              }}
              multiline
              placeholder="bio"
              value={"" || ""}
              onChangeText={(text) => {}}
              // left={<TextInput.Icon icon="web" />}
            />
          </View>

          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button
              className=" p-5 bg-secondary-200 rounded-3xl"
              disabled={loading}
              onPress={() =>
                updateProfile({ username, website, avatar_url: avatarUrl })
              }
              style={{
                width: "100%",
                padding: 5,
                borderRadius: 10,
                backgroundColor: "#52B2CF",
              }}
            >
              {loading ? "Loading ..." : "Mise à jour"}
            </Button>
          </View>

          {/* <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View> */}
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
