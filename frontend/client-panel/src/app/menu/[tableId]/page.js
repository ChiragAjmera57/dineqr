"use client";
import RightArrow from "@/component/icons/rightArrow";
import fetchCart from "@/services/fetchCart";
import fetchMenuList from "@/services/fetchMenuList";
import updateCartApi from "@/services/updateCart";
import dynamic from "next/dynamic";
import React, { use, useEffect, useState } from "react";

const MenuItemWithCounter = dynamic(() =>
  import("@/component/MenuItemWithCounter")
);
const CategorySliderComponent = dynamic(() =>
  import("@/component/CategorySlider")
);

const Page = ({ params }) => {
  const [menuData, setMenuData] = useState(null);
  // const [cartData, setCartData] = useState(null);
  const [error, setError] = useState(null);
  const [itemCounter, setCounter] = useState({});
  const awaitedParams = use(params);
  const tableId = awaitedParams?.tableId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!tableId) {
          throw new Error("Table ID is missing");
        }
        localStorage.clear("tableId");
        localStorage.setItem("tableId", tableId);
        const response = await fetchMenuList(tableId);
        console.log("Response on PAGE.JS FILE", response);
        if (response.success) setMenuData(response?.data?.menus);
        console.log(response?.data?.menus, "response?.data?.menus");
      } catch (err) {
        console.error("Error fetching menu data at PAGE.JS:", err);
        setError(err);
      }
    };

    const fetchCartItem = async () => {
      try {
        if (!tableId) {
          throw new Error("Table ID is missing!");
        }
        const responseCart = await fetchCart(tableId);
        console.log("RESPONSE for cart on PAGE.JS", responseCart);
        if (responseCart.success){
          // setCartData(responseCart?.data);
          const serialized_obj = {};
          Object.entries(responseCart?.data).forEach(([key, value]) => {
            serialized_obj[key] = value.quantity;
          });
          console.log(serialized_obj, "serialized_obj");
          setCounter(serialized_obj);
        } 
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
    fetchCartItem();
  }, [tableId]);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const updateCart = debounce(async (itemId, newQuantity) => {
    try {
      const response = await updateCartApi(tableId, itemId, newQuantity);
      if (!response.success) {
        throw new Error("Failed to update cart");
      }
      console.log("Cart updated successfully:", response);
    } catch (error) {
      console.error("Error updating cart:", error);
      setError(error);
    }
  }, 500); // 500ms debounce delay

  const incrementItemCount = (itemId) => {
    console.log(itemId, "Incrementing item in PAGE.JS");
    const currQuantity = itemCounter[itemId] || 0;
    const newQuantity = currQuantity + 1;

    setCounter((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));

    updateCart(itemId, newQuantity);
  };

  const decrementItemCount = (itemId) => {
    console.log(itemId, "Decrementing item in PAGE.JS");
    const currQuantity = itemCounter[itemId] || 0;
    const newQuantity = Math.max(currQuantity - 1, 0);

    setCounter((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));

    updateCart(itemId, newQuantity);
  };
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
          const inCart = itemCounter[menuItem.id] || false;
          return (
            <MenuItemWithCounter
            menuItem={menuItem}
            quantity={itemCounter[menuItem.id] || 0}
              alreadyInCart={inCart}
              decrementItemCount={decrementItemCount}
              incrementItemCount={incrementItemCount}
              key={index}
            />
          );
        })}
      </div>
      <div className="sticky bottom-0 p-3 text-center space-y-1 bg-[#E33232]">
        <div className="flex flex-row text-center items-center justify-center space-x-2 content-center">
        <p className="text-center text-[#FFFFFF] font-semibold ">1 item added!</p>
        <div>{<RightArrow className="text-white" color="white" />}</div>
        </div>
        <p className="text-center text-[#FFFFFF] font-semibold ">1 item added to you cart!</p>
      </div>
    </div>
  );
};

export default Page;
