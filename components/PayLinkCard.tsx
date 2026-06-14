"use client";

import { PayLink } from "@/lib/types";

export default function PayLinkCard({ payLink }: { payLink: PayLink }) {
  return (
    <div className="tag-card animate-rise-in max-w-sm overflow-hidden pl-6 shadow-lift">
      <div className="border-b border-dashed border-line p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
          Order summary
        </p>
        {payLink.order_ref && (
          <p className="mt-1 text-sm text-ink-soft">
            Order ref: <span className="font-medium text-ink">{payLink.order_ref}</span>
          </p>
        )}
        {payLink.total !== undefined && (
          <p className="font-display text-2xl text-ink">
            {payLink.currency ?? "LKR"} {payLink.total}
          </p>
        )}
      </div>
      <div className="p-4">
        <a
          href={payLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-chip bg-terracotta px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark"
        >
          Pay now →
        </a>
        <p className="mt-2 text-center text-xs text-ink-soft">
          You&apos;ll finish payment on Kapruka&apos;s secure page.
        </p>
      </div>
    </div>
  );
}
