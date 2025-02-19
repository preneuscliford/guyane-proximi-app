import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Bookmark, CircleUserRound } from "lucide-react-native";
import SearchInput from "./SearchInput";
import RemoteImage from "./RemoteImage";
import { Image } from "expo-image";
import { useAuth } from "@/app/provider/AuthProvider";

const Header = () => {
  const { userData, session } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={{ flexDirection: "row" }}>
          {userData?.avatar_url?.startsWith("https://") ? (
            <Image
              source={{ uri: userData?.avatar_url }}
              style={{ width: 28, height: 28, borderRadius: 20 }}
            />
          ) : (
            <RemoteImage
              path={userData?.avatar_url}
              fallback="profile-placeholder"
              style={{ width: 28, height: 28, borderRadius: 20 }}
            />
          )}
          <View className="flex-col ">
            <Text
              style={{
                color: "white",
                fontSize: 15,
                fontWeight: "300",
                marginLeft: 4,
              }}
            >
              Bienvenue
            </Text>
            <Text style={styles.appName}>
              {userData?.full_name || userData?.username}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Bookmark color="white" size={24} />
        </TouchableOpacity>
      </View>
      <SearchInput />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#9333EA",
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  appName: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    // marginLeft: 4,
  },
});

export default Header;
