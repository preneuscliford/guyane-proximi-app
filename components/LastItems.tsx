import { FlatList, View, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Text, Chip, useTheme } from "react-native-paper";
import { router } from "expo-router";
import ProductsImage from "./ProductsImage";

interface Listing {
  id: string; // Changé pour UUID
  title: string;
  price: number;
  type: "product" | "service" | "innovation";
  media_urls: string[];
  specs: {
    condition?: string;
    // Ajouter d'autres propriétés possibles du JSON specs
  };
  tags?: string[];
  created_at: string;
}

const LastItems = () => {
  const theme = useTheme();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select(
            `
            id,
            title,
            price,
            type,
            media_urls,
            specs,
            tags,
            created_at
          `
          )
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;
        setListings(data as Listing[]);
      } catch (err) {
        Alert.alert("Erreur", "Impossible de charger les annonces");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleProductPress = (listingId: string) => {
    router.push(`/listing/details?id=${listingId}`);
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
        Dernières publications
      </Text>

      <FlatList
        data={listings}
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
              path={item?.media_urls?.[0]} // Utilisation du premier média
              fallback={"default-listing.jpg"}
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
                {item.type} {/* Type de listing */}
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
                {item.price?.toFixed(2)}€
              </Text>
              {item.specs?.condition && (
                <Text
                  variant="labelSmall"
                  style={{
                    color: theme.colors.onSurfaceDisabled,
                    marginTop: 4,
                  }}
                >
                  {item.specs.condition}
                </Text>
              )}
              {item.tags?.length > 0 && (
                <Text
                  variant="labelSmall"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 4,
                  }}
                >
                  #{item.tags[0]}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default LastItems;
