"use client";

import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductCarousel({
  products,
  onAddToCart,
}: ProductCarouselProps) {
  return (
    <div className="animate-rise-in -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-thin">
      {products.map((product, i) => (
        <ProductCard
          key={product.id ?? `${product.name}-${i}`}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
