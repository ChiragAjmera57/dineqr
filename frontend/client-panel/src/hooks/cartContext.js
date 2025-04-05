const { createContext, useContext, useState } = require("react");

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartData, setCartData] = useState({});
    
  
    const value = {
      cartData,
      setCartData,
    };
  
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
  };
  
  export const useCartContext = () => useContext(CartContext);