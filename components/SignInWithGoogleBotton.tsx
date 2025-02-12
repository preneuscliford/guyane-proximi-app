import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Image } from "expo-image";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/lib/supabase";

const SignInWithGoogleBotton = () => {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  });

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });
        // console.log(error, data);
      } else {
        throw new Error("no ID token present!");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  //   useEffect(() => {
  //     handleSignIn();
  //   }, [response]);

  return (
    <TouchableOpacity
      onPress={handleSignIn}
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
