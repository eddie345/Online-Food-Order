// src/lib/otp.ts
// OTP generation, storage, and verification logic.

import { prisma } from "@/lib/prisma";

export class OtpError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "RATE_LIMITED"
      | "EXPIRED"
      | "INVALID"
      | "MAX_ATTEMPTS"
  ) {
    super(message);
    this.name = "OtpError";
  }
}

const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RATE_LIMIT_HOURLY = 3;

/** Generates a cryptographically random 6-digit OTP. */
export function generateOtpCode(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

/**
 * Creates and stores an OTP code for the given phone number.
 * Enforces rate limiting: max 3 OTPs per phone per hour.
 *
 * @throws OtpError with code "RATE_LIMITED" if limit exceeded.
 */
export async function createOtp(phone: string): Promise<string> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentCount = await prisma.otpCode.count({
    where: {
      phone,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentCount >= OTP_RATE_LIMIT_HOURLY) {
    throw new OtpError(
      "Too many OTP requests. Please wait before requesting again.",
      "RATE_LIMITED"
    );
  }

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await prisma.otpCode.create({
    data: { phone, code, expiresAt },
  });

  return code;
}

/**
 * Verifies an OTP code for a phone number.
 *
 * @throws OtpError for expiry, max attempts, or invalid code.
 */
export async function verifyOtp(phone: string, code: string): Promise<void> {
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      phone,
      verified: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    throw new OtpError(
      "No valid OTP found. It may have expired. Request a new one.",
      "EXPIRED"
    );
  }

  if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
    throw new OtpError(
      "Maximum verification attempts reached. Request a new OTP.",
      "MAX_ATTEMPTS"
    );
  }

  // Increment attempt counter
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { attempts: { increment: 1 } },
  });

  if (otpRecord.code !== code) {
    throw new OtpError("Incorrect OTP code. Please try again.", "INVALID");
  }

  // Mark as verified
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { verified: true },
  });
}
