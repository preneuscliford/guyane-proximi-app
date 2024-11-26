import { ScrollView, StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import {} from "react-native-safe-area-context";
import { useAuth } from "@/app/provider/AuthProvider";

const create = () => {
  const { session, user, userData } = useAuth();

  console.log(userData);
  return (
    <ScrollView>
      <View className="">
        <Text>
          create everti f Lorem ipsum dolor sit, amet consectetur adipisicing
          elit. Fugit velit amet iure, voluptatem neque rem veritatis sed quia
          molestias voluptate animi optio earum. Minus vel commodi eveniet
          dolorem! Alias, doloribus.
        </Text>
      </View>
    </ScrollView>
  );
};

export default create;

const styles = StyleSheet.create({});
