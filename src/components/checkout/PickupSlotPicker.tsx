"use client";
// src/components/checkout/PickupSlotPicker.tsx

import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { PickupTimeSlot } from "@/types";

interface PickupSlotPickerProps {
  value: string;
  onChange: (v: string) => void;
}

function generatePickupSlots(): PickupTimeSlot[] {
  const slots: PickupTimeSlot[] = [];
  const now = new Date();
  const startHour = 10;
  const endHour = 21;

  for (let h = startHour; h <= endHour; h++) {
    for (const m of [0, 30]) {
      const slot = new Date(now);
      slot.setHours(h, m, 0, 0);

      // Only show slots at least 30 minutes in the future
      if (slot.getTime() > now.getTime() + 30 * 60 * 1000) {
        const label = slot.toLocaleTimeString("en-GH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        slots.push({ label, value: slot.toISOString() });
      }
    }
  }

  return slots.slice(0, 12); // show max 12 slots
}

export function PickupSlotPicker({
  value,
  onChange,
}: PickupSlotPickerProps): React.JSX.Element {
  const slots = useMemo(() => generatePickupSlots(), []);

  return (
    <div className="card p-5 space-y-3">
      <h2 className="font-bold text-base flex items-center gap-2">
        <Clock size={16} className="text-brand-orange" />
        Select Pickup Time
      </h2>
      {slots.length === 0 ? (
        <p className="text-sm text-gray-500">
          We&apos;re not accepting pickup orders right now (10am–9pm).
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {slots.map((slot) => (
            <button
              key={slot.value}
              onClick={() => onChange(slot.value)}
              className={cn(
                "px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-100",
                value === slot.value
                  ? "bg-brand-orange text-white border-brand-orange"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-orange"
              )}
            >
              {slot.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
