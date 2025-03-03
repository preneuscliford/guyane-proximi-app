import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ServiceImages } from "./Images";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    gallery: string[];
    price: number;
    location: string;
    profiles: {
      full_name: string;
      username: string;
    };
    category_id: {
      name: string;
    };
    reviews: {
      rating: number;
    }[];
  };
  onPress: () => void;
}

const ServiceCard = ({ service, onPress }: ServiceCardProps) => {
  // Calculer la moyenne des avis
  const averageRating = service.reviews?.length
    ? service.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
      service.reviews.length
    : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <ServiceImages
          path={service.gallery?.[0]}
          style={styles.image}
          fallback="service-image"
        />
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>
            {service.category_id?.name || "Service"}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {service.title}
        </Text>

        <Text style={styles.provider} numberOfLines={1}>
          {service.profiles?.full_name || service.profiles?.username}
        </Text>

        <View style={styles.locationContainer}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
          <Text style={styles.location} numberOfLines={1}>
            {service.location}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={16} color="#FFC107" />
            <Text style={styles.rating}>{averageRating.toFixed(1)}</Text>
          </View>

          <Text style={styles.price}>{service.price}€</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp("4%"),
    overflow: "hidden",
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    height: hp("20%"),
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryTag: {
    position: "absolute",
    top: hp("1%"),
    left: wp("2%"),
    backgroundColor: "#9333EA",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("4%"),
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: hp("1.4%"),
    fontWeight: "500",
  },
  content: {
    padding: wp("4%"),
  },
  title: {
    fontSize: hp("2%"),
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: hp("0.5%"),
  },
  provider: {
    fontSize: hp("1.6%"),
    color: "#6B7280",
    marginBottom: hp("1%"),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  location: {
    fontSize: hp("1.6%"),
    color: "#666666",
    marginLeft: wp("1%"),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
  },
  rating: {
    fontSize: hp("1.6%"),
    color: "#1F2937",
    fontWeight: "500",
  },
  price: {
    fontSize: hp("1.8%"),
    color: "#9333EA",
    fontWeight: "600",
  },
});

export default ServiceCard;
