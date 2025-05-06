"use client"
import { useState, useEffect, useCallback, useMemo } from "react";
import fetchCart from "@/services/fetchCart";
import fetchMenuList from "@/services/fetchMenuList";
import updateCartApi from "@/services/updateCart";
import debounce from "@/utils/debounce";
import { useCartContext } from "./cartContext";

const useCart = (tableId) => {
  const { cartData,setCartData,} = useCartContext()
  const [menuData, setMenuData] = useState(null);
  const [updatedCart, setUpdatedCart] = useState({});
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!tableId) {
        setError(Error("Table not found"))
        console.error("Table ID is missing");
        return;
      }
      
      try {
        localStorage.setItem("tableId", tableId);
        const menuRes = await fetchMenuList(tableId);

        if (menuRes?.success) {
          setMenuData(menuRes.data?.menus || []);
        }

        const cartRes = await fetchCart(tableId);

        const cartDataToSet = cartRes?.success
          ? cartRes.data || {}
          : {};

        localStorage.setItem("cartData", JSON.stringify(cartDataToSet));

        setCartData(cartDataToSet);
        setTotalItem(
          Object.values(cartDataToSet).reduce((sum, item) => sum + (item?.quantity || 0), 0)
        );

      } catch (err) {
        setError(err);
        console.error("Error fetching data:", err);
      }
    };
    
    fetchData();
  }, [setCartData, tableId]);

  const updateCartWithLatestData = useCallback(async (currentUpdatedCart) => {
    try {
      if (!tableId) {
        setError(Error("Table not found"))
        console.error("Table ID is missing");
        return;
      }
      const response = await updateCartApi({ tableId, updatedCart: currentUpdatedCart });
      console.log("RESPONSE FROM UPDATE API", response);
    } catch (error) {
      setError(error);
    }
  }, [tableId]);

  const updateApiDebounced = useMemo(
    () => debounce(updateCartWithLatestData, 1000),
    [updateCartWithLatestData]
  );

  const increment = (item, quantity) => {
    console.log("ITEM AND QUNATITY RECIEVED..",item,"QUANTITY",quantity)
    setCartData((prev) => ({
      ...prev,
      [item.id]: {...item,quantity:quantity},
    }));
    setUpdatedCart((prev) => {
      const newUpdatedCart = {
        ...prev,
        [item.id]: {...item,quantity:quantity},
      };
      updateApiDebounced(newUpdatedCart);
      return newUpdatedCart;
    });
    setTotalItem((prev) => prev + 1);
  };

  const decrement = (item, quantity) => {
    console.log("ITEM AND QUANTITY RECIEVED AT DECREMENT...",item,"QUANTITY",quantity)
    setCartData((prev) => ({
      ...prev,
      [item.id]: {...item,quantity:quantity},
    }));
    setUpdatedCart((prev) => {
      const newUpdatedCart = {
        ...prev,
        [item.id]: {...item,quantity:quantity},
      };
      updateApiDebounced(newUpdatedCart);
      return newUpdatedCart;
    });
    setTotalItem((prev) => (prev - 1 > 0 ? prev - 1 : 0));
  };

  return {
    menuData,
    cartData,
    totalItem,
    error,
    increment,
    decrement,
  };
};

export default useCart;