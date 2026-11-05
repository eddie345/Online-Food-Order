// src/schemas/otp.schema.ts
import { z } from "zod";

export const OtpSendSchema = z.object({
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Phone must be a valid 10-digit Ghanaian number"),
});

export const OtpVerifySchema = z.object({
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Phone must be a valid 10-digit Ghanaian number"),
  code: z
    .string()
    .length(6, "OTP code must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP code must be numeric"),
});

export type OtpSendInput = z.infer<typeof OtpSendSchema>;
export type OtpVerifyInput = z.infer<typeof OtpVerifySchema>;
