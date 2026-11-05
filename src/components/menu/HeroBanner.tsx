"use client";
// src/components/menu/HeroBanner.tsx

import React from "react";

export function HeroBanner(): React.JSX.Element {
  return (
    <div className="relative bg-brand-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-brand-orange/30" />
      <div className="relative max-w-4xl mx-auto px-6 py-10 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🍽️</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              CEPE Grills &amp; Diner
            </h1>
            <p className="text-orange-300 text-sm font-medium tracking-widest uppercase">
              Good Food · Good Vibes
            </p>
          </div>
        </div>
        <p className="text-gray-300 text-sm max-w-sm mt-1">
          Fresh Ghanaian meals, quick bites, and refreshing smoothies — delivered to you or ready for pickup.
        </p>
        <div className="flex gap-4 mt-3 text-xs text-gray-400">
          <span>📞 0243 799 362</span>
          <span>📞 0545 844 248</span>
        </div>
      </div>
    </div>
  );
}
