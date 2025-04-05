"use client";
import { useCartContext } from "@/hooks/cartContext";
import debounce from "@/utils/debounce";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import fetchCart from "@/services/fetchCart";
import updateCartApi from "@/services/updateCart";
import BackArrow from "@/component/icons/back";
import Cross from "@/component/icons/cross";

const MenuItemWithCounter = dynamic(() => import("@/component/MenuItemWithCounter"));

const Page = () => {
  const { cartData, setCartData } = useCartContext();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart on hard refresh
  useEffect(() => {
    const handleFetchOnRefresh = async () => {
      const table = Number(localStorage.getItem("tableId"));
      if (!table) return;

      if (performance.navigation.type === 1) {
        // If page was refreshed (type 1 = Reload)
        setIsLoading(true);
        try {
          const response = await fetchCart(table);
          if (response?.success) {
            setCartData(response.data || {});
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleFetchOnRefresh();
  }, [setCartData]);

  const updateCartWithLatestData = useCallback(async (currentUpdatedCart) => {
    try {
      const table = Number(localStorage.getItem("tableId"));
      if (!table) return;
      await updateCartApi({ tableId: table, updatedCart: currentUpdatedCart });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }, []);

  const updateApiDebounced = useMemo(() => debounce(updateCartWithLatestData, 2000), [updateCartWithLatestData]);

  const increment = (itemId, quantity) => {
    setCartData((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity },
    }));
    updateApiDebounced({
      ...cartData,
      [itemId]: { ...cartData[itemId], quantity },
    });
  };

  const decrement = (itemId, quantity) => {
    setCartData((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity },
    }));
    updateApiDebounced({
      ...cartData,
      [itemId]: { ...cartData[itemId], quantity },
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between p-5 bg-[#E33232] text-white items-center shadow sticky top-0">
        <BackArrow width={20} />
        <div className="font-bold text-2xl">Cart</div>
        <Cross width={20} />
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        {Object.values(cartData).map(
          (item) =>
            item.quantity > 0 && (
              <MenuItemWithCounter
                key={item.id}
                alreadyInCart
                incrementItemCount={increment}
                decrementItemCount={decrement}
                menuItem={item}
                quantity={item.quantity}
              />
            )
        )}
      </div>

      {/* Footer */}
      <div className="p-3 py-3.5 space-y-3.5 sticky bottom-0 bg-white flex-shrink-0">
        <div className="flex justify-between items-center mx-2">
          <p className="font-semibold">Total</p>
          <p className="font-semibold">₹ 454</p>
        </div>
        <hr className="border-gray-300 my-4" />
        <div className="flex items-center justify-center mx-15 p-2 rounded-2xl bg-[#E33232] text-white font-bold">
          CHECK OUT
        </div>
      </div>
    </div>
  );
};

export default Page;
