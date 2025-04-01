const joinNewTable = async (tableId) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!backendUrl) {
        throw new Error("Backend URL environment variable is not defined");
      }
      
      if (!tableId) {
        throw new Error("Table ID is required");
      }
      
      const response = await fetch(`${backendUrl}/ctmr/joining/create-new-table`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ tableId }),
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
        throw { 
          status: err.status || 500, 
          statusText: err.statusText || 'Unknown Error', 
          error: err.error || 'No error details available' 
        };
      }
  };
  

export default joinNewTable