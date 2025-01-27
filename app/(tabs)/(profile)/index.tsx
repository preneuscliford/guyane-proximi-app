import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "@/app/provider/AuthProvider";
import { supabase } from "@/lib/supabase";
import RemoteImage from "@/components/RemoteImage";

const EditProfil = () => {
  const navigation = useNavigation();
  const { session, user } = useAuth(); // Ajout de signOut pour la déconnexion
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userProducts, setUserProducts] = useState<any[]>([]); // Pour stocker les produits de l'utilisateur

  const router = useRouter();

  interface UserData {
    avatar_url: string;
    username: string;
    website?: string;
  }

  useEffect(() => {
    if (session) {
      getProfile();
      getUserProducts(); // Récupérer les produits de l'utilisateur
    }
  }, [session]);

  // Récupérer le profil de l'utilisateur
  async function getProfile() {
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      setUserData(data as any);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  }

  // Récupérer les produits postés par l'utilisateur
  async function getUserProducts() {
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", session.user.id); // Supposons que la table des produits a une colonne `user_id`

      if (error) {
        throw error;
      }
      setUserProducts(data || []);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(
          "Erreur lors de la récupération des produits",
          error.message
        );
      }
    }
  }

  // Déconnexion de l'utilisateur
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut(); // Utilisez la fonction signOut de votre AuthProvider
      router.navigate("/(auth)/signUp"); // Redirigez l'utilisateur vers la page d'authentification
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erreur lors de la déconnexion", error.message);
      }
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <StatusBar style="light" backgroundColor="#0a7ea4" />
      <ScrollView className="h-full">
        {/* En-tête du profil */}
        <View className="bg-[#0a7ea4] w-[100%] h-[200px] rounded-br-[80px]">
          <View className="flex-row items-center justify-between px-4 py-6">
            <Text className="font-medium text-white">Profile</Text>
            <Link href={"/(tabs)/(profile)/editProfile"}>
              <AntDesign name="edit" size={24} color="white" />
            </Link>
          </View>
        </View>

        {/* Section du profil */}
        <View className="relative justify-center items-center mt-20 px-4">
          <View className="absolute bg-slate-50 w-[100%] h-auto px-4 rounded-[10px] pb-6">
            <View className="relative justify-center items-center">
              {/* Avatar */}
              <RemoteImage
                path={userData?.avatar_url}
                fallback="avatarImage"
                resizeMode="cover"
                className="w-28 h-28 rounded-2xl justify-center items-center mt-4"
              />

              {/* Nom d'utilisateur et email */}
              <View className="mt-2">
                <Text className="text-center font-bold">
                  {userData?.username}
                </Text>
                <Text className="text-center text-gray-500">
                  {session?.user?.email}
                </Text>
              </View>

              {/* Bouton de déconnexion */}
              <TouchableOpacity
                onPress={handleSignOut}
                className="mt-4 bg-red-500 px-6 py-2 rounded-full"
              >
                <Text className="text-white font-bold">Se déconnecter</Text>
              </TouchableOpacity>
            </View>

            {/* Section des produits postés par l'utilisateur */}
            <View className="mt-6">
              <Text className="text-lg font-bold mb-4">Mes produits</Text>
              {userProducts.length > 0 ? (
                userProducts.map((product) => (
                  <View
                    key={product.id}
                    className="mb-4 p-4 bg-white rounded-lg shadow-sm"
                  >
                    <Text className="font-bold">{product.name}</Text>
                    <Text className="text-gray-500">{product.description}</Text>
                    <Text className="text-gray-500">
                      Prix: {product.price} €
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-500">Aucun produit posté.</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfil;

const styles = StyleSheet.create({});
