import { View, Text, Image } from "react-native";
import RemoteImage from "./RemoteImage";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";
import ProductsImage from "./ProductsImage";

const ProductCard = ({ image, title, price, category, badges }: any) => (
  <View className="w-[170px] bg-white rounded-xl shadow-lg overflow-hidden">
    <View className="relative">
      <ProductsImage
        path={image}
        fallback={"product image"}
        className="w-full h-40 object-cover"
      />

      {badges?.length > 0 && (
        <View className="absolute top-2 left-2 flex-row gap-1">
          {badges.map(
            (
              badge:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | null
                | undefined,
              index: Key | null | undefined
            ) => (
              <View key={index} className="bg-rose-500 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-medium">{badge}</Text>
              </View>
            )
          )}
        </View>
      )}
    </View>

    <View className="p-3">
      <Text className="text-gray-500 text-xs mb-1">{category}</Text>
      <Text
        className="text-rich-black font-medium mb-2"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      <Text className="text-lg font-bold text-gray-900">€{price}</Text>
    </View>
  </View>
);

export default ProductCard;
