import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import index from "@/app/(tabs)/(community)";

const categories = [
  {
    id: 1,
    name: "Électronique",
    icon: require("../assets/icons/appareils-electroniques.png"),
    value: "Électronique",
  },
  {
    id: 2,
    name: "Maison",
    icon: require("../assets/icons/maison.png"),
    value: "Maison",
  },
  {
    id: 3,
    name: "Beauté",
    icon: require("../assets/icons/beaute.png"),
    value: "Beaute",
  },
  {
    id: 4,
    name: "Sport",
    icon: require("../assets/icons/musculation.png"),
    value: "Sport",
  },
  {
    id: 5,
    name: "Santé",
    icon: require("../assets/icons/soins-de-sante.png"),
    value: "Sante",
  },
  {
    id: 6,
    name: "Alimentation",
    icon: require("../assets/icons/alimentation-equilibree.png"),
    value: "Alimentation",
  },
  {
    id: 7,
    name: "Mode",
    icon: require("../assets/icons/mode.png"),
    value: "Mode",
  },
  {
    id: 8,
    name: "Divertissement",
    icon: require("../assets/icons/divertissement.png"),
    value: "Divertissement",
  },
];

const Cathegory = () => {
  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: "/product",
      params: { category },
    });
  };

  return (
    <View className="mt-5 px-5">
      <Text className="text-2xl font-bold text-rich-black">Catégories</Text>
      <FlatList
        data={categories}
        numColumns={4}
        renderItem={({ item, index }) => (
          <View
            className=" flex-1 flex-row flex-wrap justify-center items-center mt-5 border"
            style={{
              borderWidth: 1,
              borderColor: "#EAEDF1",
              margin: 5,
              borderRadius: 5,
            }}
          >
            <TouchableOpacity
              key={index}
              className="w-[23%] items-center mb-4"
              onPress={() => handleCategoryPress(item.value)}
            >
              <View className=" rounded-lg p-2 w-14 h-14 items-center justify-center">
                <Image
                  source={item.icon}
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              </View>
              <Text
                numberOfLines={1}
                className="text-xs text-center mt-1 text-rich-black"
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Cathegory;

const styles = StyleSheet.create({});
