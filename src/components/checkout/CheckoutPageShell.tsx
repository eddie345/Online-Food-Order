"use client";
// src/components/checkout/CheckoutPageShell.tsx

import React, { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatGHS, buildCartSummary } from "@/lib/cart";
import { calculateDeliveryFee, pickupDeliveryFee } from "@/lib/delivery-fee";
import { OtpVerifier } from "./OtpVerifier";
import { FulfillmentToggle } from "./FulfillmentToggle";
import { DeliveryForm } from "./DeliveryForm";
import { PickupSlotPicker } from "./PickupSlotPicker";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Step = "auth" | "fulfillment" | "payment";

export function CheckoutPageShell(): React.JSX.Element {
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<Step>("auth");
  const [token, setToken] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [fulfillment, setFulfillment] = useState<"DELIVERY" | "PICKUP">("PICKUP");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [pickupSlot, setPickupSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee =
    fulfillment === "DELIVERY"
      ? (() => {
          try {
            return calculateDeliveryFee(deliveryAddress);
          } catch {
            return 0;
          }
        })()
      : pickupDeliveryFee();

  const summary = buildCartSummary(items, deliveryFee);

  const handleOtpSuccess = (jwtToken: string, verifiedPhone: string): void => {
    setToken(jwtToken);
    setPhone(verifiedPhone);
    setStep("fulfillment");
  };

  const handlePlaceOrder = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      const body = {
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        fulfillmentType: fulfillment,
        deliveryAddress: fulfillment === "DELIVERY" ? deliveryAddress : undefined,
        pickupSlot: fulfillment === "PICKUP" ? pickupSlot : undefined,
        customerPhone: phone,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error ?? "Order placement failed.");
      }

      const { paymentUrl } = (await res.json()) as { paymentUrl: string };
      clearCart();
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== "payment") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-5xl">🛒</p>
          <p className="text-gray-500">Your cart is empty.</p>
          <Link href="/" className="btn-primary inline-block">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl hover:bg-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-xl">Checkout</h1>
        </div>

        {/* Step 1: OTP Auth */}
        {step === "auth" && (
          <OtpVerifier onSuccess={handleOtpSuccess} />
        )}

        {/* Step 2+: Fulfillment & Summary */}
        {step !== "auth" && (
          <>
            <FulfillmentToggle value={fulfillment} onChange={setFulfillment} />

            {fulfillment === "DELIVERY" && (
              <DeliveryForm
                value={deliveryAddress}
                onChange={setDeliveryAddress}
              />
            )}

            {fulfillment === "PICKUP" && (
              <PickupSlotPicker value={pickupSlot} onChange={setPickupSlot} />
            )}

            {/* Order Summary */}
            <div className="card p-5 space-y-3">
              <h2 className="font-bold text-base">Order Summary</h2>
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.menuItemName} ({item.variantLabel}) × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatGHS(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatGHS(summary.subtotal)}</span>
                </div>
                {fulfillment === "DELIVERY" && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery Fee</span>
                    <span>{formatGHS(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-brand-orange">
                  <span>Total</span>
                  <span>{formatGHS(summary.total)}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={() => void handlePlaceOrder()}
              disabled={
                loading ||
                (fulfillment === "DELIVERY" && deliveryAddress.trim().length < 5) ||
                (fulfillment === "PICKUP" && !pickupSlot)
              }
              className="btn-primary w-full"
            >
              {loading ? "Processing…" : `Pay ${formatGHS(summary.total)} with Paystack`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
