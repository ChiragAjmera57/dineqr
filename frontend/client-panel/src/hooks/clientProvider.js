"use client";

import { CartProvider } from "@/hooks/cartContext";
import { OrderProvider } from "./order";

export default function ClientProviders({ children }) {
  return (
    <CartProvider>
      <OrderProvider>{children}</OrderProvider>
    </CartProvider>
  );
}
