import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import ProductCard from "./ProductCard";

interface CategorySectionProps {
  title: string;
  products: any[];
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  products,
}) => {
  if (products.length === 0) return null;

  return (
    <View className="mt-6 px-4">
      <Text variant="titleLarge" className="font-bold mb-4">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="gap-4"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </View>
  );
};

export default CategorySection;
