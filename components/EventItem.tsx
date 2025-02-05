import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";
import ProductsImage from "./ProductsImage";

const EventItem = ({ event, onPress }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white mb-4  rounded-lg shadow-sm"
    >
      <View
        className=" rounded-full overflow-hidden"
        style={{ width: "100%", height: 200 }}
      >
        <ProductsImage
          path={event.file[0]}
          fallback={"product image"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </View>

      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 mb-2">
          {event.title}
        </Text>

        <View className=" mb-2">
          <View className="flex-row items-center">
            <MaterialIcons name="date-range" size={16} color="#666" />
            <Text className="text-gray-600 ml-2">
              Début: {format(new Date(event.start_date), "dd/MM/yyyy HH:mm")}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-600 ml-2">
              Fin:
              {format(new Date(event.end_date), " dd/MM/yyyy HH:mm")}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-2">
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text className="text-gray-600 ml-2">{event.location}</Text>
        </View>

        <Text className="text-gray-700" numberOfLines={2}>
          {event.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventItem;
