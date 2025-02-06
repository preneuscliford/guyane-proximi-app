import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignIn, useOAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import * as Linking from "expo-linking";

import { useWarmUpBrowser } from "@/hooks/useFunctions";
import { client } from "@/hooks/supabaseClient";

const signIn = () => {
  useWarmUpBrowser();
  // Utiliser useSignIn pour le login par email/mot de passe
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const { user } = useUser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Connexion par email et mot de passe
  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      // Créer une tentative de connexion avec email et mot de passe
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        console.log("Connexion incomplète :", result);
      }
    } catch (err: any) {
      console.error("Erreur de connexion :", err);
      alert(err.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  // Connexion via Google OAuth

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "myapp" }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

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

      <TouchableOpacity
        onPress={handleGoogleSignIn}
        className="h-12 border border-gray-200 rounded-lg flex-row items-center justify-center space-x-2"
      >
        <Ionicons name="logo-google" size={20} color="#DB4437" />
        <Text className="text-gray-700 font-medium">Continuer avec Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/signUp")}
        className="mt-6"
      >
        <Text className="text-center text-gray-500">
          Pas encore de compte ?{" "}
          <Text className="text-blue-500">S'inscrire</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default signIn;
