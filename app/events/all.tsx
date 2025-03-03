import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/homeService";
import { StatusBar } from "expo-status-bar";
import EventItem from "@/components/EventItem";

const AllEventsPage = () => {
  const router = useRouter();

  const { data: events, isLoading } = useQuery({
    queryKey: ["allEvents"],
    queryFn: fetchEvents,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Tous les événements</Text>
      </View>

      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventItem
            event={item}
            onPress={() => router.push(`/events/details?id=${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FD",
  },
  header: {
    padding: wp("4%"),
  },
  title: {
    fontSize: hp("2.5%"),
    fontWeight: "700",
    color: "#1F2937",
  },
  listContent: {
    padding: wp("4%"),
    gap: hp("2%"),
  },
});

export default AllEventsPage;
