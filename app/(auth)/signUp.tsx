import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Burnt from "burnt";

import SignInWithGoogleBotton from "@/components/SignInWithGoogleBotton";
import { supabase } from "@/lib/supabase";

const signUp = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // États pour les messages d'erreur
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Validation locale
  const validateFields = () => {
    let isValid = true;

    // Réinitialiser les erreurs
    setUsernameError("");
    setEmailError("");
    setPasswordError("");

    if (!username.trim()) {
      setUsernameError("Le nom d'utilisateur est requis.");
      isValid = false;
    }
    if (!emailAddress.trim()) {
      setEmailError("L'email est requis.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      setEmailError("Format de l'email invalide.");
      isValid = false;
    }
    if (password.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
      isValid = false;
    }

    return isValid;
  };

  // Fonction principale pour la création du compte
  const signUpWithEmail = async () => {
    if (!validateFields()) {
      return; // Arrêter si validation échoue
    }

    setLoading(true);

    const { data: existingUsers, error: checkError } = await supabase
      .from("profiles") // Remplacez "profiles" par le nom de votre table
      .select("id")
      .eq("username", username)
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

    if (existingUsers) {
      setLoading(false);
      setUsernameError("Ce nom d'utilisateur est déjà pris.");
      return;
    }

    // Créer le compte avec email et mot de passe
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: emailAddress,
        password: password,
      }
    );

    if (signUpError) {
      Burnt.toast({
        title: "Échec de la création du compte",
        message: signUpError.message,
        preset: "error",
      });
      setLoading(false);
      return;
    }

    const user = signUpData.user;

    // Mise à jour du profil avec le nom d'utilisateur
    const { error: updateError } = await supabase
      .from("profiles") // Remplacez "profiles" par le nom de votre table
      .upsert({
        id: user?.id, // ID de l'utilisateur
        username: username,
      });

    if (updateError) {
      Burnt.toast({
        title: "Erreur de mise à jour",
        preset: "error",
        message: "Impossible de mettre à jour le nom d'utilisateur.",
      });
      setLoading(false);
      return;
    }

    Burnt.toast({
      title: "Compte créé avec succès !",
      message: "Veuillez vérifier votre email pour confirmer votre compte.",
      preset: "done",
    });

    Burnt.toast({
      title: "Compte créé avec succès !",
      message: "Veuillez vérifier votre email pour confirmer votre compte.",
      preset: "done",
    });

    // Réinitialiser les champs et rediriger
    setUsername("");
    setEmailAddress("");
    setPassword("");
    router.push("/(auth)/signIn");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900">
          Créer un compte
        </Text>
        <Text className="text-gray-500 mt-2">Rejoignez notre communauté</Text>
      </View>
      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 mb-1">Nom d'utilisateur</Text>
          <TextInput
            value={username}
            placeholder="Votre pseudo"
            onChangeText={(text) => setUsername(text)}
            className={`h-12 border ${
              usernameError ? "border-red-500" : "border-gray-200"
            } rounded-lg px-4`}
            autoCapitalize="none"
          />
          {usernameError ? (
            <Text className="text-red-500 text-sm mt-1">{usernameError}</Text>
          ) : null}
        </View>
        <View>
          <Text className="text-gray-700 mb-1">Email</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="exemple@email.com"
            onChangeText={(text) => setEmailAddress(text)}
            className={`h-12 border ${
              emailError ? "border-red-500" : "border-gray-200"
            } rounded-lg px-4`}
            keyboardType="email-address"
          />
          {emailError ? (
            <Text className="text-red-500 text-sm mt-1">{emailError}</Text>
          ) : null}
        </View>
        <View>
          <Text className="text-gray-700 mb-1">Mot de passe</Text>
          <TextInput
            value={password}
            placeholder="••••••••"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            className={`h-12 border ${
              passwordError ? "border-red-500" : "border-gray-200"
            } rounded-lg px-4`}
          />
          {passwordError ? (
            <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
          ) : null}
        </View>
      </View>
      <TouchableOpacity
        onPress={signUpWithEmail}
        disabled={loading}
        className="h-12 bg-blue-500 rounded-lg justify-center items-center mt-8"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-medium">Créer mon compte</Text>
        )}
      </TouchableOpacity>
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="mx-4 text-gray-400">Ou</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>
      <SignInWithGoogleBotton />
      <TouchableOpacity
        onPress={() => router.push("/(auth)/signIn")}
        className="mt-6"
      >
        <Text className="text-center text-gray-600 text-base">
          Déjà un compte ?{" "}
          <Text className="text-blue-500 font-bold underline">
            Se connecter
          </Text>
        </Text>
      </TouchableOpacity>
      <View className="flex items-center mt-8">
        <Text onPress={() => {}} className="text-center text-gray-500 text-xs">
          En continuant, vous acceptez nos{" "}
          <Text className="text-blue-500 underline">
            Conditions d'utilisation
          </Text>{" "}
          et{" "}
          <Text className="text-blue-500 underline">
            Politique de confidentialité
          </Text>
        </Text>
        <Text
          onPress={() => {}}
          className="text-center text-gray-500 text-xs mt-2"
        >
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default signUp;
