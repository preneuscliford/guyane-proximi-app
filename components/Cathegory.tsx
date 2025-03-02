import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";

const categories = [
  { id: "1", name: "Nettoyage", icon: "broom", color: "#EF4444" },
  { id: "2", name: "Réparation", icon: "wrench", color: "#F59E0B" },
  { id: "3", name: "Peinture", icon: "format-paint", color: "#10B981" },
  { id: "4", name: "Déménagement", icon: "truck", color: "#3B82F6" },
  { id: "5", name: "Jardinage", icon: "tree", color: "#8B5CF6" },
  { id: "6", name: "Plomberie", icon: "water-pump", color: "#EC4899" },
  { id: "7", name: "Électricité", icon: "flash", color: "#F97316" },
  { id: "8", name: "Décoration", icon: "palette", color: "#6366F1" },
];

const Categories = () => {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: "/services/category",
      params: { id: categoryId },
    });
  };

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
          <TouchableOpacity
            style={styles.category}
            onPress={() => handleCategoryPress(item.id)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${item.color}15` },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={wp("6%")}
                color={item.color}
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
    fontSize: hp("2%"),
    letterSpacing: 1,
    fontWeight: "bold",
    color: "#1F2937",
  },
  viewAll: {
    color: "#9333EA",
    fontSize: hp("1.2%"),
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: wp("4%"),
    gap: wp("4%"),
  },
  category: {
    alignItems: "center",
    gap: hp("1%"),
  },
  iconContainer: {
    width: wp("15%"),
    height: wp("15%"),
    borderRadius: wp("7.5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    fontSize: hp("1.6%"),
    color: "#4B5563",
    fontWeight: "500",
  },
});

export default Categories;
