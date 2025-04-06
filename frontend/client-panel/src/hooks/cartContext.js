const { createContext, useContext, useState, useEffect, useMemo } = require("react");

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState(() => {
    // Optional: Load initial state from localStorage if needed
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cartData') : null;
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    // Optional: Save to localStorage on changes
    localStorage.setItem('cartData', JSON.stringify(cartData));
    console.log("CART DATA AT CONTEXT",cartData)
  }, [cartData]);

  const value = useMemo(() => ({
    cartData,
    setCartData,
  }), [cartData]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
  
  export const useCartContext = () => useContext(CartContext);