"use client";
// src/components/checkout/FulfillmentToggle.tsx

import React from "react";
import { MapPin, Store } from "lucide-react";
import { cn } from "@/lib/cn";

interface FulfillmentToggleProps {
  value: "DELIVERY" | "PICKUP";
  onChange: (v: "DELIVERY" | "PICKUP") => void;
}

export function FulfillmentToggle({
  value,
  onChange,
}: FulfillmentToggleProps): React.JSX.Element {
  return (
    <div className="card p-4">
      <h2 className="font-bold text-base mb-3">How do you want your order?</h2>
      <div className="grid grid-cols-2 gap-3">
        {(["PICKUP", "DELIVERY"] as const).map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150",
              value === type
                ? "border-brand-orange bg-orange-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            {type === "PICKUP" ? (
              <Store
                size={22}
                className={value === type ? "text-brand-orange" : "text-gray-400"}
              />
            ) : (
              <MapPin
                size={22}
                className={value === type ? "text-brand-orange" : "text-gray-400"}
              />
            )}
            <span
              className={cn(
                "font-semibold text-sm",
                value === type ? "text-brand-orange" : "text-gray-500"
              )}
            >
              {type === "PICKUP" ? "Self-Pickup" : "Delivery"}
            </span>
            <span className="text-xs text-gray-400">
              {type === "PICKUP" ? "No extra charge" : "+ GHS 20.00"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
