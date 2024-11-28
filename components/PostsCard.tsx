import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { shadow } from "react-native-paper";
import Entypo from "@expo/vector-icons/Entypo";

import RemoteImage from "./RemoteImage";
import moment from "moment";
import RenderHTML from "react-native-render-html";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { supabase } from "@/lib/supabase";

const textStyles = {
  fontSize: 16,
};

const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
};
const PostsCard = ({ item, router, currentUser, hasShadow = true }) => {
  const { width } = useWindowDimensions();
  const [likes, setLikes] = useState<any>([]);
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

  const handleLike = async () => {
    try {
      if (liked) {
        let updateLikes = likes?.filter(
          (like: any) => like?.userId !== currentUser?.id
        );
        setLikes([...updateLikes]);

        await removeLike({ postId: item?.id, userId: currentUser?.id });
      } else {
        const { data, error }: any = await supabase
          .from("postLikes")
          .insert({ postId: item?.id, userId: currentUser?.id })
          .select()
          .single();
        setLikes([...likes, data]);
        if (error) {
          console.log(error);
        }

        console.log("success", data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const removeLike = async ({ postId, userId }: any) => {
    try {
      const { error }: any = supabase
        .from("postLikes")
        .delete()
        .eq("userId", userId)
        .eq("postId", postId)
        .single();

      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);

  const liked = likes?.filter(
    (like: any) => like?.userId === currentUser?.id
  )[0]
    ? true
    : false;

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

      <View className=" flex-row items-center gap-14">
        <View className=" flex-row items-center px-4 gap-4">
          <TouchableOpacity onPress={handleLike} className="mr-3">
            <Entypo
              name={liked ? "heart" : "heart-outlined"}
              size={24}
              color={liked ? "red" : "black"}
            />
          </TouchableOpacity>
          <Text className=" text-sm font-medium"> {likes?.length || 0}</Text>
        </View>

        <View className=" flex-row items-center mr-5 gap-4">
          <TouchableOpacity className="mr-3">
            <FontAwesome5 name="comment" size={24} color="black" />
          </TouchableOpacity>
          <Text className=" text-sm font-medium"> 0</Text>
        </View>

        <View className=" flex-row items-center px-4 gap-4">
          <TouchableOpacity className=" mr-3">
            <Entypo name="share-alternative" size={24} color="black" />
          </TouchableOpacity>
          <Text className=" text-sm font-medium"> 0</Text>
        </View>

        <View className=" flex-row items-center mr-5 gap-4"></View>
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
