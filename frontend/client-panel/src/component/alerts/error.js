import React from 'react';
import dynamic from 'next/dynamic';
const ErrorSvgComponent = dynamic(() => import('@/component/icons/error'));

const ErrorAlert = ({
  message = "Something went wrong",
  msgDetail = "Please try again after sometime.",
  buttons = [], 
}) => {
  return (
    <div className="flex flex-col p-3.5 items-center border-1 border-[#eaeaea] m-1.5 rounded-2xl mt-0 shadow-md w-full">
      <div>
        <ErrorSvgComponent width={55} height={55} />
      </div>
      <div className="text-center font-semibold mt-2.5 mb-0.5 text-[17px]">{`${message}!`}</div>
      <div className="text-center font-[300] text-[15px] text-[#000000da]">{msgDetail}</div>
      <div className="flex space-x-2 mt-4">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`flex items-center justify-center p-2 rounded-md text-white text-[13px] w-fit h-10 ${
              button.color || 'bg-[#28aa63]'
            }`}
          >
            <p>{button.label}</p>
            {button.icon && (
              <span className="ml-1">
                {React.cloneElement(button.icon, { width: 24, height: 24 })}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ErrorAlert;