import dynamic from 'next/dynamic'
const CounterComponent = dynamic(()=>import('@/component/Counter'))
const MenuItemComponent = dynamic(()=>import('@/component/MenuItem'))

const MenuItemWithCounter = ({alreadyInCart, quantity, menuItem, incrementItemCount, decrementItemCount}) => {
  return (
    <div className="p-2.5 flex justify-between mb-0.5 bg-[#f0f0f0] h-full">
        <MenuItemComponent />
        <div className='flex flex-col items-center'>
          <div className='flex justify-center'>
            <CounterComponent alreadyInCart={alreadyInCart} quantity={quantity} item={menuItem} decrementItemCount={decrementItemCount} incrementItemCount={incrementItemCount} />
          </div>
          <div className='mt-auto font-normal text-[14px] text-[#525050e4] self-center'>
            {`₹ ${quantity * menuItem?.price}`}
          </div>
        </div>
    </div>
  )
}
export default MenuItemWithCounter
