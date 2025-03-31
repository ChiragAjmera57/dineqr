import dynamic from "next/dynamic";
import React from "react";
const MenuItemWithCounter = dynamic(()=>import('@/component/MenuItemWithCounter'))
const page = () => {
  return (
    <div className="">
      <div className="p-4 bg-[#E33232]">
        <p className="text-center text-[#FFFFFF] font-semibold text-shadow">
          Mepel Street 2nd floor, ....
        </p>
      </div>
      <div className="p-1.5 pt-2 bg-[#D9D9D9] w-full overflow-x-auto whitespace-nowrap space-x-4 flex no-scrollbar">
        <p className="font-medium text-[13px]">Recommonded</p>
        <p className="font-medium text-[13px]">Main Course</p>
        <p className="font-medium text-[13px]">Starters</p>
        <p className="font-medium text-[13px]">Drinks</p>
        <p className="font-medium text-[13px]">Starters</p>
        <p className="font-medium text-[13px]">Salad</p>
      </div>
      <div className="p-2.5 pb-1 mt-3 ">
        <p className="text-[14px] text-[#5F5F5F]">STARTERS</p>
      </div>
      <MenuItemWithCounter />
    </div>
  );
};

export default page;
