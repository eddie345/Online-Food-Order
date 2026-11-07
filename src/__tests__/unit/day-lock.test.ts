// src/__tests__/unit/day-lock.test.ts
// Tests MUST pass before core logic is considered complete.

import { isItemAvailableToday, formatAvailabilityLabel } from "@/lib/day-lock";
import { DayOfWeek } from "@prisma/client";

/** Helper: creates a Date for a given day of the week at noon UTC */
function dateForDay(day: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"): Date {
  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const target = dayMap[day];
  const d = new Date("2024-01-07T12:00:00Z"); // Sunday Jan 7
  d.setDate(d.getDate() + target);
  return d;
}

describe("isItemAvailableToday", () => {
  describe("always-available items (empty availableDays)", () => {
    it("returns true for an item with no day restriction", () => {
      expect(isItemAvailableToday([], dateForDay("Mon"))).toBe(true);
      expect(isItemAvailableToday([], dateForDay("Sat"))).toBe(true);
    });
  });

  describe("Tuesday-only items (Waakye / Angwamo)", () => {
    const tuesdayItems: DayOfWeek[] = [DayOfWeek.TUESDAY];

    it("returns true on Tuesday", () => {
      expect(isItemAvailableToday(tuesdayItems, dateForDay("Tue"))).toBe(true);
    });

    it("returns false on Monday", () => {
      expect(isItemAvailableToday(tuesdayItems, dateForDay("Mon"))).toBe(false);
    });

    it("returns false on Wednesday", () => {
      expect(isItemAvailableToday(tuesdayItems, dateForDay("Wed"))).toBe(false);
    });

    it("returns false on Sunday", () => {
      expect(isItemAvailableToday(tuesdayItems, dateForDay("Sun"))).toBe(false);
    });

    it("returns false on Saturday", () => {
      expect(isItemAvailableToday(tuesdayItems, dateForDay("Sat"))).toBe(false);
    });

    it("returns false on Thursday", () => {
      expect(isItemAvailableToday(tuesdayItems, dateForDay("Thu"))).toBe(false);
    });

    it("returns false on Friday", () => {
      expect(isItemAvailableToday(tuesdayItems, dateForDay("Fri"))).toBe(false);
    });
  });

  describe("Thursday-only items (Yam Stews)", () => {
    const thursdayItems: DayOfWeek[] = [DayOfWeek.THURSDAY];

    it("returns true on Thursday", () => {
      expect(isItemAvailableToday(thursdayItems, dateForDay("Thu"))).toBe(true);
    });

    it("returns false on Monday", () => {
      expect(isItemAvailableToday(thursdayItems, dateForDay("Mon"))).toBe(false);
    });

    it("returns false on Tuesday", () => {
      expect(isItemAvailableToday(thursdayItems, dateForDay("Tue"))).toBe(false);
    });

    it("returns false on Wednesday", () => {
      expect(isItemAvailableToday(thursdayItems, dateForDay("Wed"))).toBe(false);
    });

    it("returns false on Friday", () => {
      expect(isItemAvailableToday(thursdayItems, dateForDay("Fri"))).toBe(false);
    });
  });

  describe("multi-day items", () => {
    const multiDay: DayOfWeek[] = [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY];

    it("returns true on Tuesday", () => {
      expect(isItemAvailableToday(multiDay, dateForDay("Tue"))).toBe(true);
    });

    it("returns true on Thursday", () => {
      expect(isItemAvailableToday(multiDay, dateForDay("Thu"))).toBe(true);
    });

    it("returns false on Monday", () => {
      expect(isItemAvailableToday(multiDay, dateForDay("Mon"))).toBe(false);
    });
  });

  describe("default date behaviour", () => {
    it("uses the current date when no date is provided", () => {
      // Smoke test: verify it does not throw
      expect(() => isItemAvailableToday([])).not.toThrow();
    });
  });
});

describe("formatAvailabilityLabel", () => {
  it("returns empty string for no restrictions", () => {
    expect(formatAvailabilityLabel([])).toBe("");
  });

  it("formats single day", () => {
    expect(formatAvailabilityLabel([DayOfWeek.TUESDAY])).toBe("Tuesdays only");
  });

  it("formats two days with & separator", () => {
    expect(
      formatAvailabilityLabel([DayOfWeek.TUESDAY, DayOfWeek.THURSDAY])
    ).toBe("Tuesdays & Thursdays only");
  });
});
