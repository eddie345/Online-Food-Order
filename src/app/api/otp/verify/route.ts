// src/app/api/otp/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OtpVerifySchema } from "@/schemas/otp.schema";
import { verifyOtp, OtpError } from "@/lib/otp";
import { createOtpJwt } from "@/lib/jwt";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();
    const parsed = OtpVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { phone, code } = parsed.data;
    await verifyOtp(phone, code);

    const token = await createOtpJwt(phone);

    return NextResponse.json({
      success: true,
      token,
      message: "Phone number verified successfully.",
    });
  } catch (err) {
    if (err instanceof OtpError) {
      const statusMap: Record<string, number> = {
        RATE_LIMITED: 429,
        EXPIRED: 410,
        INVALID: 400,
        MAX_ATTEMPTS: 429,
      };
      return NextResponse.json(
        { error: err.message },
        { status: statusMap[err.code] ?? 400 }
      );
    }
    console.error("[POST /api/otp/verify]", err);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
