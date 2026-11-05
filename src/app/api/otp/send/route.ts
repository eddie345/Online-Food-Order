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

    const apiKey = process.env.AT_API_KEY;
    const username = process.env.AT_USERNAME;
    const isLiveKeyConfigured =
      Boolean(apiKey) &&
      apiKey !== "test_at_api_key" &&
      !apiKey?.startsWith("test_");

    let smsDispatched = false;

    if (isLiveKeyConfigured && username) {
      try {
        const AfricasTalking = (await import("africastalking")).default;
        const at = AfricasTalking({ apiKey: apiKey ?? "", username });
        await at.SMS.send({
          to: [`+233${phone.slice(1)}`],
          message: `Your CEPE Grills verification code is: ${code}. Valid for 10 minutes.`,
          from: "CEPE",
        });
        smsDispatched = true;
      } catch (err) {
        console.warn(
          "[OTP SMS] Africa's Talking dispatch failed; falling back to preview code:",
          err instanceof Error ? err.message : err
        );
      }
    } else {
      console.warn(`[OTP Preview] Phone: ${phone} → Code: ${code}`);
    }

    return NextResponse.json({
      success: true,
      message: smsDispatched
        ? "OTP sent successfully to your phone."
        : "OTP generated successfully.",
      demoCode: !smsDispatched ? code : undefined,
    });
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
