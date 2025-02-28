import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Share,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { shadow } from "react-native-paper";
import Entypo from "@expo/vector-icons/Entypo";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import RemoteImage from "./RemoteImage";
import moment from "moment";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";

import { Easing } from "react-native-reanimated";
import { ModerationActions } from "./ModerationActions";
import { Image } from "expo-image";
import ImageSlider from "./ImageSlider";
import { useAuth } from "@/app/provider/AuthProvider";
import { createNotification } from "@/lib/postServices";
import { CircleUserRound } from "lucide-react-native";
import { timeAgo } from "@/utils/date";

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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { user } = useAuth();

  // Styles modernes
  const textStyles = {
    fontSize: 16,
    lineHeight: 22,
    color: "#1F2937",
  };

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
          .from("post_likes")
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
          .from("post_likes")
          .insert({
            postId: item.id,
            userId: currentUser.id,
          })
          .select()
          .single();

        if (!error) {
          // Créer la notification
          const { data: postOwner } = await supabase
            .from("posts")
            .select("userId")
            .eq("id", item.id)
            .single();

          if (postOwner?.userId && postOwner.userId !== currentUser.id) {
            await createNotification({
              type: "like",
              receiverId: postOwner.userId,
              senderId: currentUser.id,
              postId: parseInt(item.id, 10),
              content: `${
                currentUser.username || currentUser.full_name
              } a aimé votre publication`,
              metadata: {
                interaction_type: "like",
                post_thumbnail: item.media?.[0], // Exemple de métadonnée supplémentaire
              },
            });
          }
        }

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
          .from("post_likes")
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
          table: "post_likes",
          filter: `postId=eq.${item.id}`,
        },
        async (payload) => {
          const { data, error } = await supabase
            .from("post_likes")
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

  const colors = {
    primary: "#6366F1",
    secondary: "#4F46E5",
    accent: "#EC4899",
    background: "#F8FAFC",
    text: "#1F2937",
  };

  const animateLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      {/* En-tête */}
      <View className="flex-row justify-between items-center mb-2">
        <TouchableOpacity
          className="flex-row items-center gap-3"
          onPress={() => router.push("/(profile)")}
        >
          <View className="relative">
            {item?.profiles?.avatar_url?.startsWith("https://") ? (
              <View className="flex-row items-center">
                <Image
                  source={{ uri: item?.profiles?.avatar_url }}
                  style={{ width: 34, height: 34, borderRadius: 20 }}
                />

                <View className=" mt-2 ">
                  <Text className="text-base font-semibold text-gray-900">
                    {item?.profiles?.username || item?.profiles?.full_name}
                  </Text>
                  <Text
                    className="text-xs text-gray-500"
                    style={{ fontSize: hp("1.2%") }}
                  >
                    {timeAgo(item?.created_at)}
                  </Text>
                </View>
              </View>
            ) : (
              <View className=" flex-row items-center">
                {!item?.profiles?.avatar_url ? (
                  <CircleUserRound color="#333" size={34} />
                ) : (
                  <RemoteImage
                    path={item?.profiles?.avatar_url}
                    fallback="profile-placeholder"
                    style={{ width: 34, height: 34, borderRadius: 20 }}
                  />
                )}

                <View style={{ marginLeft: 3 }}>
                  <Text
                    className="text-base font-semibold text-gray-900"
                    style={{ fontSize: hp("1.8%"), letterSpacing: 1 }}
                  >
                    {item?.profiles?.username}
                  </Text>
                  <Text
                    className="text-xs text-gray-500"
                    style={{ fontSize: hp("1.2%"), marginTop: -2 }}
                  >
                    {timeAgo(item?.created_at)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {showMoreIcons && (
          <ModerationActions
            postId={item?.id}
            userId={item?.profiles?.id}
            currentUserId={user?.id as string}
          />
        )}
      </View>

      {/* Contenu */}
      <View className="mb-5">
        <Text style={{ fontSize: hp("1.5%"), letterSpacing: 0.5 }}>
          {item?.body}
        </Text>

        {item?.file && item?.file?.length > 0 && (
          <View className="overflow-hidden rounded-xl">
            <ImageSlider images={item?.file} />
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="flex-row justify-between items-center px-2">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            onPress={() => {
              handleLike();
              animateLike();
            }}
            className="flex-row items-center gap-2"
          >
            <AntDesign
              name={liked ? "heart" : "hearto"}
              size={24}
              color={liked ? colors.accent : colors.text}
            />
            <Text
              className="text-gray-600 font-medium"
              style={{ fontSize: hp("1.8%") }}
            >
              {likes?.length || 0}
            </Text>
          </TouchableOpacity>

          <Link
            href={{
              pathname: "/(tabs)/(community)/postDetails",
              params: { postId: item?.id },
            }}
            asChild
          >
            <TouchableOpacity className="flex-row items-center gap-2">
              <Feather name="message-circle" size={22} color={colors.text} />
              <Text className="text-gray-600 font-medium">
                {item?.comments?.length}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={handleShare}>
            <MaterialCommunityIcons
              name="share-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Feather name="bookmark" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 6,
    backgroundColor: "#F5F8FD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#E0E7FF",
    marginRight: 4,
  },
  interactionButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
});

export default PostsCard;
