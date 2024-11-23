import { Image, StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";

const images = [
  { id: 1, url: "../assets/images/do.png" },
  { id: 2, url: "../assets/images/tech.png" },
  { id: 3, url: "../assets/images/build.png" },
];
const Slider = () => {
  return (
    <View className=" py-3">
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View className=" rounded-2xl">
            <Image
              source={require("../assets/images/do.png")}
              style={{
                width: 330,
                height: 170,
                marginRight: 1,
                objectFit: "contain",
                borderRadius: 10,
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({});
