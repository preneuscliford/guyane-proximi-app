import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { ServiceImages } from "./Images";

dayjs.locale("fr"); // Configuration globale

const EventItem = ({ event, onPress }: any) => {
  // Formatage de la date de début et fin
  const formattedDate = `${dayjs(event.start_date).format(
    "dddd DD MMM  HH:mm"
  )} → ${dayjs(event.end_date).format("HH:mm")}`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image & Catégorie */}
      <View style={styles.imageContainer}>
        <ServiceImages
          path={event.file?.[0]}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          fallback="event-image"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        >
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>
              {event.category || "Événement"}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.subTitle} numberOfLines={1}>
          {event.description || "Aucune description"}
        </Text>

        {/* Localisation & Date */}
        <View style={styles.metaContainer}>
          <View style={styles.infoGroup}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.location}>
              {event.location || "Lieu inconnu"}
            </Text>
          </View>

          <View style={styles.infoGroup}>
            <MaterialIcons name="calendar-today" size={16} color="#666" />
            <Text style={styles.date} numberOfLines={1}>
              {formattedDate}
            </Text>
          </View>
        </View>

        {/* Prix */}
        {/* <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {event.price ? `€${event.price}` : "Gratuit"}
          </Text>
          {event.price && <Text style={styles.priceLabel}>/personne</Text>}
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: wp("50%"),
    marginHorizontal: 8,
  },
  imageContainer: {
    height: hp("20%"),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    padding: 16,
    justifyContent: "flex-end",
  },
  categoryTag: {
    backgroundColor: "#9333EA",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  categoryText: {
    color: "#fff",
    fontSize: hp("1%"),
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: hp("1.5%"),
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: hp("1.2%"),
    letterSpacing: 0.5,
    color: "#64748B",
    marginBottom: 2,
  },
  metaContainer: {
    gap: 8,
  },
  infoGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  location: {
    color: "#64748B",
    fontSize: hp("1.1%"),
    letterSpacing: 0.5,
  },
  date: {
    color: "#64748B",
    fontSize: hp("1.1"),
    letterSpacing: 0.5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  price: {
    color: "#9333EA",
    fontSize: 18,
    fontWeight: "700",
  },
  priceLabel: {
    color: "#64748B",
    fontSize: 12,
  },
});

export default EventItem;
