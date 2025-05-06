const fetchMenuList = async (tableId) => {
  console.log("=============fetch menu called=============")
  console.log("===========================================")
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!backendUrl) {
        throw new Error("Backend URL environment variable is not defined");
      }
      
      if (!tableId) {
        throw new Error("Table ID is required");
      }
      const user_id = JSON.parse(localStorage.getItem("userId"))
      const response = await fetch(`${backendUrl}/ctmr/menu`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ tableId,user_id }),
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
      const newUserId = jsonResponse?.data?.user_id
        console.log("user id from response",jsonResponse?.data?.user_id)
        if(newUserId){
          localStorage.setItem("userId",newUserId)
        }
      return jsonResponse;
    } catch (err) {
        throw { 
          status: err.status || 500, 
          statusText: err.statusText || 'Unknown Error', 
          error: err.error || 'No error details available' 
        };
      }
  };
  

export default fetchMenuList