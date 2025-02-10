import React, { useCallback, useEffect, useState } from "react";
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
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { client } from "@/hooks/supabaseClient";

import SignInWithGoogleBotton from "@/components/SignInWithGoogleBotton";

WebBrowser.maybeCompleteAuthSession();

const signIn = () => {
  useWarmUpBrowser();

  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Connexion par email et mot de passe
  const onSignInPress = async () => {};

  // Connexion via Google OAuth

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900">Se connecter</Text>
        <Text className="text-gray-500 mt-2">
          Connectez-vous à votre compte
        </Text>
      </View>

      <View className="space-y-4">
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
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="mt-2 self-end"
        >
          <Text className="text-center text-gray-500 underline">
            Mot de passe oublé ?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onSignInPress}
        disabled={loading}
        className="h-12 bg-blue-500 rounded-lg justify-center items-center mt-8"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-medium">Se connecter</Text>
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
        onPress={() => router.push("/(auth)/signUp")}
        className="mt-6"
      >
        <Text className="text-center text-gray-600 text-base">
          Pas encore de compte ?{" "}
          <Text className="text-blue-500 font-bold underline">S'inscrire</Text>
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

export default signIn;
