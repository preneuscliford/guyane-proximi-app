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
        <View style={styles.logoContainer}>
          {session &&
          userData?.avatar_url.startsWith("https://") && (
            <Image
              source={{ uri: userData?.avatar_url }}
              style={{ width: 28, height: 28, borderRadius: 20 }}
            />
          ) ? (
            <RemoteImage
              path={userData?.avatar_url}
              fallback="profile-placeholder"
              style={{ width: 28, height: 28, borderRadius: 20 }}
            />
          ) : (
            <CircleUserRound size={28} color="white" />
          )}
          <Text style={styles.appName}>Game Play</Text>
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
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Header;
