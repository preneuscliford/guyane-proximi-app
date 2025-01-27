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
import { StatusBar } from "expo-status-bar";

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
    if (!form.email || !form.password) {
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

      router.push("/(tabs)/(profile)/editProfile");
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

  const validateLogin = (email: string, password: string): boolean => {
    setError("");
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    SetErrorEmail(!isEmailValid);
    setErrorPassword(!isPasswordValid);

    return isEmailValid && isPasswordValid; // Return true if both are valid
  };

  return (
    <SafeAreaView>
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <ScrollView className=" h-full bg-ghost-white">
        <View className=" justify-center min-h-[85vh] px-4 py-6 ">
          {/* <Image
            source={images.logo}
            className="w-[136px] h-[35px]"
            resizeMode="contain"
          /> */}
          <Text
            variant="displayLarge"
            style={{ fontWeight: "600", color: "#181F27" }}
          >
            Bienvenue!
          </Text>
          <View className="mt-4 ">
            <View className=" pb-4">
              <TextInput
                error={errorEmail}
                onBlur={() => validateLogin(form.email, form.password)}
                label="Email"
                onChangeText={(text) => setForm({ ...form, email: text })}
                value={form.email}
                style={{
                  backgroundColor: "#FCFDFE",
                }}
              />
            </View>

            <View className=" pb-4">
              <TextInput
                error={errorPassword}
                onBlur={() => validateLogin(form.email, form.password)}
                label="Mot de passe"
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setForm({ ...form, password: text })}
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

            <View className="mt-7">
              <Button
                icon={isSubmitting ? "loading" : ""}
                mode="contained"
                className=" p-5 bg-secondary-200 rounded-3xl"
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
