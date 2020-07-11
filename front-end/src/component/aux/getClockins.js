import axios from "axios";
    
const getClockins = async (userToken, typeOfOperation, ...moreArgs) => {

    // console.log("!!!!!!!!!!inside getClockins!!!!!!!!!!!");
    // console.log("PROOPS: userToken =>", userToken, "typeOfOperation=>", typeOfOperation, "moreArgs=>", moreArgs);

    let url = "";
    switch (typeOfOperation) {
      case "byDate":
        // url = `/clockin/clockins/?userToken=${userToken}&date=${moreArgs[0]}&type=byDate`;
        // console.log("moreArgs:::", moreArgs)
        url = `/clockin/clockins/?userToken=${userToken}&date=${moreArgs[0]}&type=${typeOfOperation}`;
        break;
      case "toCompany":
        url = `/clockin/clockins/?userToken=${userToken}&dateStart=${moreArgs[0]}&dateEnd=${moreArgs[1]}&companyId=${moreArgs[2]}&type=${typeOfOperation}`;
        break;
      case "normal":
        // url = `/clockin/clockins/?userToken=${userToken}&date=${moreArgs[0]}&type=${typeOfOperation}`;
        url = `/clockin?dateStart=${moreArgs[0]}&dateEnd=${moreArgs[1]}&clientId=${moreArgs[2]}`;
        break;
      default:
    }


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
// console.log("clockINS", clockins)
      
      if (clockins.data.error)
        throw(clockins.data.error);

console.log("clockins", clockins)
      return(clockins.data.allClockins);
    } catch(err){
      console.log("Error: ", err.message || err);
      return({error: err.message || err});
    }
  }

export { getClockins };