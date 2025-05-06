import React from 'react'
import BadgeRender from './BadgeRender'
import Cross from './icons/cross';
import UpArrow from './icons/upArrow';


export const OrderCard = ({ order, isExpanded, toggleExpand }) => {
  return (
    <div className='p-2 px-3 m-1 border-gray-100 border shadow rounded-[10px]' onClick={!isExpanded ? toggleExpand : undefined}>

<div className="flex justify-between">
    <div className="flex flex-col ">
      <p className="font-semibold text-[#3c3b3bb7] text-[16px]">
      {`Order#: ${order?.id}`}
      </p>
      <p className="font-light text-[#181818cd] text-[15px]">
        {/* 20 Dec-2021, 3:30 PM */}
        {order?.createdAt}
      </p>
      <div className='mt-2'>
      <BadgeRender type={order?.status} />
      </div>
      </div>
      
    <div className="flex flex-col ">
      <p className="border-2 m-auto px-2 font-bold rounded bg-gray-50 border-gray-200 text-gray-400">
        {order?.orderItems?.length}
      </p>
      <p className=" text-[14px]">{`₹${order?.amount}`}</p>
    </div>
    
  </div>
  {isExpanded && (
        <div className="mt-4.5">
          <div className='flex justify-between mx-1.5 mb-3.5 items-center'>
            <p className='font-semibold text-[#3c3b3bb7] text-[16px]'>Order items</p>
            <div>
          {isExpanded && (
          <button
            className="text-red-500 font-medium"
            onClick={(e) => {
              e.stopPropagation(); 
              toggleExpand(); 
            }}
          >
            <UpArrow color='black' width={27} height={27}  />
          </button>
        )}
          </div>
          </div>
          {
            order?.orderItems.map((orderItem)=>
              (<div
              key={orderItem.id}
              className='border-2 border-gray-200 flex justify-between p-2 m-0.5 rounded-[9px] items-center shadow mb-2'>
              <div className='flex space-x-3 items-center flex-row justify-center'>
              <div className='font-semibold'>{orderItem?.quantity}</div>
              <div>
                <Cross color='blue' width={20} height={20} />
              </div>
              <div className='font-semibold'>{orderItem?.menu?.name}</div>
              </div>
              <div className='font-bold text-yellow-500 '>{`₹ ${orderItem?.price}`}</div>
            </div>)
            )
          }
            
         
          
        </div>
      )}
    </div>
   
  )
}
