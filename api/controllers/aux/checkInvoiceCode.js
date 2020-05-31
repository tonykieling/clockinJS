const Invoice   = require("../../models/invoice.js");
const Clockin   = require("../../models/clockin.js");

/**
 * this auxiliary method checks the last invoice code used and
 * if there is a number at its end, add 1, otherwise return the last code
 * or, if not invoice code has found at all for that particular array of clockins, it returns null
 */
module.exports = async (userId, clientId) => {
  // it reverses the array to find from the end to begin
  const allClockins = await Clockin.find({
    user_id   : userId,
    client_id : clientId,
  })

  console.log("allClockins", allClockins)
  const reverseAllClockins = allClockins.slice().reverse();

  // it checks whether there is a invoice in the clockin's array and gets the most recent one
  const invoiceChecked         = reverseAllClockins.find(clockin => clockin.invoice_id);

  // if no invoice code found, returns null
  if (!invoiceChecked) return null;

  const theMostRecentInvoiceId = invoiceChecked.invoice_id;


  // it goes to invoice collection and gets the most recent invoice
  const theMostRecentInvoice = theMostRecentInvoiceId 
    && await Invoice.findById(theMostRecentInvoiceId);

  // it checks whether the code ends in a number, if so, it adds 1 to it
  const codeArray = theMostRecentInvoice.code.split("");
  console.log("code", codeArray)
  let numberPart  = [];
  let stringPart  = "";
  for (let x = codeArray.length - 1; x >= 0; x--) {
    if (isNaN(codeArray[x])) {

      // if there is no number, it returns the invoice code
      if (x === codeArray.length - 1) return codeArray.join("");

      stringPart = codeArray.slice(0, (codeArray.length - numberPart.length)).join("");
      break;
    }
    
    numberPart = [codeArray[x], ...numberPart];
  }

  const originalNumberPosition = numberPart.length;  
  const number = Number(numberPart.join("")) + 1;
  let numberArray = number.toString().split("");

  if (numberArray.length < originalNumberPosition) {
    while(numberArray.length !== originalNumberPosition) {
      numberArray = [0, ...numberArray];
    }
  }

  // here, it returns an object meaning it has a number added
  const newCode = {
    newCode: `${stringPart}${numberArray.join("")}`
  };

  return(newCode);

}
