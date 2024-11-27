import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
interface RichTextEditorProps {
  editorRef: any;
  onchange: (body: string) => void;
}
const RichTextEditor = ({ editorRef, onchange }: RichTextEditorProps) => {
  return (
    <View style={{ height: 240, paddingHorizontal: 10 }}>
      <RichToolbar
        actions={[
          actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.keyboard,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.removeFormat,
          actions.insertVideo,
          actions.checkboxList,
          actions.undo,
          actions.redo,
          actions.heading1,
          actions.heading4,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor }}>H4</Text>
          ),
        }}
        style={{
          backgroundColor: "#D3D3D3",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
        flatContainerStyle={{ paddingHorizontal: 10, gap: 3 }}
        selectedIconTint="#2D6A4F"
        editor={editorRef}
        desabled={false}
      />

      <RichEditor
        ref={editorRef}
        containerStyle={{
          minHeight: "80%",
          flex: 1,
          borderWidth: 1.5,

          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          borderColor: "#D3D3D3",
          padding: 5,
        }}
        editorStyle={{
          color: "#333",
          placeholderColor: "#D3D3D3",
        }}
        placeholder="Quoi de neuf"
        onChange={onchange}
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({});
