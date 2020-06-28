import axios from "axios";
    
const getClockins = async props => {
    console.log("inside getClockins!!!!!!!!!!!");
    console.log("PORPS:::", props);
    if (1) return;
    // const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;
  
    // try {
    //   const clockins = await axios.get( 
    //     url,
    //     {  
    //       headers: { 
    //         "Content-Type": "application/json",
    //         "Authorization" : `Bearer ${userToken}`
    //       }
    //     }
    //   );
  
    //   return(clockins.data.allClockins);
    // } catch(err){
    //   console.log("Error: ", err.message);
    // }
  }

export { getClockins };