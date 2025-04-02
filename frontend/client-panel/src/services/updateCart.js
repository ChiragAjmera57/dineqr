const updateCartApi = async (tableId,menu_item_id,quantity) => {
  console.log("=====called updateCart api======")
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!backendUrl) {
        throw new Error("Backend URL environment variable is not defined");
      }
      
      if (!tableId) {
        throw new Error("Table ID is required");
      }
      
      const response = await fetch(`${backendUrl}/ctmr/cart/update-to-cart`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ tableId,menu_item_id,quantity }),
        headers: {
          'Content-Type': 'application/json',
        },
        cache: "no-store",
      });
      
      
      const jsonResponse = await response.json();
      console.log("JSON Response:", jsonResponse);
      
      if (!response.ok || !jsonResponse?.success) {
        throw { status: response.status, statusText: response.statusText, error: jsonResponse };
      }
      return jsonResponse;
    } catch (err) {
      console.log(err)
        throw { 
          status: err.status || 500, 
          statusText: err.statusText || 'Unknown Error', 
          error: err.error || 'No error details available' 
        };
      }
  };
  

export default updateCartApi