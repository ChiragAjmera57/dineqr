"use client";
import { useCartContext } from "@/hooks/cartContext";
import debounce from "@/utils/debounce";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import fetchCart from "@/services/fetchCart";
import updateCartApi from "@/services/updateCart";
import BackArrow from "@/component/icons/back";
import Cross from "@/component/icons/cross";
import { useRouter } from "next/navigation";
import placeOrderApi from "@/services/placeOrder";
import OrderSuccess from "@/component/OrderSuccess";
import { useOrderContext } from "@/hooks/order";
import EmtpyCart from "@/component/EmtpyCart";

const MenuItemWithCounter = dynamic(() =>
  import("@/component/MenuItemWithCounter")
);

const Page = () => {
  const { cartData, setCartData, totalPrice } = useCartContext();
  const { orderData, setOrderData, fetchOrder } = useOrderContext();
  const [isLoading, setIsLoading] = useState(false);
  const [updatedCart, setUpdatedCart] = useState({});
  const [error, setError] = useState(null);
  const [tableId, setTableId] = useState(null);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const router = useRouter();
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [orderPlaceLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    const handleFetchOnRefresh = async () => {
      const table = Number(localStorage.getItem("tableId"));
      if (!table) {
        setError(Error("Table not found"))
        throw Error("table id not found");
      }
      setTableId(table);
      if (!cartData || Object.keys(cartData).length === 0) {
        setIsLoading(true);
        try {
          console.log("========calling fetch cart api from cart page====");
          const response = await fetchCart(table);
          if (response?.success) {
            localStorage.removeItem("cartData");
            setCartData(response.data || {});
          }
        } catch (error) {
          setError(error);
          console.error("Error fetching cart data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleFetchOnRefresh();
  }, [setCartData]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isUpdatingCart) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleRouteChangeStart = (url) => {
      if (isUpdatingCart) {
        // Optional: Show some loading indicator
        console.log("Prevent route change until cart is updated");
        throw "Cart is updating, navigation blocked.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events?.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events?.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [isUpdatingCart, router.events]);

  const updateCartWithLatestData = useCallback(
    async (currentUpdatedCart) => {
      try {
        setIsUpdatingCart(true);
        const response = await updateCartApi({
          tableId,
          updatedCart: currentUpdatedCart,
        });
        console.log("RESPONSE FROM UPDATE API", response);
      } catch (error) {
        setError(error);
        console.log("error", error);
      } finally {
        setIsUpdatingCart(false);
      }
    },
    [tableId]
  );

  const navigateToMenu = useCallback(() => {
    const tableId = localStorage.getItem("tableId")
    if(!tableId){
      setError(Error("Table not found"))
        throw Error("Table not found")
    }
    router.push(`/menu/${tableId}`)
  },[router])

  const updateApiDebounced = useMemo(
    () => debounce(updateCartWithLatestData, 2000),
    [updateCartWithLatestData]
  );

  const increment = (item, quantity) => {
    console.log("ITEM AND QUNATITY RECIEVED..", item, "QUANTITY", quantity);
    setCartData((prev) => ({
      ...prev,
      [item.id]: { ...item, quantity: quantity },
    }));
    setUpdatedCart((prev) => {
      const newUpdatedCart = {
        ...prev,
        [item.id]: { ...item, quantity: quantity },
      };
      console.log("callling api....");
      updateApiDebounced(newUpdatedCart);
      return newUpdatedCart;
    });
  };

  const decrement = (item, quantity) => {
    console.log(
      "ITEM AND QUANTITY RECIEVED AT DECREMENT...",
      item,
      "QUANTITY",
      quantity
    );
    setCartData((prev) => ({
      ...prev,
      [item.id]: { ...item, quantity: quantity },
    }));
    setUpdatedCart((prev) => {
      const newUpdatedCart = {
        ...prev,
        [item.id]: { ...item, quantity: quantity },
      };
      updateApiDebounced(newUpdatedCart);
      return newUpdatedCart;
    });
  };
  const placeOrder = async () => {
    try {
      setOrderLoading(true);
      const response = await placeOrderApi({ tableId });
      if (response.success) {
        setOrderLoading(false);
        console.log("ORDER PLACED!!");
        setShowSuccessPage(true);
        localStorage.removeItem("cartData");
        setCartData({});
        fetchOrder();
        setTimeout(() => {
          router.push("/orders");
        }, 1900);
      }
    } catch (error) {
      setOrderLoading(false);
      setError(error);
      throw error;
    }
  };
  if (error) throw error;
  if (isLoading) return <div>Loading...</div>;
  if (showSuccessPage) {
    return <OrderSuccess />;
  }
  return (
    <div className="flex flex-col min-h-screen select-none">
      {/* Header */}
      <div className="flex justify-between p-5 bg-[#E33232] text-white items-center shadow sticky top-0">
        <button onClick={()=>navigateToMenu()}>
        <BackArrow width={20} />
        </button>
        <div className="font-bold text-2xl">Cart</div>
        <button onClick={()=>navigateToMenu()}>
        <Cross width={20} color="white" />
        </button>
      </div>

      {/* Main Content */}
      {!cartData || Object.keys(cartData).length === 0 || totalPrice == 0 ? (
        <EmtpyCart />
      ) : (
        <>
          <div className="flex-grow">
            {Object.values(cartData).map(
              (item) =>
                item.quantity > 0 && (
                  <MenuItemWithCounter
                    key={item?.id}
                    alreadyInCart={item.quantity > 0}
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
              <p className="font-semibold">₹ {totalPrice}</p>
            </div>
            <hr className="border-gray-300 my-4" />
            {!Object.keys(cartData).length == 0 &&
              (orderPlaceLoading ? (
                <div
                  className="flex items-center justify-center mx-17 p-4 rounded-2xl bg-[#E33232] text-white font-bold space-x-2"
                  onClick={() => placeOrder()}
                >
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></div>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center mx-15 p-2 rounded-2xl bg-[#E33232] text-white font-bold"
                  onClick={() => placeOrder()}
                >
                  CHECK OUT
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
