import {
  StyleSheet,
  Image,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Text, Searchbar, Chip, Avatar, useTheme } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SearchBar } from "react-native-screens";
import { SafeAreaView } from "react-native-safe-area-context";

const Explore = () => {
  const theme = useTheme();

  // Données temporaires
  const trendingProducts = [
    {
      id: 1,
      title: "Veste Vintage",
      price: 45,
      likes: 128,
      image: "../assets/images/tech.png",
    },
    {
      id: 2,
      title: "Appareil Photo",
      price: 120,
      likes: 89,
      image: "../assets/images/build.png",
    },
    {
      id: 3,
      title: "Plante Rare",
      price: 25,
      likes: 204,
      image: "../assets/images/do.png",
    },
    {
      id: 4,
      title: "Artisanat Local",
      price: 35,
      likes: 156,
      image: "../assets/images/do.png",
    },
  ];

  const categories = [
    { id: 1, name: "Tendances" },
    { id: 2, name: "Communauté" },
    { id: 3, name: "Collections" },
    { id: 4, name: "Événements" },
  ];

  const communityMembers = [
    {
      id: 1,
      name: "Marie",
      avatar: "../assets/images/placeholder.jpg",
    },
    {
      id: 2,
      name: "Pierre",
      avatar: "../assets/images/placeholder.jpg",
    },
    {
      id: 3,
      name: "Sophie",
      avatar: "../assets/images/placeholder.jpg",
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#F5F8FD" }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Explorer
        </Text>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={theme.colors.onSurface}
        />
      </View>

      {/* Barre de recherche */}
      <SearchBar
        placeholder="Rechercher des produits, créateurs..."
        style={styles.searchBar}
        iconColor="#181F27"
        inputStyle={{ color: theme.colors.onSurface }}
      />

      {/* Catégories */}
      <FlatList
        horizontal
        data={categories}
        contentContainerStyle={styles.chipContainer}
        renderItem={({ item }) => (
          <View style={{}}>
            <Chip
              mode="outlined"
              style={[styles.chip, { backgroundColor: theme.colors.surface }]}
              textStyle={{ color: theme.colors.onSurface }}
            >
              {item.name}
            </Chip>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Section Communauté */}
      <View style={styles.sectionHeader}>
        <Text variant="titleLarge">Créateurs Populaires</Text>
        <TouchableOpacity>
          <Text style={{ color: theme.colors.primary }}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={communityMembers}
        contentContainerStyle={styles.communityList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.communityCard}>
            <Avatar.Image size={80} source={item.avatar} />
            <Text variant="bodyMedium" style={styles.communityName}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Produits Tendances */}
      <View style={styles.sectionHeader}>
        <Text variant="titleLarge">Tendances du moment</Text>
        <TouchableOpacity>
          <Text style={{ color: theme.colors.primary }}>Filtrer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trendingProducts}
        numColumns={2}
        columnWrapperStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text variant="bodyMedium" numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.priceContainer}>
                <Text variant="bodyLarge" style={styles.price}>
                  €{item.price}
                </Text>
                <View style={styles.likes}>
                  <Ionicons name="heart" size={16} color={theme.colors.error} />
                  <Text style={styles.likesCount}>{item.likes}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  title: {
    fontWeight: "700",
  },
  searchBar: {
    borderRadius: 12,
    marginBottom: 16,
  },
  chipContainer: {
    gap: 8,
  },
  chip: {
    marginRight: 8,
    borderRadius: 8,
  },
  sectionHeader: {
    display: "flex",
    top: 4,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  communityList: {
    gap: 20,
    paddingBottom: 25,
  },
  communityCard: {
    alignItems: "center",
    marginRight: 16,
  },
  communityName: {
    marginTop: 8,
    fontWeight: "500",
  },
  grid: {
    justifyContent: "space-between",
  },
  productCard: {
    flex: 1,
    maxWidth: "48%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontWeight: "700",
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likesCount: {
    fontSize: 14,
  },
});

export default Explore;
