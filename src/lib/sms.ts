// src/lib/sms.ts
// Africa's Talking SMS notification sender.

export class SmsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SmsError";
  }
}

function getAtCredentials(): { apiKey: string; username: string } {
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME;

  if (!apiKey || !username) {
    throw new SmsError(
      "AT_API_KEY and AT_USERNAME environment variables must be set."
    );
  }

  return { apiKey, username };
}

export type OrderStatusMessage =
  | "PAID"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED";

const STATUS_MESSAGES: Record<OrderStatusMessage, string> = {
  PAID: "✅ Your CEPE Grills order is confirmed & being prepared. Thank you!",
  PREPARING:
    "👨‍🍳 Your CEPE Grills order is now being prepared. Estimated: 20–30 min.",
  READY: "🎉 Your CEPE Grills order is ready for pickup! Please come collect it.",
  OUT_FOR_DELIVERY:
    "🛵 Your CEPE Grills order is on the way! Sit tight.",
  COMPLETED:
    "🙏 Order delivered. Enjoy your meal! — CEPE Grills & Diner (0243799362)",
};

/**
 * Sends an SMS to the customer for a given order status.
 *
 * @param phone  - Recipient phone number (Ghanaian format: 0XXXXXXXXX)
 * @param status - Order status to notify about
 * @param orderId - Short order reference for the message
 */
export async function sendOrderStatusSms(
  phone: string,
  status: OrderStatusMessage,
  orderId: string
): Promise<void> {
  const { apiKey, username } = getAtCredentials();
  const message = `[Order #${orderId.slice(-6)}] ${STATUS_MESSAGES[status]}`;

  // Dynamically import africastalking to avoid issues in test environments
  const AfricasTalking = (await import("africastalking")).default;
  const at = AfricasTalking({ apiKey, username });
  const sms = at.SMS;

  const result = await sms.send({
    to: [`+233${phone.slice(1)}`], // Convert 0XXXXXXXXX → +233XXXXXXXXX
    message,
    from: "CEPE",
  });

  if (result.SMSMessageData.Recipients[0]?.status !== "Success") {
    throw new SmsError(
      `SMS delivery failed for ${phone}: ${JSON.stringify(result)}`
    );
  }
}
