import React, { useEffect, useState } from "react";

const OrderSuccess = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 500);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-all duration-500 ease-in-out ${
        show ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={150}
        height={150}
        viewBox="0 0 24 24"
        id="checkmark"
        fill="#26A034"
        className="transition-all duration-500 ease-in-out"
      >
        <g>
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.3 7.61-4.57 6a1 1 0 0 1-.79.39 1 1 0 0 1-.79-.38l-2.44-3.11a1 1 0 0 1 1.58-1.23l1.63 2.08 3.78-5a1 1 0 1 1 1.6 1.22z"></path>
        </g>
      </svg>
      <p className="text-center font-bold text-[20px] transition-all duration-500 ease-in-out">
        Yap! Order Received
      </p>
      <p className="text-center font-light leading-5 tracking-[0.2px] p-2 text-[15px] transition-all duration-500 ease-in-out">
        We will accept your order within 15 minutes. Please enjoy the vibe till then.
      </p>
    </div>
  );
};

export default OrderSuccess;
