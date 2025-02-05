import { useEffect, useState } from "react";
import EventItem from "../components/EventItem";
import { supabase } from "@/lib/supabase";
import { ScrollView } from "react-native";

interface Event {
  id: string;
  title: string;
  file: string[] | null;
  start_date: string;
  end_date: string;

  // other properties...
}
const DisplayEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: true });

      if (!error) setEvents(data as any);
    };

    fetchEvents();
  }, []);

  return (
    <ScrollView className="p-4">
      {events.map((event) => (
        <EventItem key={event.id} event={event} onPress={() => {}} />
      ))}
    </ScrollView>
  );
};
export default DisplayEvents;
