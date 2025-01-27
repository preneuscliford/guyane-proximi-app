import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import { shadow } from "react-native-paper";
import Entypo from "@expo/vector-icons/Entypo";

import RemoteImage from "./RemoteImage";
import moment from "moment";
import RenderHTML from "react-native-render-html";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";

const textStyles = {
  fontSize: 16,
};

const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
};
const PostsCard = ({
  item,
  router,
  currentUser,
  hasShadow = true,
  showMoreIcons = true,
}: any) => {
  const { width } = useWindowDimensions();
  const [likes, setLikes] = useState<any[]>([]);
  const [isLiking, setIsLiking] = useState(false);
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
    if (isLiking || !currentUser?.id) return;

    setIsLiking(true);
    try {
      if (liked) {
        const updatedLikes = likes.filter(
          (like) => like.userId !== currentUser.id
        );
        setLikes(updatedLikes);

        const { error } = await supabase
          .from("postLikes")
          .delete()
          .eq("userId", currentUser.id)
          .eq("postId", item.id);

        if (error) {
          setLikes(likes);
          console.error("Erreur lors de la suppression du like:", error);
          return;
        }
      } else {
        const newLike = {
          postId: item.id,
          userId: currentUser.id,
          created_at: new Date().toISOString(),
        };
        setLikes([...likes, newLike]);

        const { data, error } = await supabase
          .from("postLikes")
          .insert({
            postId: item.id,
            userId: currentUser.id,
          })
          .select()
          .single();

        if (error) {
          setLikes(likes);
          console.error("Erreur lors de l'ajout du like:", error);
          return;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data, error } = await supabase
          .from("postLikes")
          .select("*")
          .eq("postId", item.id);

        if (error) {
          console.error("Erreur lors du chargement des likes:", error);
          return;
        }

        setLikes(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des likes:", error);
      }
    };

    if (item?.id) {
      fetchLikes();
    }
  }, [item?.id]);

  useEffect(() => {
    const likesSubscription = supabase
      .channel(`post-likes-${item.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "postLikes",
          filter: `postId=eq.${item.id}`,
        },
        async (payload) => {
          const { data, error } = await supabase
            .from("postLikes")
            .select("*")
            .eq("postId", item.id);

          if (!error && data) {
            setLikes(data);
          }
        }
      )
      .subscribe();

    return () => {
      likesSubscription.unsubscribe();
    };
  }, [item?.id]);

  const liked = likes?.some((like) => like.userId === currentUser?.id);

  const handleShare = async () => {
    const stripHtmlContent = (html: string) => {
      html = html.replace(/<\/?[^>]+(>|$)/gm, "");
      html = html.replace(/&nbsp;/gm, " ");
      html = html.replace(/&[^;]+;/gm, ""); // Supprime les entités HTML
      return html;
    };
    let content = { message: stripHtmlContent(item?.body) };
    Share.share(content);
  };

  const removeExcessSpaces = (html: string) => {
    return html.replace(/<br\s*\/?>/g, "");
  };

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
        {showMoreIcons && (
          <Entypo name="dots-three-vertical" size={18} color="black" />
        )}
      </View>

      <View>
        <View className=" gap-0">
          {item?.body && (
            <RenderHTML
              contentWidth={width}
              source={{ html: removeExcessSpaces(item?.body) }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>
      </View>

      <View className=" flex-row items-center gap-14">
        <View className=" flex-row items-center px-4 gap-4">
          <TouchableOpacity
            onPress={handleLike}
            className="mr-3"
            disabled={isLiking}
          >
            <Entypo
              name={liked ? "heart" : "heart-outlined"}
              size={24}
              color={liked ? "red" : "black"}
            />
          </TouchableOpacity>
          <Text className=" text-sm font-medium">{likes?.length || 0}</Text>
        </View>

        <View className=" flex-row items-center mr-5 gap-4">
          <Link
            href={{
              pathname: "/(tabs)/(community)/postDetails",
              params: { postId: item?.id },
            }}
            className="mr-3"
          >
            <FontAwesome5 name="comment" size={24} color="black" />
          </Link>
          <Text className=" text-sm font-medium">
            {" "}
            {item?.comments?.length}{" "}
          </Text>
        </View>

        <View className=" flex-row items-center px-4 gap-4">
          <TouchableOpacity onPress={handleShare} className=" mr-3">
            <Entypo name="share-alternative" size={24} color="black" />
          </TouchableOpacity>
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
