"use client";

import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  compact?: boolean;
}

function formatPrice(product: Product): string {
  if (product.price === undefined) return "";
  const currency = product.currency ?? "LKR";
  return `${currency} ${product.price}`;
}

export default function ProductCard({
  product,
  onAddToCart,
  compact = false,
}: ProductCardProps) {
  return (
    <div
      className={`tag-card flex flex-shrink-0 flex-col overflow-hidden shadow-soft transition-transform hover:-translate-y-0.5 ${
        compact ? "w-40" : "w-56"
      }`}
    >
      <div className="aspect-square w-full overflow-hidden bg-cream">
        {product.image_url ? (
          // Plain <img> for now — domains aren't known ahead of time.
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-soft">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 pt-4">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-ink">
          {product.name}
        </p>
        {product.price !== undefined && (
          <p className="font-display text-base text-terracotta">
            {formatPrice(product)}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-1">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 rounded-chip bg-terracotta px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-terracotta-dark"
          >
            Add to cart
          </button>
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-chip border border-line px-2 py-1.5 text-xs text-ink-soft hover:border-terracotta hover:text-terracotta"
              title="View on Kapruka"
            >
              ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
