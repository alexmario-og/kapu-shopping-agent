"use client";

import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface GiftBoardProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function GiftBoard({ products, onAddToCart }: GiftBoardProps) {
  return (
    <div className="animate-rise-in rounded-card border border-gold/30 bg-gradient-to-br from-gold/10 via-cream to-terracotta/5 p-3">
      <p className="mb-2 font-display text-sm text-ink-soft">
        🎁 A few ideas, picked for the occasion
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {products.slice(0, 6).map((product, i) => (
          <ProductCard
            key={product.id ?? `${product.name}-${i}`}
            product={product}
            onAddToCart={onAddToCart}
            compact
          />
        ))}
      </div>
    </div>
  );
}
