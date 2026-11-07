// src/lib/day-lock.ts
// Pure, deterministic day-of-week availability checker.
// Written to be trivially testable: no side effects, no I/O.

import { DayOfWeek } from "@prisma/client";

const DAY_OF_WEEK_INDEX: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

/**
 * Returns true when a menu item should be available.
 *
 * Rules:
 *  - If `availableDays` is empty, the item is always available.
 *  - If `availableDays` has entries, the item is only available on those days.
 *
 * @param availableDays - Enum values from the DB (e.g. ["TUESDAY"])
 * @param now           - Current date/time (default: new Date()). Injectable for testing.
 */
export function isItemAvailableToday(
  availableDays: DayOfWeek[],
  now: Date = new Date()
): boolean {
  if (availableDays.length === 0) return true;

  const todayIndex = now.getDay(); // 0=Sunday … 6=Saturday
  return availableDays.some((day) => DAY_OF_WEEK_INDEX[day] === todayIndex);
}

/**
 * Returns the human-readable label for the locked days.
 * e.g. ["TUESDAY"] → "Tuesdays only"
 */
export function formatAvailabilityLabel(availableDays: DayOfWeek[]): string {
  if (availableDays.length === 0) return "";

  const labels = availableDays.map(
    (d) => d.charAt(0) + d.slice(1).toLowerCase() + "s"
  );

  return labels.join(" & ") + " only";
}
