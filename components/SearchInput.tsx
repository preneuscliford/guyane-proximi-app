import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Searchbar, TextInput } from "react-native-paper";
import { router, usePathname } from "expo-router";

const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState(null);
  const pathname = usePathname();

  const endEditing = () => {
    if (searchQuery === "") return;
    router.push(`/search/${searchQuery}`);
  };
  const onIconPress = () => {
    if (searchQuery === "") return;
    router.push(`/search/${searchQuery}`);
  };
  return (
    <View className=" rounded-2xl flex-row items-center mt-5 ">
      <Searchbar
        placeholder="Search"
        onChangeText={(e) => setSearchQuery(e)}
        value={searchQuery}
        onIconPress={onIconPress}
        iconColor="#181F27"
        onEndEditing={endEditing}
        style={{ backgroundColor: "#FCFDFE" }}
        placeholderTextColor={"#181F27"}
      />
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({});
