import { useState, useEffect, useCallback, useMemo } from "react";
import fetchCart from "@/services/fetchCart";
import fetchMenuList from "@/services/fetchMenuList";
import updateCartApi from "@/services/updateCart";
import debounce from "@/utils/debounce";
import { useCartContext } from "./cartContext";

const useCart = (tableId) => {
  const { cartData,setCartData,} = useCartContext()
  const [menuData, setMenuData] = useState(null);
  // const [cartData, setCartData] = useState({});
  const [updatedCart, setUpdatedCart] = useState({});
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!tableId) {
        console.error("Table ID is missing");
        return;
      }

      try {
        const [menuRes, cartRes] = await Promise.all([
          fetchMenuList(tableId),
          fetchCart(tableId),
        ]);

        if (menuRes?.success) {
          setMenuData(menuRes.data?.menus || []);
        }

        if (cartRes?.success) {
          const cart = cartRes.data || {};
          setCartData(cart);
          setTotalItem(
            Object.values(cartRes.data).reduce((sum, item) => sum + (item?.quantity || 0), 0)
          );
        }

        localStorage.setItem("tableId", tableId);
      } catch (err) {
        setError(err);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [tableId]);

  const updateCartWithLatestData = useCallback(async (currentUpdatedCart) => {
    try {
      const response = await updateCartApi({ tableId, updatedCart: currentUpdatedCart });
      console.log("RESPONSE FROM UPDATE API", response);
    } catch (error) {
      setError(error);
    }
  }, [tableId]);

  const updateApiDebounced = useMemo(
    () => debounce(updateCartWithLatestData, 2000),
    [updateCartWithLatestData]
  );

  const increment = (itemId, quantity) => {
    setCartData((prev) => ({
      ...prev,
      [itemId]: {...cartData[itemId],quantity:quantity},
    }));
    setUpdatedCart((prev) => {
      const newUpdatedCart = {
        ...prev,
        [itemId]: {...cartData[itemId],quantity:quantity},
      };
      updateApiDebounced(newUpdatedCart);
      return newUpdatedCart;
    });
    setTotalItem((prev) => prev + 1);
  };

  const decrement = (itemId, quantity) => {
    setCartData((prev) => ({
      ...prev,
      [itemId]: {...cartData[itemId],quantity:quantity},
    }));
    setUpdatedCart((prev) => {
      const newUpdatedCart = {
        ...prev,
        [itemId]: {...cartData[itemId],quantity:quantity},
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