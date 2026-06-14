"use client";

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

const SUGGESTIONS = [
  { label: "🎁 Find a gift", text: "I need to find a gift" },
  { label: "🔥 What's trending?", text: "What's trending right now?" },
  { label: "🍵 Ceylon tea", text: "Show me some Ceylon tea gift sets" },
  { label: "📦 Track my order", text: "I'd like to track an order" },
];

export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map((s) => (
        <button
          key={s.label}
          onClick={() => onSelect(s.text)}
          className="rounded-chip border border-line bg-white px-4 py-2 text-sm text-ink shadow-soft transition-colors hover:border-terracotta hover:text-terracotta"
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
