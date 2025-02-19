import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useEffect, useState } from "react";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { getContrastType, getDominantColor } from "@/hooks/useImageColors";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/homeService";
import { ServiceImages } from "@/components/Images";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { CircleArrowLeft, MoveLeft } from "lucide-react-native";

interface data {
  id: string;
  gallery: string[];
  // ... d'autres propriétés si besoin
}

interface dataDetailsProps {
  data: data;
}

const dataDetails: React.FC<dataDetailsProps> = () => {
  const { id } = useLocalSearchParams();
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["services", id],
    queryFn: () => fetchServices(id as string),
  });

  console.log(data?.gallery[0]);

  useEffect(() => {
    if (!isLoading && data?.gallery) {
      const extractColors = async () => {
        const colorPromises = data.gallery.map(async (img: string) => {
          try {
            return await getDominantColor(img);
          } catch (error) {
            console.error("Error extracting color:", error);
            return "#FFFFFF"; // Couleur de fallback
          }
        });

        const colors = await Promise.all(colorPromises);
        setDominantColors(colors);
      };

      extractColors();
    }
  }, [data, isLoading]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentImageIndex(newIndex);
  };

  if (isLoading) {
    return (
      <ActivityIndicator style={{ flex: 1, backgroundColor: "#F5F8FD" }} />
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>data non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        networkActivityIndicatorVisible
        backgroundColor="transparent"
        style={getContrastType(dominantColors[currentImageIndex] || "#FFFFFF")}
      />

      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        style={{
          position: "absolute",
          top: "5.5%",
          left: 16,
          zIndex: 100,
        }}
      >
        <AntDesign
          name="back"
          size={28}
          color={dominantColors[currentImageIndex]}
        />

        {/* <CircleArrowLeft size={28} color={dominantColors[currentImageIndex]} /> */}
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Galerie d'images */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {data?.gallery?.map((image: string, index: number) => (
            <View key={index} style={{ width }}>
              <LinearGradient
                colors={["transparent", dominantColors[index] + "00"]}
                style={styles.imageOverlay}
              />
              <ServiceImages
                path={image}
                fallback="service image"
                style={{ width, height: 300, objectFit: "cover" }}
              />
            </View>
          ))}
        </ScrollView>

        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>{data?.title}</Text>
          <View style={styles.providerContainer}>
            {/* <RemoteImage
              path={data.profiles.avatar_url}
              style={styles.avatar}
              fallback="user-avatar"
            /> */}
            <Image
              source={{ uri: data?.profiles?.avatar_url }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View>
              <Text style={styles.providerName}>
                {data?.profiles?.full_name}
              </Text>
              <Text style={styles.category}>{data?.categories?.name}</Text>
            </View>
          </View>

          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>{"data.location"}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.description}>
            {data?.description || "Aucune description fournie"}
          </Text>
        </View>

        {/* Avis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Avis ({data?.reviews?.length})
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
    paddingTop: Platform.OS === "android" ? 0 : 0,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    zIndex: 2,
  },

  header: {
    padding: 16,
  },
  title: {
    fontSize: 18,
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

export default dataDetails;
