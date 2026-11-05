// src/lib/pusher.ts
// Pusher server client for broadcasting real-time events to the KDS.

import Pusher from "pusher";

export class PusherError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PusherError";
  }
}

function createPusherClient(): Pusher {
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    throw new PusherError(
      "Pusher environment variables (PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER) must be set."
    );
  }

  return new Pusher({ appId, key, secret, cluster, useTLS: true });
}

let _pusherInstance: Pusher | null = null;

function getPusherInstance(): Pusher {
  if (!_pusherInstance) {
    _pusherInstance = createPusherClient();
  }
  return _pusherInstance;
}

export type KdsEvent = "order.new" | "order.updated";

export interface KdsEventPayload {
  orderId: string;
  status: string;
  fulfillmentType: string;
  customerPhone: string;
  totalAmount: number;
}

/**
 * Broadcasts an event to the `kitchen` Pusher channel.
 */
export async function broadcastKdsEvent(
  event: KdsEvent,
  payload: KdsEventPayload
): Promise<void> {
  const pusher = getPusherInstance();
  await pusher.trigger("kitchen", event, payload);
}
