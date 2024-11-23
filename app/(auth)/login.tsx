import {
  Alert,
  AppState,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submitForm = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert(
        "Erreur",
        "Veillez remplisez tous les champs s'il vous Plaît!! "
      );
    }

    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) Alert.alert(error.message);
    setSubmitting(false);

    try {
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className=" h-full bg-[#161622]">
      <ScrollView>
        <View className="w-full h-full justify-center min-h-[85vh] px-4 py-6 ">
          <Text className="text-2xl   text-semibold font-psemibold mb-6">
            Connectez-Vous avec Aora
          </Text>

          <View className="mt-4">
            <TextInput
              onChangeText={(text) => setForm({ ...form, email: text })}
              placeholder="Email"
              placeholderTextColor="#333"
              value={form.email}
              className="bg-zinc-200 text-textgray mt-3 rounded-xl py-3 px-5"
            />
            <TextInput
              secureTextEntry={true}
              onChangeText={(text) => setForm({ ...form, password: text })}
              placeholder="Password"
              placeholderTextColor="#333"
              value={form.password}
              className="bg-zinc-200 text-textgray mt-3 rounded-xl py-3 px-5"
            />
            <TouchableOpacity
              className="mt-2 flex items-end"
              onPress={() => {}}
            >
              <Text className=" text-white font-bold">
                Mot de Passe oublié?
              </Text>
            </TouchableOpacity>
            <View className="mt-7">
              <Pressable
                onPress={submitForm}
                disabled={isSubmitting}
                className=" bg-slate-500 rounded-lg justify-center items-center py-4 px-3"
              >
                <Text
                  className={`${
                    isSubmitting ? "text-slate-400 " : "text-white"
                  } `}
                  font-pextrabold
                >
                  Se Connecter
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-10">
            <Text className="text-white text-center">Ou Continue avec</Text>
            <View className="mt-2">
              <TouchableOpacity className=" bg-zinc-200 rounded-lg justify-center items-center py-2 px-4">
                <Image
                  source={require("../../assets/images/google.png")}
                  style={{ width: "100%", height: 30, objectFit: "contain" }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="justify-center flex-row gap-2 pt-5">
            <Text className="text-lg text-gray-200 font-psemibold">
              Vous n'avez pas de compte ?
            </Text>
            <Link className=" text-lg text-white" href="/signUp">
              S'inscrire
            </Link>
          </View>
          <View className=" mt-10 text-white justify-center items-center">
            <Text className="text-sm text-white">
              En vous inscrivant, vous acceptez{" "}
              <Link className=" text-cyan-300" href={"/"}>
                {" "}
                l'avis d'utilisation{" "}
              </Link>
              et{" "}
              <Link className=" text-cyan-300" href={"/"}>
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

export default SignIn;

const styles = StyleSheet.create({});