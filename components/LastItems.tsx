import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";

import { useRouter } from "expo-router";

import { ServiceImages } from "./Images";

interface Service {
  id: string;
  titre: string;
  prestataire: string;
  type: string;
  image: string;
  prix: number;
  avis: number;
  profiles: {
    id: string;
    full_name: string;
    username: string;
  };
}

const DerniersServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const recupererServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select(
            `
            *, profiles(*), reviews(*), category_id(*)
          `
          )
          .order("created_at", { ascending: false })
          .limit(2);

        if (error) throw error;

        // console.log(data[0].category_id);

        const donneesFormatees: Service[] = data.map((service: any) => ({
          id: service.id,
          titre: service?.title,
          prestataire:
            service?.profiles?.full_name || service.profiles.username,
          type: service?.category_id?.name || "Général",
          image: service?.gallery[0],
          prix: service.price,
          avis: service.reviews[0]?.count || 0,
          profiles: service.profiles,
        }));

        setServices(donneesFormatees);
      } catch (error) {
        console.error("Erreur lors de la récupération des services :", error);
      } finally {
        setChargement(false);
      }
    };

    recupererServices();
  }, []);

  if (chargement) {
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.entete}>
        <Text style={styles.titre}>Derniers services</Text>
        <TouchableOpacity>
          <Text style={styles.toutVoir}>Tout voir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        scrollEnabled={false}
        numColumns={2}
        columnWrapperStyle={styles.rangee}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.carte}
            onPress={() => {
              router.push({
                pathname: "/services/details",
                params: { id: item.id },
              });
            }}
          >
            <View style={styles.imageContainer}>
              <ServiceImages
                path={item.image}
                fallback=" services Image"
                style={styles.image}
              />
              <TouchableOpacity style={styles.boutonFavori}></TouchableOpacity>
            </View>
            <View style={styles.contenu}>
              <Text numberOfLines={2} style={styles.titreItem}>
                {item.titre}
              </Text>
              <Text style={styles.prestataire}>{item.prestataire}</Text>

              <View style={styles.infoContainer}>
                <Text style={styles.prix}>€{item.prix}</Text>
                {item.avis > 0 && (
                  <Text style={styles.avis}>({item.avis} avis)</Text>
                )}
              </View>

              <View style={styles.typeContainer}>
                <Text style={styles.type}>{item.type}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  prix: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10B981",
    marginRight: 8,
  },
  avis: {
    fontSize: 12,
    color: "#6B7280",
  },
  container: {
    paddingVertical: 16,
  },
  entete: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  toutVoir: {
    color: "#9333EA",
    fontSize: 14,
  },
  rangee: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  carte: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0.5,
    marginVertical: 4,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 120,
  },
  boutonFavori: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 6,
  },
  contenu: {
    padding: 12,
  },
  titreItem: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  prestataire: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  typeContainer: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  type: {
    color: "#9333EA",
    fontSize: 12,
  },
});

export default DerniersServices;
