import { ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { ActivityIndicator, Button, Text } from "react-native-paper";
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

const Details = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement du produit:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Produit non trouvé</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="p-4">
          <ProductsImage
            path={product.imageUrl}
            fallback={"product image"}
            style={{
              height: 300,
              width: "100%",
              objectFit: "cover",
              borderRadius: 10,
            }}
          />

          <View className="mt-4">
            <Text variant="headlineSmall" className="font-bold">
              {product.title}
            </Text>
            <Text variant="titleLarge" className="text-green-600 mt-2">
              {product.price} €
            </Text>
            <Text variant="bodyLarge" className="mt-4">
              {product.desc}
            </Text>

            <View className="mt-6">
              <Button
                mode="contained"
                onPress={() => {
                  /* Ajouter la logique pour contacter le vendeur */
                }}
                style={{ borderRadius: 8 }}
              >
                Contacter le vendeur
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;
