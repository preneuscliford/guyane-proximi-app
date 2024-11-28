import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import {} from "react-native-safe-area-context";
import { useAuth } from "@/app/provider/AuthProvider";
import { Appbar, Button } from "react-native-paper";
import { useNavigation, useRouter } from "expo-router";
import RemoteImage from "@/components/RemoteImage";
import RichTextEditor from "@/components/RichTextEditor";
import { supabase } from "@/lib/supabase";
interface RichTextEditor {
  setContentHTML(html: string): void;
  // ...
}
const create = () => {
  const [loading, setLoading] = useState(false);
  const { session, user, userData } = useAuth();

  const router = useRouter();
  const bodyRef = useRef("");
  const editorRef = useRef<RichTextEditor>(null);

  const createPost = async () => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("posts")
        .upsert({
          body: bodyRef.current,
          userId: session?.user.id,
        })
        .select()
        .single();

      if (error) {
        console.log(error);
        setLoading(false);
      }

      setLoading(false);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView className=" h-full bg-white ">
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          style={{ alignItems: "center" }}
          title="Créer un Post"
        />
      </Appbar.Header>
      <View className=" my-5  flex-row  ">
        <TouchableOpacity onPress={() => router.push("/(profile)")}>
          <RemoteImage
            path={userData?.avatar_url}
            fallback="profile image"
            style={{
              width: 48,
              height: 48,
              marginHorizontal: 10,
              borderRadius: 5,
            }}
          />
        </TouchableOpacity>
        <View>
          <Text className=" text-xl font-normal ">{userData?.username}</Text>
          <Text className=" text-sm">Public</Text>
        </View>
      </View>

      <View className=" flex-1 h-full">
        <RichTextEditor
          editorRef={editorRef}
          onchange={(body: string) => (bodyRef.current = body)}
        />
      </View>

      <View className=" py-10 px-4">
        <Button
          icon=""
          mode="contained"
          className=" p-5 bg-secondary-200 rounded-3xl"
          disabled={loading}
          onPress={createPost}
          style={{ width: "100%", padding: 5, borderRadius: 10 }}
        >
          Post
        </Button>
      </View>
    </ScrollView>
  );
};

export default create;

const styles = StyleSheet.create({});
