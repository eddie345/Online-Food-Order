"use client";
// src/components/kds/KdsDashboard.tsx
// Real-time Kitchen Display System using Pusher Channels.

import React, { useEffect, useState, useCallback } from "react";
import Pusher from "pusher-js";
import { KdsEventPayload } from "@/lib/pusher";
import { OrderCard } from "./OrderCard";
import { OrderStatus } from "@prisma/client";

interface KdsOrder extends KdsEventPayload {
  receivedAt: Date;
  status: OrderStatus;
  items?: Array<{ menuItemName: string; variantLabel: string; quantity: number }>;
}

type FilterType = "ALL" | "DELIVERY" | "PICKUP";

function playNotification(): void {
  if (typeof window === "undefined") return;
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.5);
}

export function KdsDashboard(): React.JSX.Element {
  const [orders, setOrders] = useState<KdsOrder[]>([]);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [connected, setConnected] = useState(false);

  const addOrUpdateOrder = useCallback((payload: KdsEventPayload, isNew: boolean) => {
    setOrders((prev) => {
      const existing = prev.findIndex((o) => o.orderId === payload.orderId);
      const updated: KdsOrder = {
        ...payload,
        status: payload.status as OrderStatus,
        receivedAt: existing >= 0 ? (prev[existing]?.receivedAt ?? new Date()) : new Date(),
      };

      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = updated;
        return copy;
      }

      return [updated, ...prev];
    });

    if (isNew) {
      try {
        playNotification();
      } catch {
        // Audio context may not be available yet
      }
    }
  }, []);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key || !cluster) return;

    const pusher = new Pusher(key, { cluster });
    const channel = pusher.subscribe("kitchen");

    channel.bind("order.new", (data: KdsEventPayload) => {
      addOrUpdateOrder(data, true);
    });

    channel.bind("order.updated", (data: KdsEventPayload) => {
      addOrUpdateOrder(data, false);
    });

    pusher.connection.bind("connected", () => setConnected(true));
    pusher.connection.bind("disconnected", () => setConnected(false));

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("kitchen");
      pusher.disconnect();
    };
  }, [addOrUpdateOrder]);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: string
  ): Promise<void> => {
    const kdsSecret = prompt("Enter KDS password:");
    if (!kdsSecret) return;

    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${kdsSecret}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      alert("Failed to update status. Check password.");
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "ALL") return true;
    return o.fulfillmentType === filter;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">🍳 Kitchen Display</h1>
          <p className="text-gray-400 text-sm">CEPE Grills &amp; Diner - Live Orders</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${connected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
          {connected ? "● Live" : "○ Disconnected"}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 mb-6">
        {(["ALL", "PICKUP", "DELIVERY"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? "bg-brand-orange text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {f === "ALL" ? "All Orders" : f === "PICKUP" ? "🏪 Pickup" : "🛵 Delivery"}
          </button>
        ))}
        <div className="ml-auto text-sm text-gray-500 self-center">
          {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-24 text-gray-600">
          <p className="text-5xl mb-4">🔕</p>
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm">New paid orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onStatusUpdate={(newStatus) =>
                void handleStatusUpdate(order.orderId, newStatus)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
