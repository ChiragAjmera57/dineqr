import dynamic from 'next/dynamic'
import React from 'react'
const CounterComponent = dynamic(()=>import('@/component/Counter'))
const MenuItemComponent = dynamic(()=>import('@/component/MenuItem'))

const MenuItemWithCounter = () => {
  return (
    <div className=" p-2.5 flex justify-between items-center">
        <MenuItemComponent />
          <CounterComponent />
      </div>
  )
}

export default MenuItemWithCounter