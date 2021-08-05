import axios from "axios";
    
const getClockins = async (userToken, typeOfOperation, ...moreArgs) => {
  /* ****************************************************
  need to consider it when doing GET's methods


  also consider recheck the GetClients button, why is it shwowing only one client?????
  */
    let url = "";
    switch (typeOfOperation) {
      case "byDate":
        // original is 
        // url = `/clockin/clockins/?userToken=${userToken}&date=${moreArgs[0]}&type=${typeOfOperation}`;
        // which means it uses .get_general
        url = `/api/clockin/?userToken=${userToken}&date=${moreArgs[0]}&type=${typeOfOperation}`;
        break;
      case "toCompany":
        // url = `/clockin/clockins/?userToken=${userToken}&dateStart=${moreArgs[0]}&dateEnd=${moreArgs[1]}&companyId=${moreArgs[2]}&queryLastInvoiceCode=${moreArgs[3]}&type=${typeOfOperation}`;
        // get_general
        url = `/api/clockin/?userToken=${userToken}&dateStart=${moreArgs[0]}&dateEnd=${moreArgs[1]}&companyId=${moreArgs[2]}&queryLastInvoiceCode=${moreArgs[3]}&type=${typeOfOperation}`;
        break;
      case "invoiceClockins":
        // url = `/clockin/clockins?userToken=${userToken}&invoiceId=${moreArgs[0]}&type=${typeOfOperation}`;
        // get_all
        url = `/api/clockin/?userToken=${userToken}&invoiceId=${moreArgs[0]}&type=${typeOfOperation}`;
        break
      case "normal":
        // url = `/clockin?dateStart=${moreArgs[0]}&dateEnd=${moreArgs[1]}&clientId=${moreArgs[2]}&queryLastInvoiceCode=${moreArgs[3]}`;
        // get_all
        url = `/api/clockin/?dateStart=${moreArgs[0]}&dateEnd=${moreArgs[1]}&clientId=${moreArgs[2]}&queryLastInvoiceCode=${moreArgs[3]}&type=${typeOfOperation}`;
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

console.log("past clockinsss url::", url, "and:", clockins);


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

