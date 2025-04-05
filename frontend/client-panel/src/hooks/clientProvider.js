"use client";

import { CartProvider } from "@/hooks/cartContext";

export default function ClientProviders({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
