import { FlatList, View, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Text, Chip, useTheme } from "react-native-paper";
import { router } from "expo-router";
import ProductCard from "./ProductCard";
import ProductsImage from "./ProductsImage";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  condition?: string;
}

const LastItems = () => {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;
        setProducts(data as Product[]);
      } catch (err) {
        // setError(err);
        Alert.alert("Erreur", "Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductPress = (productId: number) => {
    router.push(`/product/details?id=${productId}`);
  };

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        Dernières trouvailles
      </Text>

      <FlatList
        data={products}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 16 }}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <Card
            style={{
              flex: 1,
              maxWidth: "48%",
              backgroundColor: theme.colors.background,
            }}
            onPress={() => handleProductPress(item.id)}
          >
            <ProductsImage
              path={item?.imageUrl}
              fallback={"product image"}
              style={{
                height: 160,
                width: "100%",
                objectFit: "cover",
              }}
            />
            <Card.Content style={{ paddingTop: 12 }}>
              <Chip
                mode="outlined"
                style={{ alignSelf: "flex-start", marginBottom: 8 }}
              >
                {item.category}
              </Chip>
              <Text
                variant="bodyLarge"
                numberOfLines={2}
                style={{ fontWeight: "500", marginBottom: 4 }}
              >
                {item.title}
              </Text>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary }}
              >
                {item.price.toFixed(2)}€
              </Text>
              {item.condition && (
                <Text
                  variant="labelSmall"
                  style={{
                    color: theme.colors.onSurfaceDisabled,
                    marginTop: 4,
                  }}
                >
                  {item.condition}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default LastItems;
