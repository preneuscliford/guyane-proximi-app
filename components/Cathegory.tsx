import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Wrench, Truck, PaintBucket, Ratio } from "lucide-react-native";

const categories = [
  { id: "1", name: "Cleaning", icon: Ratio },
  { id: "2", name: "Repairing", icon: Wrench },
  { id: "3", name: "Painting", icon: PaintBucket },
  { id: "4", name: "Shifting", icon: Truck },
];

const Categories = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        horizontal
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity style={styles.category}>
              <View style={styles.iconContainer}>
                <Icon size={24} color="#9333EA" />
              </View>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
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
