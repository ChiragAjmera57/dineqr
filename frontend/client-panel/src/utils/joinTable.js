export const joinTable = async (option) => {
    try {
      if (!tableId) {
        throw new Error("Table id not in storage!");
      }
      const res =
        (await option) == "existing"
          ? await joinExisting(tableId)
          :await joinNewTable(tableId);
            if (res?.data?.redirectUrl) {
            if(option=="existing"){
              reset()
            }
            console.log(res?.data?.redirectUrl);
            router.replace(res?.data?.redirectUrl);
            router.refresh(); // This will refresh the data without a full page reload
            }
        // router.push(res?.data?.redirectUrl);
      
    } catch (error) {
      console.error(error)
    }
  };