import axios from "axios";
    
const getClockins = async (userToken, typeOfOperation, ...moreArgs) => {

    let url = "";
    switch (typeOfOperation) {
      case "byDate":
        url = `/clockin/clockins/?userToken=${userToken}&date=${moreArgs[0]}&type=${typeOfOperation}`;
        break;
      case "toCompany":
        url = `/clockin/clockins/?userToken=${userToken}&dateStart=${moreArgs[0]}&dateEnd=${moreArgs[1]}&companyId=${moreArgs[2]}&queryLastInvoiceCode=${moreArgs[3]}&type=${typeOfOperation}`;
        break;
      case "normal":
        url = `/clockin?dateStart=${moreArgs[0]}&dateEnd=${moreArgs[1]}&clientId=${moreArgs[2]}&queryLastInvoiceCode=${moreArgs[3]}`;
        break;
      default:
    }

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

      if (clockins.data.error)
        throw(clockins.data.error);

      // if asking lastCode, which is set as moreArgs[3], it returns all message.
      return(moreArgs[3] ? clockins : clockins.data.allClockins);
    } catch(err){
      // console.log("Error: ", err.message || err);
      return({error: err.message || err});
    }
  }

export { getClockins };