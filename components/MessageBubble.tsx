"use client";

import { ChatMessage, Product } from "@/lib/types";
import ProductCarousel from "./ProductCarousel";
import GiftBoard from "./GiftBoard";
import DeliveryCard from "./DeliveryCard";
import PayLinkCard from "./PayLinkCard";
import OrderStatusCard from "./OrderStatusCard";

interface MessageBubbleProps {
  message: ChatMessage;
  onAddToCart: (product: Product) => void;
}

export default function MessageBubble({
  message,
  onAddToCart,
}: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="animate-rise-in max-w-[80%] rounded-card rounded-tr-sm bg-terracotta px-4 py-2.5 text-sm text-white shadow-soft">
          {message.content as string}
        </div>
      </div>
    );
  }

  const content = message.content as Exclude<ChatMessage["content"], string>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-basil text-xs font-semibold text-white">
          K
        </div>
        {content.text && (
          <div className="animate-rise-in max-w-[80%] rounded-card rounded-tl-sm bg-white px-4 py-2.5 text-sm text-ink shadow-soft">
            {content.text}
          </div>
        )}
      </div>

      {content.giftBoard && content.giftBoard.length > 0 && (
        <div className="ml-9">
          <GiftBoard products={content.giftBoard} onAddToCart={onAddToCart} />
        </div>
      )}

      {content.products && content.products.length > 0 && (
        <div className="ml-9">
          <ProductCarousel
            products={content.products}
            onAddToCart={onAddToCart}
          />
        </div>
      )}

      {content.delivery && (
        <div className="ml-9">
          <DeliveryCard delivery={content.delivery} />
        </div>
      )}

      {content.payLink && (
        <div className="ml-9">
          <PayLinkCard payLink={content.payLink} />
        </div>
      )}

      {content.orderStatus && (
        <div className="ml-9">
          <OrderStatusCard status={content.orderStatus} />
        </div>
      )}
    </div>
  );
}
