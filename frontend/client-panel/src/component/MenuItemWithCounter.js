import dynamic from 'next/dynamic'
const CounterComponent = dynamic(()=>import('@/component/Counter'))
const MenuItemComponent = dynamic(()=>import('@/component/MenuItem'))

const MenuItemWithCounter = ({alreadyInCart, quantity, menuItem, incrementItemCount, decrementItemCount}) => {
  return (
    <div className=" p-2.5 flex justify-between items-center mb-0.5 bg-[#f0f0f0]">
        <MenuItemComponent />
          <CounterComponent alreadyInCart={alreadyInCart} quantity={quantity} item={menuItem} decrementItemCount={decrementItemCount} incrementItemCount={incrementItemCount} />
      </div>
  )
}
export default MenuItemWithCounter
