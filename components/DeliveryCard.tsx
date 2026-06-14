"use client";

import { DeliveryQuote } from "@/lib/types";

export default function DeliveryCard({ delivery }: { delivery: DeliveryQuote }) {
  return (
    <div className="tag-card animate-rise-in flex max-w-sm flex-col gap-1 p-4 pl-6 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-basil">
        Delivery estimate
      </p>
      {delivery.area && (
        <p className="text-sm text-ink">
          To <span className="font-medium">{delivery.area}</span>
        </p>
      )}
      <div className="mt-1 flex items-center gap-4 text-sm text-ink-soft">
        {delivery.fee !== undefined && (
          <span>
            Fee: <span className="font-medium text-ink">{delivery.fee}</span>
          </span>
        )}
        {delivery.estimated_date && (
          <span>
            Arrives:{" "}
            <span className="font-medium text-ink">
              {delivery.estimated_date}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
