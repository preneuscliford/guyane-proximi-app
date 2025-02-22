import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RemoteImage from "@/components/RemoteImage";
import { Button } from "react-native-paper";
import { ServiceImages } from "@/components/Images";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { LinearGradient } from "expo-linear-gradient";

const EventDetails = () => {
  const {
    title,
    desc,
    file,
    start_date,
    end_date,
    location,
    organizer_id,
  }: any = useLocalSearchParams();

  const formattedDate = `${dayjs(start_date).format(
    "dddd DD MMM  HH:mm"
  )} → ${dayjs(end_date).format("HH:mm")}`;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]}>
          <ServiceImages
            path={file}
            style={styles.mainImage}
            fallback="event-image"
          />
        </LinearGradient>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          <View className="mr-4 flex-row items-center">
            {organizer_id?.avatar_url &&
              organizer_id.avatar_url.startsWith("https://") && (
                <Image
                  source={{ uri: organizer_id?.avatar_url }}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 20,
                    marginRight: 8,
                  }}
                />
              )}
            {(organizer_id.avatar_url &&
              !organizer_id.avatar_url.startsWith("https://") && (
                <RemoteImage
                  path={organizer_id.avatar_url}
                  fallback="account-circle"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 32,
                    marginRight: 8,
                  }}
                />
              )) ||
              (!organizer_id.avatar_url && (
                <MaterialIcons
                  name="account-circle"
                  size={34}
                  color="#9333EA"
                  style={{ marginRight: 8 }}
                />
              ))}

            <View>
              <Text className="font-bold text-slate-800">
                {organizer_id.full_name || organizer_id.organizer_idname}
              </Text>
              {/* {organizer_id.organizer_idname && (
              <Text variant="bodyMedium" className="text-slate-500 ">
                @{organizer_id.organizer_idname}
              </Text>
            )} */}
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MaterialIcons name="calendar-today" size={20} color="#9333EA" />
              <Text style={styles.detailText}>{formattedDate}</Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialIcons name="location-on" size={20} color="#9333EA" />
              <Text style={styles.detailText}>{location}</Text>
            </View>

            {/* <View style={styles.detailItem}>
              <MaterialIcons name="euro" size={20} color="#9333EA" />
              <Text style={styles.detailText}>{event.price}€ / personne</Text>
            </View> */}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{desc}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={() => console.log("Book")}>Réserver maintenant</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  mainImage: {
    width: "100%",
    height: 300,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 14,
  },
  detailsContainer: {
    gap: 16,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#374151",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4B5563",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
});

export default EventDetails;
