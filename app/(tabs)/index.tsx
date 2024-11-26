import { Image, StyleSheet, Platform, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";

import { useEffect } from "react";
import { Link, useNavigation } from "expo-router";
import AuthProvider, { useAuth } from "../provider/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import Slider from "@/components/Slider";
import Cathegory from "@/components/Cathegory";
import LastItems from "@/components/LastItems";

export default function HomeScreen() {
  // const navigation = useNavigation();
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerShown: true,
  //     headerRight: () => (
  //       <Link href={"/login"}>
  //         <Feather name="user" size={24} color="white" />
  //       </Link>
  //     ),
  //   });
  // });

  return (
    <ScrollView className="bg-white ">
      <SafeAreaView>
        <Header />
        <Slider />
        <Cathegory />
        <LastItems />
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
