"use client";

import React, { use, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import CartToast from "@/component/CartToast";
import fetchCart from "@/services/fetchCart";
import fetchMenuList from "@/services/fetchMenuList";
import updateCartApi from "@/services/updateCart";
import debounce from "@/utils/debounce";

const MenuItemWithCounter = dynamic(() => import("@/component/MenuItemWithCounter"));
const CategorySliderComponent = dynamic(() => import("@/component/CategorySlider"));

const Page = ({ params }) => {
  const [menuData, setMenuData] = useState(null);
  const [cartData, setCartData] = useState({});
  const [initialCartData, setInitialCartData] = useState({});
  const [updatedMenuIds, setUpdatedMenuIds] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const { tableId: tableIdString } = use(params) || {};
  const tableId = Number(tableIdString); 
  
  // Debounced update cart


  const fetchData = useCallback(async () => {
    if (!tableId) {
      setError(new Error("Table ID is missing"));
      return;
    }

    try {
      const [menuRes, cartRes] = await Promise.all([
        fetchMenuList(tableId),
        fetchCart(tableId),
      ]);

      if (menuRes.success) {
        setMenuData(menuRes?.data?.menus || []);
      }

      if (cartRes.success) {
        const cart = cartRes?.data || {};
        setCartData(cart);
        setInitialCartData(cart);
        setTotalItem(
          Object.values(cart).reduce((sum, item) => sum + (item.quantity || 0), 0)
        );
      }

      localStorage.setItem("tableId", tableId);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
    }
  }, [tableId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateCartDebounced = useCallback(
    debounce(async ({ tableId, updatedCart }) => {
      try {
        // Filter the updatedCart to only include items in updatedMenuIds
        console.log(updatedCart,"updatedCart at deboucne")
        console.log("Updated cart before filtering:", updatedCart);
        console.log("Updated menu IDs:", updatedMenuIds);

        const filteredCart = Object.keys(updatedCart)
          .filter((id) => updatedMenuIds.includes(Number(id)))
          .reduce((acc, id) => {
            acc[id] = updatedCart[id];
            return acc;
          }, {});

        console.log("Filtered cart after processing:", filteredCart);

        console.log("Filtered cart payload:", filteredCart);

        const response = await updateCartApi(tableId, filteredCart);
        if (!response.success) throw new Error("Failed to update cart");
        console.log("Cart updated successfully:", response);
      } catch (err) {
        console.error("Error updating cart:", err);
        setError(err);
      }
    }, 2000),
    [updatedMenuIds] // Include updatedMenuIds as a dependency
  );
  
  // Then in your increment/decrement functions:
  const incrementItemCount = useCallback((itemId) => {
    setCartData((prev) => {
      const quantity = (prev[itemId]?.quantity || 0) + 1;
      const updatedCart = {
        ...prev,
        [itemId]: { quantity },
      };
  
      // Track updates
      const initialQuantity = initialCartData[itemId]?.quantity || 0;
      if (quantity !== initialQuantity) {
        setUpdatedMenuIds((prevIds) => [...new Set([...prevIds, itemId])]);
      } else {
        setUpdatedMenuIds((prevIds) => prevIds.filter((id) => id !== itemId));
      }
  
      // Pass the updatedCart directly
      updateCartDebounced({ tableId, updatedCart });
  
      return updatedCart;
    });
  
    setTotalItem((prev) => prev + 1);
  }, [initialCartData, tableId, updateCartDebounced]);

  const decrementItemCount = useCallback((itemId) => {
    setCartData((prev) => {
      const quantity = Math.max((prev[itemId]?.quantity || 0) - 1, 0);
      const updatedCart = {
        ...prev,
        [itemId]: { quantity },
      };
  
      const initialQuantity = initialCartData[itemId]?.quantity || 0;
      if (quantity !== initialQuantity) {
        setUpdatedMenuIds((prevIds) => [...new Set([...prevIds, itemId])]);
      } else {
        setUpdatedMenuIds((prevIds) => prevIds.filter((id) => id !== itemId));
      }
  
      updateCartDebounced({ tableId, updatedCart });
  
      return updatedCart;
    });
  
    setTotalItem((prev) => Math.max(prev - 1, 0));
  }, [initialCartData, tableId, updateCartDebounced]);
  
  if (error) {
    throw error;
  }

  if (!menuData) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="select-none ">
      <div className="p-4 bg-[#E33232]">
        <p className="text-center text-[#FFFFFF] font-semibold text-shadow">
          Mapel Street 2nd floor, ....
        </p>
      </div>
      <CategorySliderComponent />
      <div className="min-h-screen bg-[#72727249]">
        <div className="p-2.5 pb-1">
          <p className="text-[14px] text-[#5F5F5F]">STARTERS</p>
        </div>
        {menuData?.map((menuItem, index) => {
          console.log(index);
          const inCart = cartData[menuItem.id] || false;
          const quantity = cartData?.[menuItem.id]?.quantity || 0;
          return (
            <MenuItemWithCounter
            menuItem={menuItem}
            quantity={quantity}
              alreadyInCart={inCart}
              decrementItemCount={decrementItemCount}
              incrementItemCount={incrementItemCount}
              key={menuItem.id}
            />
          );
        })}
      </div>
      {totalItem>0 && <CartToast itemCount={totalItem} />}
    </div>
  );
};

export default Page;
