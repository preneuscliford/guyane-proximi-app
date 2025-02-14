import {
  FlatList,
  GestureResponderEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "@/app/provider/AuthProvider";
import { supabase } from "@/lib/supabase";
import RemoteImage from "@/components/RemoteImage";
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import RenderHTML from "react-native-render-html";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Image } from "expo-image";

type Post = {
  id: string;
  created_at: string;
  body: string;
  userId: string;
};

type Product = {
  id: string;
  title: string;
  desc: string;
  price: number;
  imageUrl: string;
  category: string;
};
const EditProfil = () => {
  const { session, user, userData } = useAuth();
  // const [userData, setUserData] = useState<UserData | null>(null);

  const [activeTab, setActiveTab] = useState<"posts" | "products">("products");
  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const router = useRouter();

  // ... Gardez les fonctions existantes getProfile et getUserProducts ...
  useEffect(() => {
    if (session?.user.id) {
      if (activeTab === "products") {
        loadProducts();
      } else {
        loadPosts();
      }
    }
  }, [session, activeTab]);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", session!.user.id);

    if (!error) setProducts(data as Product[]);
  };

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("userId", session!.user.id)
      .order("created_at", { ascending: false });

    if (!error) setPosts(data as Post[]);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity className="p-4 bg-white rounded-xl shadow-md mb-4">
      {/* <RemoteImage
        path={item.imageUrl}
        className="w-full h-48 rounded-lg mb-2"
        fallback="product-placeholder"
      />
      <View className="flex-row justify-between items-start">
        <Text className="text-lg font-semibold flex-1">{item.title}</Text>
        <Text className="text-blue-600 font-bold">€{item.price}</Text>
      </View>
      <Text className="text-gray-500 text-sm">{item.category}</Text>
      <Text className="text-gray-700 mt-1" numberOfLines={2}>
        {item.desc}
      </Text> */}
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }: { item: Post }) => (
    <View className="p-4 bg-white rounded-xl shadow-md mb-4">
      {/* <Text className="text-gray-500 text-sm mb-2">
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
      <RenderHTML
        contentWidth={300}
        source={{ html: item.body }}
        baseStyle={{ fontSize: 16, lineHeight: 24 }}
      /> */}
    </View>
  );

  const handleSignOut = async () => {
    try {
      // Déconnexion de Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Révocation du token Google
      await GoogleSignin.signOut();

      // Rediriger vers la page de connexion ou autre
      router.push("/(auth)/signIn");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="light" backgroundColor="#181F27" />

      {/* En-tête */}
      <View className="bg-slate-950 h-52 rounded-br-[80px] px-4">
        <View className="flex-row justify-between items-center pt-16">
          <Text className="text-white text-xl font-bold">Profil</Text>
          <Link href={"/(tabs)/(profile)/editProfile"}>
            <AntDesign name="edit" size={24} color="white" />
          </Link>
        </View>
      </View>

      {/* Contenu principal */}
      <ScrollView scrollEnabled={true} className="flex-1 px-4 -mt-20">
        {/* Carte profil */}
        <View className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <View className=" items-center">
            {userData?.avatar_url.startsWith("https://") ? (
              <View className="flex-col items-center">
                <Image
                  source={{ uri: userData?.avatar_url }}
                  style={{ width: 34, height: 34, borderRadius: 20 }}
                />
                <Text className="text-2xl font-bold text-gray-900">
                  {session?.user?.user_metadata?.full_name}
                </Text>
              </View>
            ) : (
              <RemoteImage
                path={userData?.avatar_url}
                fallback="profile-placeholder"
                style={{ width: 28, height: 28, borderRadius: 20 }}
              />
            )}
          </View>
          <View className="mt-2 items-center">
            <Text className="text-gray-500 mt-1">{session?.user?.email}</Text>
          </View>

          {/* Onglets */}
          <View className="flex-row justify-around my-4">
            <TouchableOpacity
              className={`pb-2 px-4 ${
                activeTab === "products" ? "border-b-2 border-blue-500" : ""
              }`}
              onPress={() => setActiveTab("products")}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "products" ? "text-blue-500" : "text-gray-500"
                }`}
              >
                Produits ({products.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`pb-2 px-4 ${
                activeTab === "posts" ? "border-b-2 border-blue-500" : ""
              }`}
              onPress={() => setActiveTab("posts")}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "posts" ? "text-blue-500" : "text-gray-500"
                }`}
              >
                Posts ({posts.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          {activeTab === "products" ? (
            <FlatList
              scrollEnabled={false}
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          ) : (
            <FlatList
              scrollEnabled={false}
              data={posts}
              renderItem={renderPostItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          )}
        </View>

        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Mon compte
          </Text>

          <View className="grid grid-cols-3 gap-4 mb-6">
            {/* Bouton Paramètres */}
            <TouchableOpacity
              className="items-center p-4 bg-white rounded-xl shadow-sm"
              // onPress={() => router.push("/settings")}
            >
              <Feather name="settings" size={24} color="#0a7ea4" />
              <Text className="text-sm text-gray-700 mt-2">Paramètres</Text>
            </TouchableOpacity>

            {/* Bouton Favoris */}
            <TouchableOpacity
              className="items-center p-4 bg-white rounded-xl shadow-sm"
              // onPress={() => router.push("/favorites")}
            >
              <MaterialCommunityIcons
                name="heart-outline"
                size={24}
                color="#0a7ea4"
              />
              <Text className="text-sm text-gray-700 mt-2">Favoris</Text>
              <View className="absolute top-2 right-2 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-white text-xs">3</Text>
              </View>
            </TouchableOpacity>

            {/* Bouton Commandes */}
            <TouchableOpacity
              className="items-center p-4 bg-white rounded-xl shadow-sm"
              // onPress={() => router.push("/orders")}
            >
              <MaterialIcons name="local-shipping" size={24} color="#0a7ea4" />
              <Text className="text-sm text-gray-700 mt-2">Commandes</Text>
            </TouchableOpacity>
          </View>

          {/* Ligne de boutons secondaires */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="flex-row items-center bg-blue-50 px-4 py-2 rounded-full"
              // onPress={() => router.push("/help")}
            >
              <Feather name="help-circle" size={18} color="#0a7ea4" />
              <Text className="text-blue-600 ml-2">Aide</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center bg-blue-50 px-4 py-2 rounded-full"
              onPress={() => {
                /* Partage du profil */
              }}
            >
              <Feather name="share-2" size={18} color="#0a7ea4" />
              <Text className="text-blue-600 ml-2">Partager</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Ajouter aussi dans la section d'édition du profil */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-blue-100 p-4 rounded-xl mb-4"
          // onPress={() => router.push("/premium")}
        >
          <MaterialIcons name="workspace-premium" size={24} color="#0a7ea4" />
          <View className="ml-3">
            <Text className="text-blue-600 font-semibold">
              Passer à Premium
            </Text>
            <Text className="text-blue-500 text-xs">
              Débloquez des avantages exclusifs
            </Text>
          </View>
        </TouchableOpacity>
        {/* Bouton de déconnexion */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="border border-red-500 rounded-xl py-4 mb-8"
        >
          <Text className="text-red-600 text-center font-semibold">
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditProfil;
