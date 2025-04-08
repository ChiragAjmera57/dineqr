import fetchOrderApi from "@/services/fetchOrder";

const { createContext, useContext, useState, useEffect, useMemo, useCallback } = require("react");

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderData, setOrderData] = useState(null);
  const [tableId, setTableId] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tableId') : null;
    return saved ? JSON.parse(saved) : {};
  });

  const fetchOrder = useCallback(async()=>{
      try {
          if(!tableId){
              throw Error("No table id found")
          }
          const response = await fetchOrderApi(tableId)
          if(response.success){
            console.log("RESPONSE FOR ORDER API AND SOTRING IN ORDER DATA",response)
              setOrderData(response?.data?.orders)
          }
      } catch (error) {
          throw error
      }
    
  },[tableId])
  const value = useMemo(() => ({
    orderData,
    setOrderData,
    fetchOrder
  }), [fetchOrder, orderData]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
  
  export const useOrderContext = () => useContext(OrderContext);