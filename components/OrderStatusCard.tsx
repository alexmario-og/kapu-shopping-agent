"use client";

import { OrderStatus } from "@/lib/types";

export default function OrderStatusCard({ status }: { status: OrderStatus }) {
  return (
    <div className="tag-card animate-rise-in max-w-md p-4 pl-6 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-basil">
        Order {status.order_ref}
      </p>
      <div className="mt-4 flex items-center">
        {status.steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`h-3 w-3 rounded-full border-2 ${
                  step.done
                    ? "border-basil bg-basil"
                    : "border-line bg-white"
                }`}
              />
              <span
                className={`text-center text-[11px] leading-tight ${
                  step.done ? "font-medium text-ink" : "text-ink-soft"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < status.steps.length - 1 && (
              <div
                className={`mx-1 h-0.5 flex-1 ${
                  status.steps[i + 1].done || step.done
                    ? "bg-basil"
                    : "bg-line"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
