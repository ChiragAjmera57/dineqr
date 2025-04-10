import fetchOrderApi from "@/services/fetchOrder";

const { createContext, useContext, useState, useEffect, useMemo, useCallback } = require("react");

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null)
  const [tableId, setTableId] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tableId') : null;
    return saved ? JSON.parse(saved) : null;
  });

  const fetchOrder = useCallback(async()=>{
      try {
          if(!tableId){
              throw Error("Table not found")
          }
          const response = await fetchOrderApi(tableId)
          if(response.success){
            console.log("RESPONSE FOR ORDER API AND SOTRING IN ORDER DATA",response)
              setOrderData(response?.data?.orders)
          }
      } catch (error) {
        setError(error)
          throw error
      }
    
  },[tableId])
  const value = useMemo(() => ({
    orderData,
    setOrderData,
    fetchOrder,
    error,
    setError
  }), [fetchOrder, orderData, error]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
  
  export const useOrderContext = () => useContext(OrderContext);