import { ScrollView, View, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Slider from "@/components/Slider";
import { ActivityIndicator, Badge, Card, Chip, Text } from "react-native-paper";
import LastItems from "@/components/LastItems";
import ProductsImage from "@/components/ProductsImage";
import Cathegory from "@/components/Cathegory";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import DisplayEvents from "@/components/DisplayEvent";

interface Product {
  id: number;
  title: string;
  desc: string;
  price: string;
  imageUrl: string;
  category: string;
  created_at: string;
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      const uniqueCategories = [
        ...new Set(data?.map((product) => product.category)),
      ];
      setCategories(uniqueCategories.filter(Boolean));
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setLoading(false);
    }
  };

  const handleProductPress = (productId: number) => {
    router.push({
      pathname: "/product/details",
      params: { id: productId },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <StatusBar style="light" backgroundColor="#9333EA" />
        <ScrollView horizontal={false} scrollEnabled={true}>
          {/* En-tête avec recherche et profil */}
          <Header />

          {/* Section des catégories */}
          <View style={{ marginTop: 20, marginBottom: 10 }}>
            <Text
              style={{
                paddingHorizontal: 15,
                fontSize: 20,
                fontWeight: "bold",
                color: "#1A1A1A",
              }}
            >
              Nos Meilleurs offres
            </Text>
            <Slider />
          </View>
          <Cathegory />

          <LastItems />

          {/* Événements à venir */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Événements</Text>
            <Text style={styles.seeAll}>Voir tout</Text>
          </View>
          {/* <EventItem /> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FD",
  },
  promoBanner: {
    backgroundColor: "#007AFF",
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  promoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  seeAll: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
