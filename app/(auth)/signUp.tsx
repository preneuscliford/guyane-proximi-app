import {
  Alert,
  AppState,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput, Text } from "react-native-paper";

import { Link, router } from "expo-router";
import { Pressable } from "react-native";
import { supabase } from "@/lib/supabase";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorEmail, SetErrorEmail] = useState(false);
  const [error, setError] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [icon, setIcon] = useState("eye");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submitForm = async () => {
    if (!form.username || !form.email || !form.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    validateLogin(form.email, form.password);
    if (errorEmail || errorPassword) return;

    setSubmitting(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password.trim(),
        options: {
          data: {
            username: form.username.trim(),
          },
        },
      });

      if (authError) {
        if (authError.status === 422) {
          setError("Ce compte existe déjà.");
          SetErrorEmail(true);
        } else {
          setError("Une erreur est survenue lors de l'inscription");
        }
        return;
      }

      if (authData.session) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.session.user.id,
          username: form.username.trim(),
          email: form.email.trim(),
          updated_at: new Date(),
        });

        if (profileError) {
          console.error("Erreur lors de la création du profil:", profileError);
          setError("Erreur lors de la création du profil");
          return;
        }

        router.push("/(profile)/editProfile");
      } else {
        Alert.alert(
          "Vérification par email",
          "Veuillez vérifier votre boîte mail pour confirmer votre inscription."
        );
      }
    } catch (error) {
      console.error(error);
      setError("Une erreur inattendue est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIconPress = () => {
    setSecureTextEntry(!secureTextEntry);
    setIcon(secureTextEntry ? "eye-off-outline" : "eye");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateLogin = (email: string, password: string) => {
    setError("");
    if (!validateEmail(email)) {
      SetErrorEmail(true);
    } else {
      SetErrorEmail(false);
    }
    if (!validatePassword(password)) {
      setErrorPassword(true);
    } else {
      setErrorPassword(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className=" h-full bg-light-gray">
        <View className=" justify-center min-h-[85vh] px-4 py-6 ">
          {/* <Image
            source={images.logo}
            className="w-[136px] h-[35px]"
            resizeMode="contain"
          /> */}
          <Text variant="displayLarge" style={{ fontWeight: "600" }}>
            Bienvenue!
          </Text>
          <View className="mt-4 ">
            <View className=" pb-4">
              <TextInput
                error={errorEmail}
                onTextInput={() => validateLogin(form.email, form.password)}
                label="Email"
                onChangeText={(text) => setForm({ ...form, email: text })}
                value={form.email}
              />
            </View>

            <View className=" pb-4">
              <TextInput
                error={errorPassword}
                onTextInput={() => validateLogin(form.email, form.password)}
                label="Mot de passe"
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setForm({ ...form, password: text })}
                value={form.password}
                right={<TextInput.Icon icon={icon} onPress={handleIconPress} />}
              />

              {error && (
                <Text variant="titleSmall" style={{ color: "red" }}>
                  {" "}
                  {error}{" "}
                </Text>
              )}
            </View>

            <View className="mt-7">
              <Button
                icon="camera"
                mode="contained"
                className=" p-5 bg-secondary-200 rounded-3xl"
                onPress={submitForm}
                disabled={isSubmitting || errorEmail || errorPassword}
                style={{ width: "100%", padding: 5, borderRadius: 10 }}
              >
                S'inscrir
              </Button>
            </View>
          </View>
          {/* <View className="mt-10">
            <Text className="text-white text-center">Ou Continue avec</Text>
            <View className="mt-2">
              <TouchableOpacity className=" bg-zinc-200 rounded-lg justify-center items-center py-2 px-4">
                <Image
                  source={require("../../assets/images/google.png")}
                  style={{ width: "100%", height: 30, objectFit: "contain" }}
                />
              </TouchableOpacity>
            </View>
          </View> */}
          <View className="justify-center flex-row gap-2 pt-5">
            <Text className="text-lg  font-psemibold">
              Vous avez déjà un compte ?
            </Text>
            <Link className=" text-lg  font-psemibold" href="/login">
              Se connecter
            </Link>
          </View>
          <View className=" mt-10  justify-center items-center">
            <Text className="text-sm ">
              En vous inscrivant, vous acceptez{" "}
              <Link className=" text-cyan-600" href={"/"}>
                {" "}
                l'avis d'utilisation{" "}
              </Link>
              et{" "}
              <Link className=" text-cyan-600" href={"/"}>
                {" "}
                la politique de confidentialité
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
