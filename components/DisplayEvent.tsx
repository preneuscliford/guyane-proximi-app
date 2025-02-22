import { useEffect, useState } from "react";
import EventItem from "../components/EventItem";
import { supabase } from "@/lib/supabase";
import { FlatList, ScrollView } from "react-native";
import { useRouter } from "expo-router";

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
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  // console.log(events);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, organizer_id(*)")
        .order("start_date", { ascending: false });

      if (!error) setEvents(data as any);
    };

    fetchEvents();
  }, []);

  // console.log(events[0].location);

  return (
    <FlatList
      data={events}
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
                title: item?.title,
                file: item?.file,
                start_date: item?.start_date,
                end_date: item?.end_date,
                desc: item?.description,
                location: item?.location,
                organizer_id: item?.organizer_id,
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
