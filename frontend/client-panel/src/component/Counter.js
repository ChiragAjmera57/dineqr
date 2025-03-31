import React from "react";

const Counter = () => {
  return (
    <div className="border-2 border-[#26A034] rounded-md flex w-25 justify-between px-1.5 items-center">
      <div className="w-7 text-center text-[#26A034] font-bold">-</div>
      <div className="w-8 text-center bg-[#26A034] grow text-white">1</div>
      <div className="w-7 text-center text-[#26A034] font-bold">+</div>
    </div>
  );
};

export default Counter;
