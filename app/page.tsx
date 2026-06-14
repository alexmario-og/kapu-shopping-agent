"use client";

import { useRef, useState } from "react";
import { ChatMessage, CartItem, Product } from "@/lib/types";
import MessageBubble from "@/components/MessageBubble";
import SuggestionChips from "@/components/SuggestionChips";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput("");

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    scrollToBottom();
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setHistory(data.history);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.display,
        },
      ]);
    } catch (err: any) {
      setError(err.message ?? "Kapu had trouble responding. Try again?");
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }

  function handleAddToCart(product: Product) {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.name === product.name);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function handleRemoveFromCart(index: number) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCheckout() {
    if (cart.length === 0) return;
    const itemList = cart
      .map((item) => `${item.quantity} × ${item.name}`)
      .join(", ");
    sendMessage(
      `I'd like to checkout with: ${itemList}. Please walk me through delivery details and create the order.`
    );
    setCartOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <main className="flex h-screen flex-col bg-cream lg:flex-row">
      {/* Chat column */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-line bg-cream/80 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta font-display text-lg text-white">
              K
            </div>
            <div>
              <p className="font-display text-lg leading-tight text-ink">Kapu</p>
              <p className="text-xs text-ink-soft">Kapruka&apos;s shopping companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-chip border border-line bg-white px-3 py-1 text-xs text-ink-soft">
              EN · සිංහල · Tanglish
            </span>
            <button
              onClick={() => setCartOpen(true)}
              className="rounded-chip bg-terracotta px-3 py-1.5 text-xs font-semibold text-white lg:hidden"
            >
              Cart ({cart.reduce((n, i) => n + i.quantity, 0)})
            </button>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div>
                <p className="font-display text-2xl text-ink">
                  Hi! Looking for something today?
                </p>
                <p className="font-sinhala text-lg text-ink-soft">
                  ආයුබෝවන්! මොනවද හොයන්නේ?
                </p>
              </div>
              <SuggestionChips onSelect={sendMessage} />
            </div>
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col gap-5">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onAddToCart={handleAddToCart}
                />
              ))}
              {loading && (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-basil text-xs font-semibold text-white">
                    K
                  </div>
                  <div className="rounded-card rounded-tl-sm bg-white px-4 py-2.5 text-sm text-ink-soft shadow-soft">
                    typing…
                  </div>
                </div>
              )}
              {error && (
                <p className="text-center text-sm text-terracotta">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-line bg-cream px-4 py-3"
        >
          <div className="mx-auto flex max-w-2xl items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Kapu anything… in English, Sinhala, or Tanglish"
              className="flex-1 rounded-chip border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-chip bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-soft"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Cart */}
      <CartDrawer
        items={cart}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </main>
  );
}
