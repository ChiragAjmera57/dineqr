import dynamic from 'next/dynamic'
import React from 'react'
const CounterComponent = dynamic(()=>import('@/component/Counter'))
const MenuItemComponent = dynamic(()=>import('@/component/MenuItem'))

const MenuItemWithCounter = () => {
  return (
    <div className=" p-2.5 flex justify-between items-center mb-0.5 bg-[#f0f0f0]">
        <MenuItemComponent />
          <CounterComponent />
      </div>
  )
}

export default MenuItemWithCounter