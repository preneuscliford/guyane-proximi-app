import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { router, usePathname } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { supabase } from "@/lib/supabase";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface SearchResult {
  id: string;
  title: string;
  type: "event" | "service";
}

const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Recherche dans les événements
      const { data: events } = await supabase
        .from("events")
        .select("id, title")
        .ilike("title", `%${query}%`)
        .limit(5);

      // Recherche dans les services
      const { data: services } = await supabase
        .from("services")
        .select("id, title")
        .ilike("title", `%${query}%`)
        .limit(5);

      const combinedResults = [
        ...(events?.map((e) => ({ ...e, type: "event" as const })) || []),
        ...(services?.map((s) => ({ ...s, type: "service" as const })) || []),
      ];

      setResults(combinedResults);
    } catch (error) {
      console.error("Erreur de recherche:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === "event") {
      router.push(`/events/details?id=${result.id}`);
    } else {
      router.push(`/services/details?id=${result.id}`);
    }
    setSearchQuery("");
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher événements, services..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.input}
        iconColor="#181F27"
        loading={isSearching}
        placeholderTextColor="#9CA3AF"
      />

      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleResultPress(item)}
              >
                <View style={styles.resultContent}>
                  <MaterialCommunityIcons
                    name={item.type === "event" ? "calendar-blank" : "tools"}
                    size={wp("5%")}
                    color="#9333EA"
                  />
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultTitle}>{item.title}</Text>
                    <Text style={styles.resultType}>
                      {item.type === "event" ? "Événement" : "Service"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp("1%"),
    zIndex: 1000,
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp("4%"),
    height: hp("7%"),
    elevation: 2,
  },
  input: {
    fontSize: hp("1.8%"),
    textAlignVertical: "center",
    justifyContent: "center",
    includeFontPadding: false,
    paddingBottom: 0,
    paddingTop: 0,
  },
  resultsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp("3%"),
    marginTop: hp("1%"),
    maxHeight: hp("40%"),
    elevation: 3,
  },
  resultItem: {
    padding: wp("4%"),
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  resultContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: hp("1.8%"),
    color: "#1F2937",
    fontWeight: "500",
  },
  resultType: {
    fontSize: hp("1.4%"),
    color: "#6B7280",
    marginTop: hp("0.5%"),
  },
});

export default SearchInput;
