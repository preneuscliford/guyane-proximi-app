import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { client } from "@/hooks/supabaseClient";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Image } from "expo-image";
import SignInWithGoogleBotton from "@/components/SignInWithGoogleBotton";

const signUp = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!emailAddress || !password || !username) {
      alert("Veuillez remplir tous les champs");
      return;
    }
  };

  // Vérification du code
  const onVerifyPress = async () => {};

  // Gestion des erreurs
  const handleSignUpError = (error: any) => {
    const errorMap: Record<string, string> = {
      form_password_incorrect: "Mot de passe trop faible (min. 8 caractères)",
      form_identifier_exists: "Un compte existe déjà avec cet email",
      form_param_format_invalid: "Format email invalide",
    };

    const message = error.errors?.[0]?.code
      ? errorMap[error.errors[0].code] || "Erreur inconnue"
      : "Échec de la création du compte";

    alert(message);
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-white px-6 justify-center">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900">Vérification</Text>
          <Text className="text-gray-500 mt-2">
            Entrez le code reçu par email
          </Text>
        </View>
        <TextInput
          value={code}
          placeholder="Code de vérification"
          onChangeText={setCode}
          className="h-12 border border-gray-200 rounded-lg px-4 mb-4"
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={loading}
          className="h-12 bg-blue-500 rounded-lg justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-medium">Vérifier</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
            onChangeText={setUsername}
            className="h-12 border border-gray-200 rounded-lg px-4"
            autoCapitalize="none"
          />
        </View>
        <View>
          <Text className="text-gray-700 mb-1">Email</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="exemple@email.com"
            onChangeText={setEmailAddress}
            className="h-12 border border-gray-200 rounded-lg px-4"
            keyboardType="email-address"
          />
        </View>
        <View>
          <Text className="text-gray-700 mb-1">Mot de passe</Text>
          <TextInput
            value={password}
            placeholder="••••••••"
            secureTextEntry
            onChangeText={setPassword}
            className="h-12 border border-gray-200 rounded-lg px-4"
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={onSignUpPress}
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
      <View>
        <SignInWithGoogleBotton />
      </View>
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
