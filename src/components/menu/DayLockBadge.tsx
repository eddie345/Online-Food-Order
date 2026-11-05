"use client";
// src/components/menu/DayLockBadge.tsx

import React from "react";
import { DayOfWeek } from "@prisma/client";
import { formatAvailabilityLabel } from "@/lib/day-lock";
import { cn } from "@/lib/cn";

interface DayLockBadgeProps {
  availableDays: DayOfWeek[];
  isAvailable: boolean;
}

export function DayLockBadge({
  availableDays,
  isAvailable,
}: DayLockBadgeProps): React.JSX.Element {
  const label = formatAvailabilityLabel(availableDays);

  return (
    <span
      className={cn(
        "flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
        isAvailable
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      )}
    >
      {isAvailable ? "✓ " : "🔒 "}
      {label}
    </span>
  );
}
