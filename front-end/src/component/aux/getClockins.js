import axios from "axios";
    
// const getClockins = async (userToken, invoiceId) => {
const getClockins = async (userToken, typeOfOperation, ...moreArgs) => {

    console.log("!!!!!!!!!!inside getClockins!!!!!!!!!!!");
    // console.log("PROOPS:::", userToken, invoiceId);
    console.log("PROOPS:::", userToken, typeOfOperation, moreArgs);

    let url = "";
    switch (typeOfOperation) {
      case "byDate":
        url = `/clockin/?userToken=${userToken}&invoiceId=${"invoiceId"}`;
        break;
      default:
    }
// if (1) return;

    // const url = `/clockin/get_by_invoiceId/?userToken=${userToken}&invoiceId=${invoiceId}`;
  
    try {
      const clockins = await axios.get( 
        url,
        {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${userToken}`
          }
        }
      );

      if (clockins.data.counter < 1 || clockins.data.error)
       throw (clockins.data.error || "general error");
  console.log("clockins retrieved::", clockins)
      return(clockins.data.allClockins);
    } catch(err){
      console.log("Error: ", err.message || err);
    }
  }

export { getClockins };