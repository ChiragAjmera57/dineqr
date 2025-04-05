import dynamic from 'next/dynamic'
const RightArrow = dynamic(()=>import('@/component/icons/rightArrow'))
const CartToast = ({itemCount}) => {
  return (
    <div className="sticky bottom-0 p-3 text-center space-y-1 bg-[#E33232]">
        <div className="flex flex-row text-center items-center justify-center space-x-2 content-center">
        <p className="text-center text-[#FFFFFF] font-semibold ">{itemCount} item added!</p>
        <div>{<RightArrow className="text-white" color="white" />}</div>
        </div>
        <p className="text-center text-[#FFFFFF] font-semibold ">{itemCount} item added to you cart!</p>
      </div>
  )
}

export default CartToast