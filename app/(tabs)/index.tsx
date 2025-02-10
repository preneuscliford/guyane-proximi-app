import { ScrollView, View, TouchableOpacity } from "react-native";
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
    <ScrollView scrollEnabled={true} className=" bg-ghost-white">
      <SafeAreaView>
        <StatusBar style="dark" backgroundColor="#F5F8FD" />
        <Header />
        <Slider />

        {/* Section Catégories */}
        <Cathegory />

        {/* Section Derniers Produits */}
        <LastItems />

        <DisplayEvents />

        {/* Section par Catégories */}
        {/* {categories.map(
          (category) =>
            category && (
              <View key={category} className="mt-6 px-4">
                <Text
                  variant="titleLarge"
                  className="font-bold mb-4 text-ice-white"
                >
                  {category}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {products
                    .filter((p) => p.category === category)
                    .map((product) => (
                      <TouchableOpacity
                        key={product.id}
                        onPress={() => handleProductPress(product.id)}
                      >
                        <View style={{ margin: 5, width: 180 }}>
                          <Card style={{ width: "100%" }}>
                            <ProductsImage
                              path={product.imageUrl}
                              fallback={"product image"}
                              style={{
                                height: 160,
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <Chip
                              style={{ marginVertical: 5, marginHorizontal: 5 }}
                            >
                              {product.category}
                            </Chip>
                            <Card.Content>
                              <Badge
                                size={25}
                                style={{ alignSelf: "flex-start" }}
                              >
                                {`${product.price} €`}
                              </Badge>
                              <Text variant="titleSmall" numberOfLines={1}>
                                {product.title}
                              </Text>
                            </Card.Content>
                          </Card>
                        </View>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            )
        )} */}
      </SafeAreaView>
    </ScrollView>
  );
}
