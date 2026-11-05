// src/lib/jwt.ts
// JWT creation and verification using `jose` (edge-compatible, no Node crypto dep).

import { SignJWT, jwtVerify } from "jose";

export class JwtError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JwtError";
  }
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new JwtError(
      "JWT_SECRET must be set and at least 32 characters long."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface JwtPayload {
  phone: string;
}

/**
 * Creates a signed JWT for a verified phone number.
 * TTL: 2 hours.
 */
export async function createOtpJwt(phone: string): Promise<string> {
  const secret = getJwtSecret();

  return new SignJWT({ phone })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .setIssuer("cepe-grills")
    .sign(secret);
}

/**
 * Verifies a JWT and returns the payload.
 * @throws JwtError if the token is invalid or expired.
 */
export async function verifyOtpJwt(token: string): Promise<JwtPayload> {
  const secret = getJwtSecret();

  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: "cepe-grills",
    });

    if (typeof payload["phone"] !== "string") {
      throw new JwtError("Token payload missing phone field.");
    }

    return { phone: payload["phone"] };
  } catch (err) {
    if (err instanceof JwtError) throw err;
    throw new JwtError("Invalid or expired token.");
  }
}
