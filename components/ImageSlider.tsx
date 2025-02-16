import React, { useState } from "react";
import {
  FlatList,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
} from "react-native";
import ProductsImage from "./ProductsImage";
import { useTheme } from "@react-navigation/native"; // Si vous utilisez react-navigation

interface ImageSliderProps {
  images: string[];
}

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 300;

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => setSelectedImage(item)}>
            <View className="mr-2  pt-4">
              <ProductsImage
                path={item}
                fallback="product-placeholder"
                style={[styles.image, { borderColor: colors.border }]}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      />

      {/* Indicateurs de position */}
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor:
                  index === currentIndex ? colors.primary : colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Modal plein écran */}
      <Modal visible={!!selectedImage} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
          <View style={styles.modalContainer}>
            <ProductsImage
              path={selectedImage || ""}
              fallback="product-placeholder"
              style={styles.fullScreenImage}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 20,
  },
  image: {
    width: width - 34,
    height: IMAGE_HEIGHT,
    resizeMode: "cover",
    borderRadius: 8,
  },
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: width,
    height: "100%",
    resizeMode: "contain",
  },
});

export default ImageSlider;
