import {
  Alert,
  AppState,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput, Text } from "react-native-paper";

import { Link, useNavigation } from "expo-router";
import { supabase } from "@/lib/supabase";
import { StatusBar } from "expo-status-bar";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorEmail, SetErrorEmail] = useState(false);
  const [error, setError] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [icon, setIcon] = useState("eye");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submitForm = async () => {
    if (form.email === "" || form.password === "") {
      setError("Veuillez remplir tous les champs");
      return;
    }

    validateLogin(form.email, form.password);
    if (errorEmail || errorPassword) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password.trim(),
      });

      if (error) {
        switch (error.status) {
          case 400:
            setError("Adresse e-mail ou mot de passe incorrect.");
            setErrorPassword(true);
            SetErrorEmail(true);
            break;
          case 429:
            setError("Trop de tentatives. Veuillez réessayer plus tard.");
            break;
          default:
            setError("Une erreur est survenue. Veuillez réessayer.");
        }
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
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <ScrollView className=" h-full bg-ghost-white">
        <View className="w-full h-full justify-center min-h-[85vh] px-4 py-6 ">
          <Text
            className=" text-deep-blue"
            variant="displayLarge"
            style={{ fontWeight: "bold" }}
          >
            Hé, bon retour!
          </Text>

          <View className="mt-4">
            <View className=" pb-4">
              <TextInput
                error={errorEmail}
                onChangeText={(text) => {
                  setForm({ ...form, email: text });
                  validateLogin(form.email, form.password);
                }}
                label="Email"
                value={form.email}
                style={{
                  backgroundColor: "#FCFDFE",
                }}
              />
            </View>

            <View className=" pb-4">
              <TextInput
                error={errorPassword}
                // onTextInput={(text) => validateLogin(form.email, form.password)}
                label="Mot de passe"
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => {
                  setForm({ ...form, password: text });
                  validateLogin(form.email, form.password);
                }}
                value={form.password}
                right={<TextInput.Icon icon={icon} onPress={handleIconPress} />}
                style={{
                  backgroundColor: "#FCFDFE",
                }}
              />
              {error && (
                <Text variant="titleSmall" style={{ color: "red" }}>
                  {" "}
                  {error}{" "}
                </Text>
              )}
            </View>

            <TouchableOpacity className=" flex items-end" onPress={() => {}}>
              <Text className=" font-bold">Mot de Passe oublié?</Text>
            </TouchableOpacity>
            <View className="mt-7 ">
              <Button
                icon={isSubmitting ? "loading" : ""}
                mode="contained"
                className=" p-5 bg-secondary-200 rounded-3xl color-lime-50"
                onPress={submitForm}
                disabled={isSubmitting || errorEmail || errorPassword}
                style={{
                  width: "100%",
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: "#181F27",
                  opacity:
                    isSubmitting || errorEmail || errorPassword ? 0.5 : 1,
                }}
              >
                Se Connecter
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
            <Text className="text-lg font-psemibold">
              Vous n'avez pas de compte ?
            </Text>
            <Link className="text-sky-blue text-lg " href="/(auth)/signUp">
              S'inscrire
            </Link>
          </View>
          <View className=" mt-10  justify-center items-center">
            <Text className="text-sm ">
              En vous inscrivant, vous acceptez{" "}
              <Link className=" text-sky-blue" href={"/"}>
                {" "}
                l'avis d'utilisation{" "}
              </Link>
              et{" "}
              <Link className=" text-sky-blue" href={"/"}>
                {" "}
                la politique de confidentialité.
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
