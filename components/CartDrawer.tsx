"use client";

import { CartItem } from "@/lib/types";

interface CartDrawerProps {
  items: CartItem[];
  onRemove: (index: number) => void;
  onCheckout: () => void;
  open: boolean;
  onClose: () => void;
}

function formatPrice(item: CartItem): string {
  if (item.price === undefined) return "";
  const currency = item.currency ?? "LKR";
  const numericPrice =
    typeof item.price === "string" ? parseFloat(item.price) : item.price;
  if (Number.isNaN(numericPrice)) return `${currency} ${item.price}`;
  return `${currency} ${(numericPrice * item.quantity).toFixed(2)}`;
}

function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const numericPrice =
      typeof item.price === "string" ? parseFloat(item.price) : item.price ?? 0;
    return sum + (Number.isNaN(numericPrice) ? 0 : numericPrice * item.quantity);
  }, 0);
}

export default function CartDrawer({
  items,
  onRemove,
  onCheckout,
  open,
  onClose,
}: CartDrawerProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 right-0 z-40 max-h-[70vh] rounded-t-card border-t border-line bg-cream shadow-lift transition-transform duration-300 lg:static lg:max-h-none lg:w-72 lg:translate-y-0 lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-none ${
          open ? "translate-y-0" : "translate-y-full lg:translate-y-0"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Your cart</h2>
            <button
              onClick={onClose}
              className="text-ink-soft lg:hidden"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-ink-soft">
              Nothing here yet — ask Kapu to find something for you!
            </p>
          ) : (
            <div className="flex-1 space-y-2 overflow-y-auto">
              {items.map((item, i) => (
                <div
                  key={`${item.id ?? item.name}-${i}`}
                  className="flex items-center gap-2 rounded-card border border-line bg-white p-2"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-cream" />
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-xs font-medium text-ink">
                      {item.name}
                    </p>
                    <p className="text-xs text-ink-soft">
                      ×{item.quantity} · {formatPrice(item)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(i)}
                    className="text-xs text-ink-soft hover:text-terracotta"
                    aria-label={`Remove ${item.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 border-t border-line pt-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-display text-lg text-ink">
                LKR {cartTotal(items).toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full rounded-chip bg-terracotta px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-soft"
            >
              Checkout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
