import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/provider/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Définir le type Notification
interface Notification {
  id: number;
  senderId: string;
  receverId: string;
  data: string;
  created_at: string;
  is_read?: boolean; // Optionnel
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      fetchNotifications(session.user.id);
      subscribeToNotifications();
    }
  }, [session]);

  // Récupérer les notifications
  const fetchNotifications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("receverId", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications :", error);
    } finally {
      setLoading(false);
    }
  };

  // Souscrire aux nouvelles notifications
  const subscribeToNotifications = () => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          // Vérifier que payload.new correspond au type Notification
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-ghost-white p-4">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              // Rediriger vers le post concerné (si applicable)
              // Remplace `item.post_id` par une propriété pertinente
              router.push(`/(tabs)/(community)/postDetails?id=${item.id}`);
            }}
            className="p-4 border-b border-gray-200"
          >
            <Text>{item.data}</Text>
            <Text className="text-gray-500">
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text>Aucune notification</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({});
