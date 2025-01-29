import {
  FlatList,
  View,
  ActivityIndicator,
  Alert,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Text, Chip, useTheme, IconButton } from "react-native-paper";
import { router } from "expo-router";
import ProductsImage from "./ProductsImage";

interface Listing {
  id: string;
  title: string;
  price: number;
  type: "product" | "service" | "innovation";
  media_urls: string[];
  specs: {
    condition?: string;
    [key: string]: any;
  };
  tags?: string[];
  created_at: string;
}

const LastItems = () => {
  const theme = useTheme();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animValues = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from("product_listings")
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
        setError("Impossible de charger les annonces");
        Alert.alert("Erreur", "Impossible de charger les annonces");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handlePressIn = () => {
    Animated.spring(animValues, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animValues, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleProductPress = (listingId: string) => {
    router.push(`/listing/details?id=${listingId}`);
  };

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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

  if (!listings.length) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          Aucune annonce disponible
        </Text>
      </View>
    );
  }

  console.log(listings[0].media_urls);

  return (
    <View style={{ padding: 16 }}>
      <Text
        variant="titleLarge"
        style={{
          marginBottom: 24,
          fontWeight: "700",
          color: theme.colors.onSurface,
        }}
      >
        Dernières publications
      </Text>

      <FlatList
        data={listings}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 16 }}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => handleProductPress(item.id)}
          >
            <Animated.View
              style={{
                transform: [{ scale: animValues }],
                flex: 1,
                maxWidth: "48%",
              }}
            >
              <Card
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  elevation: 4,
                  shadowColor: theme.colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}
              >
                <View style={{ position: "relative" }}>
                  <ProductsImage
                    path={item?.media_urls?.[0]}
                    fallback={"product image"}
                    style={{
                      height: 180,
                      width: "100%",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  />
                  <IconButton
                    icon="heart-outline"
                    size={20}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      backgroundColor: theme.colors.surfaceVariant,
                    }}
                    iconColor={theme.colors.error}
                  />
                </View>

                <Card.Content style={{ padding: 16 }}>
                  <Chip
                    mode="outlined"
                    style={{
                      alignSelf: "flex-start",
                      marginBottom: 12,
                      borderColor: theme.colors.primaryContainer,
                      backgroundColor: theme.colors.primaryContainer,
                    }}
                    textStyle={{
                      color: theme.colors.onPrimaryContainer,
                      fontSize: 12,
                    }}
                  >
                    {item.type}
                  </Chip>

                  <Text
                    variant="titleMedium"
                    numberOfLines={1}
                    style={{
                      fontWeight: "700",
                      marginBottom: 8,
                      color: theme.colors.onSurface,
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text
                    variant="titleLarge"
                    style={{
                      color: theme.colors.primary,
                      fontWeight: "800",
                      marginBottom: 12,
                    }}
                  >
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(item.price)}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {item.specs?.condition && (
                      <Chip
                        mode="flat"
                        style={{
                          backgroundColor: theme.colors.secondaryContainer,
                        }}
                        textStyle={{ fontSize: 12 }}
                      >
                        {item.specs.condition}
                      </Chip>
                    )}

                    {item.tags?.length > 0 && (
                      <Text
                        variant="labelSmall"
                        style={{
                          color: theme.colors.onSurfaceVariant,
                          fontWeight: "500",
                        }}
                      >
                        #{item.tags[0]}
                      </Text>
                    )}
                  </View>
                </Card.Content>
              </Card>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default LastItems;
