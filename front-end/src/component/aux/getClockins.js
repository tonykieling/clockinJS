import axios from "axios";
    
// const getClockins = async (userToken, invoiceId) => {
const getClockins = async (userToken, typeOfOperation, ...moreArgs) => {

    console.log("!!!!!!!!!!inside getClockins!!!!!!!!!!!");
    // console.log("PROOPS:::", userToken, invoiceId);
    console.log("PROOPS: userToken =>", userToken, "typeOfOperation=>", typeOfOperation, "moreArgs=>", moreArgs);

    let url = "";
    switch (typeOfOperation) {
      case "byDate":
        url = `/clockin/clockins/?userToken=${userToken}&date=${moreArgs[0]}&type=byDate&clientId=${moreArgs[1]}`;
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

console.log("clockins retrieved::", clockins)

      return(clockins.data.allClockins);
    } catch(err){
      console.log("Error: ", err.message || err);
    }
  }

export { getClockins };