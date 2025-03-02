import React from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useQuery } from "@tanstack/react-query";

import SearchInput from "@/components/SearchInput";
import Categories from "@/components/Cathegory";
import DisplayEvents from "@/components/DisplayEvent";
import LastItems from "@/components/LastItems";
import { fetchEvents } from "@/lib/homeService";

const Explore = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: events, refetch: refetchEvents } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchEvents(),
      // Ajoutez d'autres refetch si nécessaire
    ]);
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explorer</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchInput />
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <Categories />
        </View>

        {/* Events Section */}
        {events && events.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Événements à venir</Text>
            <DisplayEvents />
          </View>
        )}

        {/* Latest Services */}
        <View style={styles.sectionContainer}>
          <LastItems />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FD",
  },
  header: {
    paddingHorizontal: wp("4%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("1%"),
  },
  title: {
    fontSize: hp("3%"),
    fontWeight: "700",
    color: "#1F2937",
  },
  searchContainer: {
    paddingHorizontal: wp("4%"),
    zIndex: 1000,
  },
  sectionContainer: {
    marginTop: hp("2%"),
    paddingHorizontal: wp("4%"),
  },
  sectionTitle: {
    fontSize: hp("2.2%"),
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: hp("1%"),
  },
});

export default Explore;
