"use client"
import BackArrow from "@/component/icons/back";
import { OrderCard } from "@/component/OrderCard";
import { useOrderContext } from "@/hooks/order";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [expandedCardId, setExpandedCardId] = useState(null); // State to track expanded card
  const { orderData, setOrderData, fetchOrder } = useOrderContext();
  const router = useRouter()
  const toggleExpand = (cardId) => {
    setExpandedCardId((prev) => (prev === cardId ? null : cardId)); // Toggle expansion
  };

  useEffect(()=>{
    if(!orderData){
      fetchOrder()
    }
  },[fetchOrder])

  const navigateToMenu = useCallback(() => {
      const tableId = localStorage.getItem("tableId")
      if(!tableId){
          throw Error("Scan Qr for table again!")
      }
      router.push(`/cart`)
    },[router])
  return (
    <div className="flex flex-col min-h-screen select-none">
      {/* Header */}
      <div className="flex p-5 bg-[#E33232] text-white items-center shadow sticky top-0 justify-between">
      <button onClick={()=>navigateToMenu()}>
        <BackArrow width={20} />
        </button>
        <div className="font-bold text-2xl mx-auto">My Orders</div>
      </div>
      <div className="mt-1.5">
      {(!orderData || orderData.length == 0) ? <div className="flex justify-center items-center h-screen">
    <div className="font-medium text-xl text-center">
      No order found!
    </div>
  </div> : orderData?.map((order) => (
  <OrderCard
    key={order.id}
    order={order}
    isExpanded={expandedCardId === order.id}
    toggleExpand={() => toggleExpand(order.id)}
  />
))}

        
      </div>
    </div>
  );
};

export default Page;