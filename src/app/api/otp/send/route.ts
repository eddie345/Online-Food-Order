// src/app/api/otp/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OtpSendSchema } from "@/schemas/otp.schema";
import { createOtp, OtpError } from "@/lib/otp";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();
    const parsed = OtpSendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { phone } = parsed.data;
    const code = await createOtp(phone);

    // In production, send via Africa's Talking.
    // For test/sandbox: log to console (warning level per ESLint rule).
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[OTP] Phone: ${phone} → Code: ${code}`);
    } else {
      // For OTP we use a custom message directly via AT SDK
      const AfricasTalking = (await import("africastalking")).default;
      const at = AfricasTalking({
        apiKey: process.env.AT_API_KEY ?? "",
        username: process.env.AT_USERNAME ?? "",
      });
      await at.SMS.send({
        to: [`+233${phone.slice(1)}`],
        message: `Your CEPE Grills verification code is: ${code}. Valid for 10 minutes.`,
        from: "CEPE",
      });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully." });
  } catch (err) {
    if (err instanceof OtpError && err.code === "RATE_LIMITED") {
      return NextResponse.json({ error: err.message }, { status: 429 });
    }
    console.error("[POST /api/otp/send]", err);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
