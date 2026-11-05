// src/app/order/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { OrderDTO } from "@/types";
import { formatGHS } from "@/lib/cart";
import Link from "next/link";
import { CheckCircle, Clock, Truck, Star, XCircle } from "lucide-react";

const DEFAULT_STATUS_INFO = {
  label: "Awaiting Payment",
  icon: <Clock size={32} />,
  color: "text-yellow-500",
};

const STATUS_INFO: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  PENDING: DEFAULT_STATUS_INFO,
  PAID: {
    label: "Order Confirmed!",
    icon: <CheckCircle size={32} />,
    color: "text-green-500",
  },
  PREPARING: {
    label: "Being Prepared",
    icon: <span className="text-3xl">👨‍🍳</span>,
    color: "text-blue-500",
  },
  READY: {
    label: "Ready for Pickup!",
    icon: <Star size={32} />,
    color: "text-brand-orange",
  },
  OUT_FOR_DELIVERY: {
    label: "On the Way!",
    icon: <Truck size={32} />,
    color: "text-brand-orange",
  },
  COMPLETED: {
    label: "Delivered — Enjoy!",
    icon: <span className="text-3xl">🎉</span>,
    color: "text-green-600",
  },
  CANCELLED: {
    label: "Order Cancelled",
    icon: <XCircle size={32} />,
    color: "text-red-500",
  },
};

export default function OrderTrackingPage({
  params,
}: {
  params: { id: string };
}): React.JSX.Element {
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("otp_token") : null;
    if (!token) {
      setError("Session expired. Please place a new order.");
      return;
    }

    const fetchOrder = async (): Promise<void> => {
      try {
        const res = await fetch(`/api/orders/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Order not found.");
        const data = (await res.json()) as OrderDTO;
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order.");
      }
    };

    void fetchOrder();
    // Poll every 15 seconds for status updates
    const interval = setInterval(() => void fetchOrder(), 15000);
    return () => clearInterval(interval);
  }, [params.id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <XCircle size={48} className="text-red-400 mx-auto" />
          <p className="text-red-500">{error}</p>
          <Link href="/" className="btn-primary inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading your order…</p>
        </div>
      </div>
    );
  }

  const info = STATUS_INFO[order.status] ?? DEFAULT_STATUS_INFO;

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
        {/* Status hero */}
        <div className="card p-8 text-center space-y-3">
          <div className={`${info.color} flex justify-center`}>{info.icon}</div>
          <h1 className="text-xl font-bold">{info.label}</h1>
          <p className="text-sm text-gray-400">
            Order #{order.id.slice(-6).toUpperCase()} · {order.fulfillmentType}
          </p>
        </div>

        {/* Items */}
        <div className="card p-5 space-y-3">
          <h2 className="font-bold text-base">Your Items</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.menuItemName} ({item.variantLabel}) × {item.quantity}
              </span>
              <span className="font-medium">
                {formatGHS(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold text-brand-orange">
            <span>Total Paid</span>
            <span>{formatGHS(order.totalAmount)}</span>
          </div>
        </div>

        <Link href="/" className="btn-secondary w-full text-center block">
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}
