
const Counter = ({ alreadyInCart, quantity, itemId, incrementItemCount, decrementItemCount }) => {
  const incrementItem = () => {
    incrementItemCount(itemId, quantity + 1);
  };

  const decrementItem = () => {
    decrementItemCount(itemId, quantity - 1 > 0 ? quantity - 1 : 0);
  };

  if (alreadyInCart && quantity > 0) {
    return (
      <div className="border-2 border-[#26A034] rounded-md flex w-25 justify-between items-center">
        <div
          className="w-7 text-center text-[#26A034] font-bold cursor-pointer "
          onClick={decrementItem} 
        >
          -
        </div>
        <div className="w-7 text-center bg-[#26A034]  text-white ">{quantity}</div>
        <div
          className="w-7 text-center text-[#26A034] font-bold cursor-pointer "
          onClick={incrementItem} 
        >
          +
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="border-2 border-[#26A034] rounded-md flex w-25 justify-center items-center cursor-pointer"
        onClick={incrementItem} 
      >
        <div className="w-7 text-center text-[#26A034] font-medium ">Add</div>
      </div>
    );
  }
};

export default Counter;