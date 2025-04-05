"use client";
import BackArrow from "@/component/icons/back";
import Cross from "@/component/icons/cross";
import dynamic from "next/dynamic";
const MenuItemWithCounter = dynamic(()=>import('@/component/MenuItemWithCounter'))
import React from "react";

const Page = () => {
  const decrement = () => {
    console.log("decrement");
  };
  const increment = () => {
    console.log("increment");
  };
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
  const debouncedIncrement = debounce(increment,2000)
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between p-5 bg-[#E33232] text-white items-center shadow sticky top-0">
        <div>
          <BackArrow width={20} />
        </div>
        <div className="font-bold text-2xl">Cart</div>
        <div>
          <Cross width={20} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <MenuItemWithCounter
          alreadyInCart={true}
          incrementItemCount={debouncedIncrement}
          decrementItemCount={decrement}
          menuItem={{ id: 1 }}
          quantity={2}
        />
       
        <MenuItemWithCounter
          alreadyInCart={true}
          incrementItemCount={increment}
          decrementItemCount={decrement}
          menuItem={{ id: 1 }}
          quantity={2}
        />
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