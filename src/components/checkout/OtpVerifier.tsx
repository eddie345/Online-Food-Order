"use client";
// src/components/checkout/OtpVerifier.tsx

import React, { useState } from "react";
import { Phone, Shield } from "lucide-react";

interface OtpVerifierProps {
  onSuccess: (token: string, phone: string) => void;
}

export function OtpVerifier({ onSuccess }: OtpVerifierProps): React.JSX.Element {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidPhone = /^0\d{9}$/.test(phone);

  const handleSendOtp = async (): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error ?? "Failed to send OTP.");
      }

      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error ?? "Verification failed.");
      }

      const { token } = (await res.json()) as { token: string };
      onSuccess(token, phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-xl">
          <Shield size={20} className="text-brand-orange" />
        </div>
        <div>
          <h2 className="font-bold text-base">Verify Your Phone</h2>
          <p className="text-xs text-gray-500">
            {otpSent
              ? `Enter the 6-digit code sent to ${phone}`
              : "We&apos;ll send you a one-time code to confirm your order."}
          </p>
        </div>
      </div>

      {!otpSent ? (
        <div className="space-y-3">
          <div className="relative">
            <Phone
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0243799362"
              maxLength={10}
              className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
          <button
            onClick={() => void handleSendOtp()}
            disabled={!isValidPhone || loading}
            className="btn-primary w-full"
          >
            {loading ? "Sending…" : "Send OTP"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center
                       text-xl font-bold tracking-widest focus:outline-none
                       focus:border-brand-orange transition-colors"
          />
          <button
            onClick={() => void handleVerifyOtp()}
            disabled={code.length !== 6 || loading}
            className="btn-primary w-full"
          >
            {loading ? "Verifying…" : "Confirm Code"}
          </button>
          <button
            onClick={() => setOtpSent(false)}
            className="text-xs text-gray-400 w-full text-center hover:text-gray-600"
          >
            Use a different number
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-xl p-3">{error}</p>
      )}
    </div>
  );
}
