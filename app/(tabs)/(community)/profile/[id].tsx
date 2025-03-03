import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Image } from "expo-image";
import RemoteImage from "@/components/RemoteImage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackAppbar from "@/components/AppBar";
import PostsCard from "@/components/PostsCard";
import { useAuth } from "@/app/provider/AuthProvider";

const UserProfile = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userData } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["user_posts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(*), comments(*)")
        .eq("userId", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const renderSocialLinks = () => {
    if (!profile?.social_links) return null;
    return (
      <View style={styles.socialLinks}>
        {profile.social_links.instagram && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() =>
              Linking.openURL(
                `https://instagram.com/${profile.social_links.instagram}`
              )
            }
          >
            <MaterialCommunityIcons
              name="instagram"
              size={24}
              color="#9333EA"
            />
            <Text style={styles.socialText}>
              @{profile.social_links.instagram}
            </Text>
          </TouchableOpacity>
        )}
        {profile.social_links.twitter && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() =>
              Linking.openURL(
                `https://twitter.com/${profile.social_links.twitter}`
              )
            }
          >
            <MaterialCommunityIcons name="twitter" size={24} color="#9333EA" />
            <Text style={styles.socialText}>
              @{profile.social_links.twitter}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackAppbar title="Profil" />
      <ScrollView>
        {/* En-tête du profil */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {profile?.avatar_url?.startsWith("https://") ? (
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.profileImage}
              />
            ) : (
              <RemoteImage
                path={profile?.avatar_url}
                fallback="profile-placeholder"
                style={styles.profileImage}
              />
            )}
          </View>

          <Text style={styles.username}>
            {profile?.username || profile?.full_name}
          </Text>
          {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          {/* Informations supplémentaires */}
          <View style={styles.infoContainer}>
            {profile?.website && (
              <TouchableOpacity
                style={styles.infoRow}
                onPress={() => Linking.openURL(profile.website)}
              >
                <MaterialCommunityIcons name="web" size={20} color="#9333EA" />
                <Text style={styles.infoText}>{profile.website}</Text>
              </TouchableOpacity>
            )}

            {profile?.address && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color="#9333EA"
                />
                <Text style={styles.infoText}>{profile.address}</Text>
              </View>
            )}

            {profile?.phone && (
              <TouchableOpacity
                style={styles.infoRow}
                onPress={() => Linking.openURL(`tel:${profile.phone}`)}
              >
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color="#9333EA"
                />
                <Text style={styles.infoText}>{profile.phone}</Text>
              </TouchableOpacity>
            )}

            {profile?.business_info &&
              Object.keys(profile.business_info).length > 0 && (
                <View style={styles.businessInfo}>
                  <Text style={styles.businessTitle}>
                    Informations professionnelles
                  </Text>
                  {/* Ajouter ici le rendu des informations business selon votre structure */}
                </View>
              )}

            {profile?.innovation_badges && (
              <View style={styles.badgesContainer}>
                <Text style={styles.badgesTitle}>Badges d'innovation</Text>
                <Text style={styles.badgesText}>
                  {profile.innovation_badges}
                </Text>
              </View>
            )}
          </View>

          {renderSocialLinks()}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userPosts?.length || 0}</Text>
              <Text style={styles.statLabel}>Publications</Text>
            </View>
            {/* Ajoutez d'autres statistiques si nécessaire */}
          </View>
        </View>

        {/* Publications de l'utilisateur */}
        <View style={styles.postsContainer}>
          <Text style={styles.sectionTitle}>Publications</Text>
          {userPosts?.map((post) => (
            <PostsCard
              key={post.id}
              item={post}
              router={router}
              currentUser={userData}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FD",
  },
  header: {
    padding: wp("4%"),
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  profileImageContainer: {
    width: wp("25%"),
    height: wp("25%"),
    borderRadius: wp("12.5%"),
    marginBottom: hp("2%"),
    borderWidth: 3,
    borderColor: "#9333EA",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: wp("12.5%"),
  },
  username: {
    fontSize: hp("2.5%"),
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: hp("1%"),
  },
  bio: {
    fontSize: hp("1.8%"),
    color: "#4B5563",
    textAlign: "center",
    marginBottom: hp("2%"),
    paddingHorizontal: wp("4%"),
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: hp("2%"),
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: hp("2.2%"),
    fontWeight: "600",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: hp("1.6%"),
    color: "#6B7280",
  },
  postsContainer: {
    padding: wp("4%"),
  },
  sectionTitle: {
    fontSize: hp("2.2%"),
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: hp("2%"),
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: wp("4%"),
    marginTop: hp("2%"),
    gap: hp("1.5%"),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
    paddingVertical: hp("0.5%"),
  },
  infoText: {
    fontSize: hp("1.6%"),
    color: "#4B5563",
    flex: 1,
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp("4%"),
    marginTop: hp("2%"),
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
    padding: wp("2%"),
    backgroundColor: "#F3E8FF",
    borderRadius: wp("2%"),
  },
  socialText: {
    fontSize: hp("1.4%"),
    color: "#9333EA",
  },
  businessInfo: {
    marginTop: hp("2%"),
    padding: wp("4%"),
    backgroundColor: "#F3E8FF",
    borderRadius: wp("2%"),
  },
  businessTitle: {
    fontSize: hp("1.8%"),
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: hp("1%"),
  },
  badgesContainer: {
    marginTop: hp("2%"),
    padding: wp("4%"),
    backgroundColor: "#F3E8FF",
    borderRadius: wp("2%"),
  },
  badgesTitle: {
    fontSize: hp("1.8%"),
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: hp("1%"),
  },
  badgesText: {
    fontSize: hp("1.6%"),
    color: "#4B5563",
  },
});

export default UserProfile;
