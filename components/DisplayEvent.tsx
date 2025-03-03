import { useEffect, useState } from "react";
import EventItem from "../components/EventItem";
import { supabase } from "@/lib/supabase";
import { FlatList, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { fetchEvents } from "@/lib/homeService";
import { useQuery } from "@tanstack/react-query";

interface Event {
  id: string;
  title: string;
  file: string[] | null;
  start_date: string;
  end_date: string;
  description: string;
  location: string;
  organizer_id: any;

  // other properties...
}

const DisplayEvents = () => {
  const router = useRouter();

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          profiles (
            id,
            username,
            full_name,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <FlatList
      data={event as Event[]}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      renderItem={({ item }) => (
        <EventItem
          key={item?.id}
          event={item}
          onPress={() =>
            router.push({
              pathname: "/events/details",
              params: {
                id: item?.id,
              },
            })
          }
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
export default DisplayEvents;
