import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const SignInWithGoogleBotton = () => {
  useWarmUpBrowser();

  const config = {
    webClientId: process.env.EXPO_PUBLIC_WEBCLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_ID,
  };

  const [request, response, prompAsync] = Google.useAuthRequest(config);

  const handleSignIn = async () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const token = authentication?.accessToken;
      console.log(token);
    }
  };

  useEffect(() => {
    handleSignIn();
  }, [response]);

  return (
    <TouchableOpacity
      onPress={() => prompAsync()}
      className="h-12 border border-gray-200 rounded-lg flex-row items-center justify-center space-x-2"
    >
      <Image
        source={require("../assets/icons/logo-google.svg")}
        style={{
          width: 25,
          height: 25,
          objectFit: "contain",
        }}
      />
      <Text className="text-gray-700 font-medium"> Continuer avec Google</Text>
    </TouchableOpacity>
  );
};

export default SignInWithGoogleBotton;

const styles = StyleSheet.create({});
