"use client";
import fetchMenuList from "@/services/fetchMenuList";
import dynamic from "next/dynamic";
import React, { use, useEffect, useState } from "react";

const MenuItemWithCounter = dynamic(() => import("@/component/MenuItemWithCounter"));
const CategorySliderComponent = dynamic(() => import("@/component/CategorySlider"));

const Page = ({ params }) => {
  const [menuData, setMenuData] = useState(null); 
  const [error, setError] = useState(null);
  const awaitedParams = use(params)
  const tableId = awaitedParams?.tableId

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!tableId) {
          throw new Error("Table ID is missing");
        }
        localStorage.clear("tableId")
        localStorage.setItem("tableId",tableId)
        const response = await fetchMenuList(tableId); 
        console.log("Response on PAGE.JS FILE",response)
        if(response.success) setMenuData(response?.data?.menus)
        console.log(response?.data?.menus,"response?.data?.menus")
      } catch (err) {
        console.error("Error fetching menu data at PAGE.JS:", err);
        setError(err);
      }
    };

    fetchData();
  }, [tableId]);

  if (error) {
    throw error
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
        {
          menuData?.map((menuItem,index)=>{
            console.log(index)
           return <MenuItemWithCounter key={index}  /> 
          })
        }
      </div>
    </div>
  );
};

export default Page;