import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EmtpyCart = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setTimeout(() => setShow(true), 50);
  }, []);

  const navigateToMenu = () => {
    const tableId = localStorage.getItem("tableId")
    if(!tableId){
        throw Error("Scan Qr for table again!")
    }
    router.push(`/menu/${tableId}`)
  }

  return (
    <div
      className={`flex flex-col items-center justify-center m-auto transition-all duration-500 ease-in-out ${
        show ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
     <svg xmlns="http://www.w3.org/2000/svg" width={180} height={180} id="empty-cart" viewBox="0 0 50 50">
  <path d="M32.5,9.5a7.94113,7.94113,0,0,0-7.90454,9.16992h-8.9964l-.94769-3.791A.49981.49981,0,0,0,14.1665,14.5H10a.5.5,0,0,0,0,1h3.77588l3.9176,15.66992H16.35986a2.65207,2.65207,0,0,0-2.67724,2.32227A2.577,2.577,0,0,0,16.25,36.33008h2.14343a2.55736,2.55736,0,0,0-.55993,1.58642,2.58325,2.58325,0,1,0,5.1665,0,2.55679,2.55679,0,0,0-.56018-1.58642h8.45361a2.55736,2.55736,0,0,0-.55993,1.58642,2.58325,2.58325,0,1,0,2.58642-2.58264v-.00378H16.25a1.57638,1.57638,0,0,1-1.57178-1.74414,1.6469,1.6469,0,0,1,1.68164-1.416h13.27a2.1485,2.1485,0,0,0,2.05469-1.48242l1.74585-5.24628A7.99762,7.99762,0,0,0,32.5,9.5Zm-12.0835,30A1.58325,1.58325,0,1,1,22,37.9165,1.585,1.585,0,0,1,20.4165,39.5ZM34.5,37.9165a1.58325,1.58325,0,1,1-1.5835-1.583A1.58542,1.58542,0,0,1,34.5,37.9165ZM30.73438,30.376a1.15262,1.15262,0,0,1-1.1045.79394H18.72375l-2.87475-11.5h8.95813a8.00572,8.00572,0,0,0,7.55194,5.82294ZM32.5,24.5a7,7,0,1,1,7-7A7.00787,7.00787,0,0,1,32.5,24.5Z"></path>
  <path d="M35.50537,14.49463a.49982.49982,0,0,0-.707,0l-2.2981,2.29809-2.29809-2.29809a.49995.49995,0,0,0-.707.707l2.29809,2.2981-2.29809,2.29809a.49995.49995,0,1,0,.707.707l2.29809-2.29809,2.2981,2.29809a.49995.49995,0,0,0,.707-.707l-2.29809-2.29809,2.29809-2.2981A.49982.49982,0,0,0,35.50537,14.49463Z"></path>
</svg>
      <p className="text-center font-medium text-[#2b2a2ad5] text-[17px] transition-all duration-500 ease-in-out">
        Find something to add to you bag
      </p>
      <div className="mt-5 p-1.5 px-3.5 bg-[#E33232] rounded-[15px] text-[15px] text-white font-semibold" onClick={()=>navigateToMenu()}>
        Continue Ordering
      </div>
    </div>
  );
};

export default EmtpyCart;
