import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { shadow } from "react-native-paper";
import Entypo from "@expo/vector-icons/Entypo";

import RemoteImage from "./RemoteImage";
import moment from "moment";
import RenderHTML from "react-native-render-html";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const textStyles = {
  fontSize: 16,
};

const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
};
const PostsCard = ({ item, router, currentUser, hasShadow = true }) => {
  console.log(currentUser);

  const { width } = useWindowDimensions();
  const dataTime = moment(item?.created_at).fromNow();

  const hasShadowStyle = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  };

  console.log(item);

  return (
    <View style={[styles.container, hasShadow && hasShadowStyle]}>
      <View className=" flex-row justify-between">
        <View className=" flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.push("/(profile)")}>
            <RemoteImage
              path={item?.profiles?.avatar_url}
              fallback="profile image"
              style={{
                width: 38,
                height: 38,
                borderRadius: 20,
                marginHorizontal: 5,
              }}
            />
          </TouchableOpacity>
          <View className=" gap-0">
            <Text className=" text-lg font-medium">
              {item?.profiles?.username}
            </Text>
            <Text className=" text-sm font-light">{dataTime}</Text>
          </View>
        </View>
        <Entypo name="dots-three-vertical" size={18} color="black" />
      </View>

      <View>
        <View className=" gap-0">
          {item?.body && (
            <RenderHTML
              contentWidth={width}
              source={{ html: item?.body }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>
      </View>

      <View>
        <View className=" flex-row ">
          <TouchableOpacity className=" px-3">
            <FontAwesome5 name="heart" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="px-3">
            <FontAwesome5 name="comment" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="mr-3">
            <Entypo name="share-alternative" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostsCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    borderCurve: "continuous",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    shadowColor: "#000",
  },
});
