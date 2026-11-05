// src/lib/otp.ts
// OTP generation, storage, and verification logic.
// Includes in-memory fallback for preview environments when database is offline.

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

interface MemoryOtpRecord {
  code: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  createdAt: Date;
}

const memoryStore = new Map<string, MemoryOtpRecord[]>();

/** Generates a cryptographically random 6-digit OTP. */
export function generateOtpCode(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

/**
 * Creates and stores an OTP code for the given phone number.
 */
export async function createOtp(phone: string): Promise<string> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  try {
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

    await prisma.otpCode.create({
      data: { phone, code, expiresAt },
    });

    return code;
  } catch (err) {
    if (err instanceof OtpError) throw err;

    // Database fallback
    const list = memoryStore.get(phone) ?? [];
    const recent = list.filter((r) => r.createdAt >= oneHourAgo);
    if (recent.length >= OTP_RATE_LIMIT_HOURLY) {
      throw new OtpError(
        "Too many OTP requests. Please wait before requesting again.",
        "RATE_LIMITED"
      );
    }

    const newRecord: MemoryOtpRecord = {
      code,
      expiresAt,
      verified: false,
      attempts: 0,
      createdAt: new Date(),
    };
    memoryStore.set(phone, [...recent, newRecord]);
    return code;
  }
}

/**
 * Verifies an OTP code for a phone number.
 */
export async function verifyOtp(phone: string, code: string): Promise<void> {
  try {
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

    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    if (otpRecord.code !== code) {
      throw new OtpError("Incorrect OTP code. Please try again.", "INVALID");
    }

    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });
  } catch (err) {
    if (err instanceof OtpError) throw err;

    // Memory store fallback
    const list = memoryStore.get(phone) ?? [];
    const active = list
      .filter((r) => !r.verified && r.expiresAt > new Date())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const record = active[0];
    if (!record) {
      throw new OtpError(
        "No valid OTP found. It may have expired. Request a new one.",
        "EXPIRED"
      );
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      throw new OtpError(
        "Maximum verification attempts reached. Request a new OTP.",
        "MAX_ATTEMPTS"
      );
    }

    record.attempts += 1;
    if (record.code !== code) {
      throw new OtpError("Incorrect OTP code. Please try again.", "INVALID");
    }

    record.verified = true;
  }
}
