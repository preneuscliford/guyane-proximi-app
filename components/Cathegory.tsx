import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const categories = [
  { id: "1", name: "Nettoyage", icon: "broom" },
  { id: "2", name: "Réparation", icon: "wrench" },
  { id: "3", name: "Peinture", icon: "format-paint" },
  { id: "4", name: "Déménagement", icon: "truck" },
  { id: "5", name: "Jardinage", icon: "tree" },
  { id: "6", name: "Plomberie", icon: "water-pump" },
  { id: "7", name: "Électricité", icon: "flash" },
  { id: "8", name: "Décoration", icon: "palette" },
];

const Categories = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catégories</Text>
        {/* <TouchableOpacity>
          <Text style={styles.viewAll}>Voir tout</Text>
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.category}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={item.icon as any}
                size={24}
                color="#9333EA"
              />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  viewAll: {
    color: "#9333EA",
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 16,
    gap: 16,
  },
  category: {
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 12,
    color: "#4B5563",
  },
});

export default Categories;
