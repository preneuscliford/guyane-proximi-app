import { View, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { ActivityIndicator, Badge, Card, Chip, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductsImage from "@/components/ProductsImage";

interface Product {
  id: number;
  title: string;
  desc: string;
  price: string;
  imageUrl: string;
  category: string;
  created_at: string;
}

const ProductsByCategory = () => {
  const { category } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
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
        <ActivityIndicator style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="p-4">
          <Text variant="headlineMedium" className="font-bold mb-4">
            {category}
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => handleProductPress(product.id)}
                style={{ width: "48%", marginBottom: 16 }}
              >
                <Card>
                  <ProductsImage
                    path={product.imageUrl}
                    fallback={"product image"}
                    style={{
                      height: 160,
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Chip style={{ marginVertical: 5, marginHorizontal: 5 }}>
                    {product.category}
                  </Chip>
                  <Card.Content>
                    <Badge size={25} style={{ alignSelf: "flex-start" }}>
                      {`${product.price} €`}
                    </Badge>
                    <Text variant="titleSmall" numberOfLines={1}>
                      {product.title}
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductsByCategory;
