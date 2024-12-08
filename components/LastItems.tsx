import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import ProductsImage from "./ProductsImage";
import { Card, Text, Chip, Badge } from "react-native-paper";
import { router } from "expo-router";

const LastItems = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    try {
      const { data, error, status } = await supabase
        .from("products")
        .select(`*`)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error && status !== 406) {
        throw error;
      }

      setProduct(data as any);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  }

  const handleProductPress = (productId: number) => {
    router.push({
      pathname: "/product/details",
      params: { id: productId },
    });
  };

  return (
    <View className="mt-5 p-5" style={{ paddingBottom: 10 }}>
      <Text className="text-2xl font-bold">Derniers produits</Text>
      <FlatList
        data={product}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <ScrollView key={index} style={{ paddingBottom: 10 }}>
            <TouchableOpacity onPress={() => handleProductPress(item.id)}>
              <View style={{ margin: 5, width: 180 }}>
                <Card style={{ width: "100%" }}>
                  <ProductsImage
                    path={item?.imageUrl}
                    fallback={"product image"}
                    style={{
                      height: 160,
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Chip
                    style={{ marginVertical: 5, marginHorizontal: 5 }}
                    className="text-sm"
                  >
                    {item?.category}
                  </Chip>
                  <Card.Content>
                    <Badge size={25} style={{ alignSelf: "flex-start" }}>
                      {`${item?.price} €`}
                    </Badge>
                    <Text variant="titleSmall" numberOfLines={1}>
                      {item?.title}
                    </Text>
                  </Card.Content>
                </Card>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      />
    </View>
  );
};

export default LastItems;

const styles = StyleSheet.create({});
