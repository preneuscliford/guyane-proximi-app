import React, { useState } from "react";
import { View, TouchableOpacity, Linking } from "react-native";
import { Card, Text, useTheme, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import RemoteImage from "./RemoteImage";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface UserInfoCardProps {
  user: any;
  isOwner?: boolean;
}

const UserInfoCard = ({ user, isOwner }: UserInfoCardProps) => {
  const router = useRouter();
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const essentialInfo = [
    { icon: "phone", value: user.phone },
    { icon: "location-on", value: user.address },
  ].filter((info) => info.value);

  const additionalInfo = [
    { icon: "info", value: user.bio, type: "text" },
    { icon: "link", value: user.website, type: "link" },
    {
      icon: "social-distance",
      value: user.social_links && (
        <View className="flex-row gap-3">
          {user.social_links.instagram && (
            <Text>@{user.social_links.instagram}</Text>
          )}
          {user.social_links.twitter && (
            <Text>@{user.social_links.twitter}</Text>
          )}
        </View>
      ),
    },
  ].filter((info) => info.value);

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 16,
      }}
    >
      <View>
        <View className="mr-4 flex-row items-center">
          {user?.avatar_url && user.avatar_url.startsWith("https://") && (
            <Image
              source={{ uri: user?.avatar_url }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 20,
                marginRight: 8,
              }}
            />
          )}
          {(user.avatar_url && !user.avatar_url.startsWith("https://") && (
            <RemoteImage
              path={user.avatar_url}
              fallback="account-circle"
              style={{
                width: 34,
                height: 34,
                borderRadius: 32,
                marginRight: 4,
              }}
            />
          )) ||
            (!user.avatar_url && (
              <MaterialIcons
                name="account-circle"
                size={34}
                color={theme.colors.outline}
                style={{ marginRight: 4 }}
              />
            ))}

          <View>
            <Text
              variant="titleMedium"
              className="font-bold text-slate-800 "
              style={{ fontSize: hp("1.8%"), letterSpacing: 1 }}
            >
              {user.full_name || user.username}
            </Text>
            {/* {user.username && (
              <Text variant="bodyMedium" className="text-slate-500 ">
                @{user.username}
              </Text>
            )} */}
          </View>
        </View>

        <View style={{ paddingHorizontal: 8 }}>
          {/* {essentialInfo.map((info, index) => (
            <View
              key={index}
              className="flex-row items-center gap-2 mb-1 mx-16 "
              style={{ marginLeft: 32 }}
            >
              <MaterialIcons
                name={info.icon as any}
                size={20}
                color={theme.colors.primary}
              />
              <Text
                variant="bodyMedium"
                className="text-slate-600"
                style={{ fontSize: hp("1.3%"), letterSpacing: 0.5 }}
              >
                {info.value}
              </Text>
            </View>
          ))} */}
          {/* 
          {isExpanded &&
            additionalInfo.map((info, index) => (
              <View
                key={`add-${index}`}
                className="flex-row items-center gap-2 mb-1"
                style={{ marginLeft: 32 }}
              >
                <MaterialIcons
                  name={info.icon as any}
                  size={16}
                  color={theme.colors.primary}
                />
                {info.type === "link" || "text" ? (
                  <Text
                    className="text-indigo-600"
                    onPress={() => Linking.openURL(info.value)}
                  >
                    {info.value}
                  </Text>
                ) : (
                  info.value
                )}
              </View>
            ))} */}

          <View className="flex-row justify-between ">
            {/* <Button
              mode="text"
              onPress={() => setIsExpanded(!isExpanded)}
              className="self-start -ml-3"
              labelStyle={{ color: theme.colors.primary, fontSize: hp("1.2%") }}
            >
              {isExpanded ? "Voir moins" : "Voir plus"}
            </Button> */}

            {/* {isOwner && (
              <Button
                mode="contained"
                className="rounded-full"
                onPress={() => router.push("/(tabs)/(profile)/editProfile")}
                icon="pencil"
              >
                Modifier
              </Button>
            )} */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserInfoCard;
