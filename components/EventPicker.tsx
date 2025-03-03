import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface EventDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  label: string;
  minimumDate?: Date;
}

const EventDatePicker = ({
  date,
  setDate,
  label,
  minimumDate,
}: EventDatePickerProps) => {
  const [showPicker, setShowPicker] = React.useState(false);
  const [mode, setMode] = React.useState<"date" | "time">("date");

  const handlePickerChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (event.type === "dismissed") return;

    if (selectedDate) {
      if (mode === "date") {
        // Fusionner la date sélectionnée avec l'heure existante
        const mergedDate = new Date(selectedDate);
        mergedDate.setHours(date.getHours());
        mergedDate.setMinutes(date.getMinutes());

        if (Platform.OS === "android") {
          setMode("time");
          setShowPicker(true);
        }
        setDate(mergedDate);
      } else {
        // Fusionner l'heure sélectionnée avec la date existante
        const mergedDate = new Date(date);
        mergedDate.setHours(selectedDate.getHours());
        mergedDate.setMinutes(selectedDate.getMinutes());
        setDate(mergedDate);
        setMode("date");
      }
    }
  };

  const showMode = (currentMode: "date" | "time") => {
    setMode(currentMode);
    setShowPicker(true);
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-600 mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() =>
          Platform.OS === "ios" ? setShowPicker(true) : showMode("date")
        }
      >
        <Text className="bg-white-2 py-3 px-5 rounded-xl">
          {format(date, "dd/MM/yyyy HH:mm")}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode={Platform.OS === "ios" ? "datetime" : mode}
          display="default"
          onChange={handlePickerChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

interface EventFormProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export const EventForm = ({ form, setForm }: EventFormProps) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#FFF",
          borderRadius: wp("3%"),
          paddingHorizontal: wp("2%"),
          borderWidth: 1,
          borderColor: "#E2E8F0",
          marginBottom: hp("1%"),
        }}
      >
        <EventDatePicker
          date={form.startDate}
          setDate={(newDate) =>
            setForm((prev: any) => ({
              ...prev,
              startDate: newDate,
              endDate: newDate > prev.endDate ? newDate : prev.endDate,
            }))
          }
          label="Date de début"
        />
      </View>

      <View
        style={{
          backgroundColor: "#FFF",
          borderRadius: wp("3%"),
          paddingHorizontal: wp("2%"),
          borderWidth: 1,
          borderColor: "#E2E8F0",
        }}
      >
        <EventDatePicker
          date={form.endDate}
          setDate={(newDate) =>
            setForm((prev: any) => ({
              ...prev,
              endDate: newDate,
            }))
          }
          label="Date de fin"
          minimumDate={form.startDate}
        />
      </View>
    </View>
  );
};
