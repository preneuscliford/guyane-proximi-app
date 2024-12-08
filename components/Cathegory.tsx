import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { router } from "expo-router";

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
      <Text className="text-2xl font-bold">Catégories</Text>
      <View className="flex-row flex-wrap justify-between mt-5">
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="w-[23%] items-center mb-4"
            onPress={() => handleCategoryPress(item.value)}
          >
            <View className="bg-zinc-200 rounded-lg p-2 w-14 h-14 items-center justify-center">
              <Image
                source={item.icon}
                style={{ width: 30, height: 30, objectFit: "contain" }}
              />
            </View>
            <Text className="text-xs text-center mt-1">{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Cathegory;

const styles = StyleSheet.create({});
