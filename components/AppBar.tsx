import { useRouter } from "expo-router";
import * as React from "react";
import { Appbar } from "react-native-paper";

const BackAppbar = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <Appbar.Header style={{ backgroundColor: "#F5F8FD" }}>
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content style={{ alignItems: "center" }} title={title} />
    </Appbar.Header>
  );
};

export default BackAppbar;
