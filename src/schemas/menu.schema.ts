// src/schemas/menu.schema.ts
import { z } from "zod";

export const DayOfWeekSchema = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

export type DayOfWeekInput = z.infer<typeof DayOfWeekSchema>;
