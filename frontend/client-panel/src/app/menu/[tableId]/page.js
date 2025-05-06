"use client";

import React, { use } from "react";
import dynamic from "next/dynamic";
import useCart from "@/hooks/useCart";
import CartToast from "@/component/CartToast";
import OrderIcon from "@/component/icons/order";
import { useRouter } from "next/navigation";

const MenuItemWithCounter = dynamic(() => import("@/component/MenuItemWithCounter"));
const CategorySliderComponent = dynamic(() => import("@/component/CategorySlider"));

const Page = ({ params }) => {
  const unwrappedParams = use(params);
  const { tableId: tableIdString } = unwrappedParams;
  const tableId = Number(tableIdString);
  const router = useRouter()
  const { menuData, cartData, totalItem, error, increment, decrement } = useCart(tableId);

  // if (!menuData || !cartData) {
  //   return <div>...Loading!</div>;
  // }

  if (error) {
    throw error;
  }

  return (
    <div className="select-none">
      <div className="p-4 bg-[#E33232] flex justify-between items-center">
        <p className="text-center text-[#FFFFFF] font-semibold text-shadow flex-1">
          Mapel Street 2nd floor, ....
        </p>
        <div className="ml-4" onClick={()=>router.push('/orders') }>
          <OrderIcon width={26} height={26} color="#E33232" />
        </div>
      </div>
      <CategorySliderComponent />
      <div className="min-h-screen bg-[#72727249]">
        <div className="p-2.5 pb-1">
          <p className="text-[14px] text-[#5F5F5F]">STARTERS</p>
        </div>
        {menuData?.map((menuItem) => {
          const quantity = Number(cartData?.[menuItem.id]?.quantity) || 0;
          return (
            <MenuItemWithCounter
              key={menuItem.id}
              menuItem={menuItem}
              forCartpage={false}
              quantity={quantity}
              alreadyInCart={cartData[menuItem.id]}
              decrementItemCount={decrement}
              incrementItemCount={increment}
            />
          );
        })}
      </div>
      {totalItem > 0 && <CartToast itemCount={totalItem} />}
    </div>
  );
};

export default Page;