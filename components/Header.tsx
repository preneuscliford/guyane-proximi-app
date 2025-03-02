import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Bookmark, CircleUserRound } from "lucide-react-native";
import SearchInput from "./SearchInput";
import RemoteImage from "./RemoteImage";
import { Image } from "expo-image";
import { useAuth } from "@/app/provider/AuthProvider";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Header = () => {
  const { userData, session } = useAuth();
  const router = useRouter();

  // Fonction pour gérer le clic sur la barre de recherche
  const handleSearchPress = () => {
    router.push("/(tabs)/explore");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#9333EA" />

      <View style={styles.topRow}>
        <View style={{ flexDirection: "row" }}>
          {(session && userData?.avatar_url?.startsWith("https://") && (
            <View className="flex-row items-center">
              <Image
                source={{ uri: userData?.avatar_url }}
                style={{
                  width: wp("8%"),
                  height: hp("4%"),
                  borderRadius: 50,
                }}
              />

              <View className="flex-col   " style={{ marginLeft: 4 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: hp("1.5%"),
                    fontWeight: "300",
                  }}
                >
                  Bienvenue
                </Text>
                <Text style={styles.appName}>
                  {userData?.full_name || userData?.username}
                </Text>
              </View>
            </View>
          )) ||
            (session && (
              <View className="flex-row items-center">
                {userData?.avatar_url ? (
                  <RemoteImage
                    path={userData?.avatar_url}
                    fallback="profile-placeholder"
                    style={{ width: 34, height: 34, borderRadius: 20 }}
                  />
                ) : (
                  <CircleUserRound color="white" size={34} />
                )}
                <View className="flex-col  " style={{ marginLeft: 4 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 15,
                      fontWeight: "300",
                    }}
                  >
                    Bienvenue
                  </Text>
                  <Text style={styles.appName}>
                    {userData?.full_name || userData?.username}
                  </Text>
                </View>
              </View>
            ))}

          {!session && (
            <View className="flex-row items-center">
              <CircleUserRound color="white" size={34} />
              <View className="flex-col  " style={{ marginLeft: 4 }}>
                <TouchableOpacity onPress={() => router.push("/(auth)/signIn")}>
                  <Text style={styles.appName}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        {session && (
          <TouchableOpacity>
            <Bookmark color="white" size={24} />
          </TouchableOpacity>
        )}
      </View>

      {/* Rendre SearchInput cliquable et rediriger vers explore */}
      <TouchableOpacity
        style={styles.searchWrapper}
        onPress={handleSearchPress}
        activeOpacity={0.7}
      >
        <View pointerEvents="none">
          <SearchInput />
        </View>
      </TouchableOpacity>
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
  searchWrapper: {
    width: "100%",
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
    fontSize: hp("1.7%"),
    letterSpacing: 0.5,

    fontWeight: "500",
    // marginLeft: 4,
  },
});

export default Header;
