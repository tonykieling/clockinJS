import axios from "axios";
import jsPDF from 'jspdf';
import { show } from "./formatDate.js";

const getClockins = async (userToken, clientId, dateStart, dateEnd) => {
  const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;

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

    return(clockins.data.allClockins);
  } catch(err){
    console.log("Error: ", err.message);
  }
}


const generatePdf = async(props) => {
  const clockins = await getClockins(props.user.token, 
                               props.client._id, 
                               props.invoice.date_start.substring(0, 10), 
                               props.invoice.date_end.substring(0, 10));

  const pageNumbers     = Math.ceil(clockins.length / 14);
  let currentPageNumber = 1;
  
  const data = {
    invoiceDate         : props.invoice.date,
    invoiceNumber       : props.invoice.code,
    serviceProviderName : props.user.name,
    mailingAddres       : props.user.address,
    city                : props.user.city,
    postalCode          : `${props.user.postalCode.substring(0,3)}–${props.user.postalCode.substring(3,6)}`,
    phoneNumber1        : props.user.phone.substring(1,4),
    phoneNumber2        : props.user.phone.substring(6,9),
    phoneNumber3        : props.user.phone.substring(10,14),
    client              : props.client.name,
    typeOfService       : "Behaviour Intervention",
    totalCad            : props.invoice.total_cad,
    invoiceSample       : props.client.invoice_sample
  };
  
  let doc = new jsPDF();

  do {
    if (currentPageNumber > 1) doc.addPage();
    doc.addImage(data.invoiceSample, "JPEG", 0, 0, 210, 297);

    doc.setTextColor(92, 76, 76);
    doc.setFontSize(12);
    
    doc.text(show(data.invoiceDate), 131, 30);
    doc.text(data.invoiceNumber, 168, 30);
    doc.text(data.serviceProviderName, 77, 41);
    doc.text(data.mailingAddres, 65, 51.5);
    doc.text(data.city, 42, 61.5);
    doc.text(data.postalCode, 154, 61.5);
    doc.text(data.phoneNumber1, 63, 71.5);
    doc.text(data.phoneNumber2, 80, 71.5);
    doc.text(data.phoneNumber3, 91.5, 71.5);
    doc.text(data.client, 72, 164);
    
    doc.setFontSize(11);
    doc.text(data.typeOfService, 30, 190);
    

    if (pageNumbers < 2) {
      // it prints dates
      clockins.forEach((e, i) => doc.text(show(e.date), 78, ((i * 4.25) + 190)));
      // it prints # of hours
      clockins.forEach((e, i) => doc.text(`${(e.worked_hours / 3600000).toFixed(2)}`, 120, ((i * 4.25) + 190), {align: "right"}));
      // it prints Rate per Hour
      clockins.forEach((e, i) => doc.text(`${(e.rate).toFixed(2)}`, 150, ((i * 4.25) + 190), {align: "right"}));
      // it prints Total Amount
      clockins.forEach((e, i) => doc.text(`${((e.worked_hours / 3600000) * e.rate).toFixed(2)}`, 189.5, ((i * 4.25) + 190), {align: "right"}));
    } else { // it sets for printing the clockins in more than one page
      const clockinsTemp = clockins.slice(((currentPageNumber - 1) * 14), (currentPageNumber * 14));
      // it prints dates
      clockinsTemp.forEach((e, i) => doc.text(show(e.date), 78, ((i * 4.25) + 190)));
      // it prints # of hours
      clockinsTemp.forEach((e, i) => doc.text(`${(e.worked_hours / 3600000).toFixed(2)}`, 120, ((i * 4.25) + 190), {align: "right"}));
      // it prints Rate per Hour
      clockinsTemp.forEach((e, i) => doc.text(`${(e.rate).toFixed(2)}`, 150, ((i * 4.25) + 190), {align: "right"}));
      // it prints Total Amount
      clockinsTemp.forEach((e, i) => doc.text(`${((e.worked_hours / 3600000) * e.rate).toFixed(2)}`, 189.5, ((i * 4.25) + 190), {align: "right"}));
    }

    const array = clockins.map(e => Number(((e.worked_hours)/3600000).toFixed(2)));
    const totalHoursWorked = array.reduce((accumulator, currentValue) => accumulator + currentValue);
    const totalCadToReceive = (clockins[0].rate * totalHoursWorked).toFixed(2);

    let pageLabel = "",
        totalLabel = "";
    if (pageNumbers > 1) { 
      doc.setFontSize(9);
      switch (pageNumbers) {
        case 2:
          pageLabel   = `Page ${currentPageNumber} of 2`;
          doc.setFontType("italic");
          totalLabel  = "see 2nd page";
          break;
        case 3:
          pageLabel   = `Page ${currentPageNumber} of 3`;
          doc.setFontType("italic");
          totalLabel = "see 3rd page";
          break;
        default:
          pageLabel   = `Page ${currentPageNumber} of ${pageNumbers}`;
          doc.setFontType("italic");
          totalLabel = `see ${pageNumbers}th page`;
          break;
      }
    }

    const flagPosition = (pageNumbers > 1 && currentPageNumber < pageNumbers) ? true : false;
    !flagPosition && doc.setFontSize(12);
    doc.text( (flagPosition ? totalLabel : totalCadToReceive), (flagPosition ? 191 : 189.5), 250.4, {align: "right"});
    doc.text("---", 179, 255.5);
    doc.text((flagPosition ? totalLabel : totalCadToReceive), (flagPosition ? 191 : 189.5), 261, {align: "right"});
    
    
    doc.setFontSize(12);
    doc.setFontType("normal");
    doc.text(pageLabel, 191, 289, {align: "right"});

    currentPageNumber++;
  } while(currentPageNumber <= pageNumbers)
  doc.save(`${data.invoiceNumber}.pdf`);
  
  
  // const string = doc.output('datauristring');
  // const embed = "<embed width='100%' height='100%' src='" + string + "'/>"
  // // var embed = `<embed width="100%" height="100%" src=${string}/>`
  // let x = window.open();
  // x.document.open();
  // x.document.write(embed);
  // x.document.close();

}

export { generatePdf };