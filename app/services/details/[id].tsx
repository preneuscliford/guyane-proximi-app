import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { StatusBar } from "expo-status-bar";
import { ServiceImages } from "@/components/Images";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import RemoteImage from "@/components/RemoteImage";

const ServiceDetailsPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*, profiles(*), category_id(*), reviews(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <ServiceImages
            path={service?.gallery?.[0]}
            style={styles.image}
            fallback="service-image"
          />

          <View style={styles.authorOverlay}>
            <View style={styles.authorInfo}>
              {service?.profiles?.avatar_url?.startsWith("https://") ? (
                <Image
                  source={{ uri: service.profiles.avatar_url }}
                  style={styles.authorImage}
                />
              ) : (
                <RemoteImage
                  path={service?.profiles?.avatar_url}
                  fallback="profile-placeholder"
                  style={styles.authorImage}
                />
              )}
              <View>
                <Text style={styles.authorName}>
                  {service?.profiles?.full_name || service?.profiles?.username}
                </Text>
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons
                    name="star"
                    size={16}
                    color="#FFC107"
                  />
                  <Text style={styles.rating}>
                    {service?.reviews?.length > 0
                      ? (
                          service.reviews.reduce(
                            (acc: number, curr: any) => acc + curr.rating,
                            0
                          ) / service.reviews.length
                        ).toFixed(1)
                      : "Nouveau"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{service?.title}</Text>

          <View style={styles.providerContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {service?.category_id?.name}
              </Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
            <Text style={styles.location}>{service?.location}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>À propos de moi</Text>
            <Text style={styles.description} numberOfLines={3}>
              {service?.description}
            </Text>
            <TouchableOpacity>
              <Text style={styles.readMore}>Lire plus</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Réserver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    height: hp("40%"),
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    padding: wp("5%"),
  },
  title: {
    fontSize: hp("2.5%"),
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: hp("1%"),
  },
  providerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: hp("2%"),
  },
  categoryBadge: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("4%"),
  },
  categoryText: {
    color: "#9333EA",
    fontSize: hp("1.6%"),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  location: {
    fontSize: hp("1.8%"),
    color: "#666",
    marginLeft: wp("2%"),
  },
  section: {
    marginBottom: hp("3%"),
  },
  sectionTitle: {
    fontSize: hp("2.2%"),
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: hp("1%"),
  },
  description: {
    fontSize: hp("1.8%"),
    color: "#666",
    lineHeight: hp("2.5%"),
  },
  readMore: {
    color: "#9333EA",
    fontSize: hp("1.8%"),
    marginTop: hp("1%"),
  },
  buttonContainer: {
    flexDirection: "row",
    gap: wp("3%"),
    marginBottom: hp("2%"),
  },
  messageButton: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    borderWidth: 1,
    borderColor: "#9333EA",
    alignItems: "center",
  },
  messageButtonText: {
    color: "#9333EA",
    fontSize: hp("1.8%"),
    fontWeight: "500",
  },
  bookButton: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    backgroundColor: "#9333EA",
    alignItems: "center",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: hp("1.8%"),
    fontWeight: "500",
  },
  authorOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp("4%"),
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
  },
  authorImage: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  authorName: {
    color: "#FFFFFF",
    fontSize: hp("2%"),
    fontWeight: "600",
    marginBottom: hp("0.5%"),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
  },
  rating: {
    color: "#FFFFFF",
    fontSize: hp("1.6%"),
    fontWeight: "500",
  },
});

export default ServiceDetailsPage;
