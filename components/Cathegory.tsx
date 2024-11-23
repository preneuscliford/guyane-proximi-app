import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const Cathegory = () => {
  return (
    <View className=" p-5">
      <Text className=" text-2xl font-bold">Cathegorie</Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 30,
          columnGap: 30,
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        <TouchableOpacity className=" justify-center items-center with">
          <Image
            source={require("../assets/icons/appareils-electroniques.png")}
            style={{ width: 32, height: 32 }}
          />
          <Text className=" text-sm font-thin">Électronique</Text>
        </TouchableOpacity>

        <TouchableOpacity className=" justify-center items-center">
          <Image
            source={require("../assets/icons/maison.png")}
            style={{ width: 32, height: 32 }}
          />
          <Text className=" text-sm font-thin">Maison</Text>
        </TouchableOpacity>
        <TouchableOpacity className=" justify-center items-center">
          <Image
            source={require("../assets/icons/beaute.png")}
            style={{ width: 32, height: 32 }}
          />
          <Text className=" text-sm font-thin">Beauté</Text>
        </TouchableOpacity>

        <TouchableOpacity className=" justify-center items-center">
          <Image
            source={require("../assets/icons/soins-de-sante.png")}
            style={{ width: 32, height: 32 }}
          />
          <Text className=" text-sm font-thin">Santé</Text>
        </TouchableOpacity>

        <TouchableOpacity className=" justify-center items-center">
          <Image
            source={require("../assets/icons/alimentation-equilibree.png")}
            style={{ width: 32, height: 32 }}
          />
          <Text className=" text-sm font-thin">Alimentation</Text>
        </TouchableOpacity>
        <TouchableOpacity className=" justify-center items-center">
          <Image
            source={require("../assets/icons/sport.png")}
            style={{ width: 32, height: 32 }}
          />
          <Text className=" text-sm font-thin">Sport</Text>
        </TouchableOpacity>
        <TouchableOpacity className=" justify-center items-center">
          <Image
            source={require("../assets/icons/divertissement.png")}
            style={{ width: 32, height: 32 }}
          />
          <Text className=" text-sm font-thin">Divertissement</Text>
        </TouchableOpacity>
        <TouchableOpacity className=" justify-center items-center">
          <Image
            source={require("../assets/icons/touristique.png")}
            style={{ width: 32, height: 32 }}
          />
          <Text className=" text-sm font-thin">Tourisme</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cathegory;

const styles = StyleSheet.create({});
