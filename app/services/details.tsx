import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import RemoteImage from "@/components/RemoteImage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import ProductsImage from "@/components/ProductsImage";
import { StatusBar } from "expo-status-bar";

interface Service {
  id: string;
  gallery: string[];
  // ... d'autres propriétés si besoin
}

interface ServiceDetailsProps {
  service: Service;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = () => {
  const { id } = useLocalSearchParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [dominantColor, setDominantColor] = useState("#fff");

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select(
            `
            *,
            profiles(*),
            categories(*),
            reviews(*)
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Service non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F5F8FD" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Galerie d'images */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {service.gallery.map((image: string, index: number) => (
            <ProductsImage
              key={index}
              path={image}
              fallback=" services Image"
              style={{ width, height: 200, objectFit: "cover" }}
            />
          ))}
        </ScrollView>

        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>{service.title}</Text>
          <View style={styles.providerContainer}>
            {/* <RemoteImage
              path={service.profiles.avatar_url}
              style={styles.avatar}
              fallback="user-avatar"
            /> */}
            <Image
              source={{ uri: service.profiles.avatar_url }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View>
              <Text style={styles.providerName}>
                {service.profiles.full_name}
              </Text>
              <Text style={styles.category}>{service.categories.name}</Text>
            </View>
          </View>

          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>{"service.location"}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.description}>
            {service.description || "Aucune description fournie"}
          </Text>
        </View>

        {/* Avis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Avis ({service.reviews.length})
          </Text>
          {/* Composant d'avis à implémenter */}
        </View>
      </ScrollView>

      {/* Actions fixes en bas */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Réserver maintenant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FD",
  },
  scrollContent: {
    paddingBottom: 100,
  },

  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  providerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  category: {
    color: "#666",
    fontSize: 14,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    marginLeft: 4,
    color: "#666",
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    lineHeight: 22,
    color: "#444",
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  messageButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  bookButton: {
    flex: 1,
    backgroundColor: "#9333ea",
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  bookButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default ServiceDetails;
