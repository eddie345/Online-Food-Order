// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";

export const metadata: Metadata = {
  title: "CEPE Grills & Diner — Good Food, Good Vibes",
  description:
    "Order delicious Ghanaian meals online from CEPE Grills & Diner. Rice dishes, loaded plates, smoothies, snacks and more.",
  keywords: ["CEPE Grills", "food ordering", "Ghana", "restaurant", "delivery"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
