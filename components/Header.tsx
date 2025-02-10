import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useAuth } from "@/app/provider/AuthProvider";
import RemoteImage from "./RemoteImage";
import { supabase } from "@/lib/supabase";
import SearchInput from "./SearchInput";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";

const Header = () => {
  const { session, userData } = useAuth();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <View style={styles.profileContainer}>
        <View style={styles.avatarWrapper}>
          {session ? (
            <RemoteImage
              path={userData?.avatar_url}
              fallback={"profil image"}
              style={styles.avatar}
            />
          ) : (
            <Link href="/(auth)/signIn" style={styles.loginLink}>
              <AntDesign name="user" size={24} color="black" />
            </Link>
          )}
        </View>

        {session ? (
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Bienvenue</Text>
            <Text style={styles.username}>
              {userData?.username || "Utilisateur"}
            </Text>
          </View>
        ) : (
          <View>
            <Link href="/(auth)/signIn" style={styles.loginLink}>
              <Text style={styles.loginText}>Connexion</Text>
            </Link>
          </View>
        )}
      </View>

      <SearchInput />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F8FD",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarWrapper: {
    borderRadius: 24,
    width: 48,
    height: 48,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignSelf: "center",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  userInfo: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  loginLink: {
    marginLeft: 12,
  },
  loginText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
});

export default Header;
