import axios from "axios";
import jsPDF from 'jspdf';
import { show } from "./formatDate.js";
import { invoiceSample } from "./invoiceTemplate.js";


const getClocinks = async (userToken, clientId, dateStart, dateEnd) => {
  const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;

  try {
    const clockins = await axios.get( 
      url,
      {  
        headers: { 
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${userToken}` }
    });

    return(clockins.data.allClockins);
  } catch(err){
    console.log("Error: ", err.message);
  }
}


const generatePdf = async(props) => {
  const clockins = await getClocinks(props.user.token, 
                               props.client._id, 
                               props.invoice.date_start.substring(0, 10), 
                               props.invoice.date_end.substring(0, 10));
  
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
    clockins,
    totalCad            : props.invoice.total_cad
  };
  
  let doc = new jsPDF();

  doc.addImage(invoiceSample, "JPEG", 0, 0, 210, 297);

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
  data.clockins.forEach((e, i) => doc.text(show(e.date), 78, ((i * 4.25) + 190)));
  data.clockins.forEach((e, i) => doc.text(`${(e.worked_hours / 3600000).toFixed(2)}`, 110, ((i * 4.25) + 190)));
  data.clockins.forEach((e, i) => doc.text(`${(e.rate).toFixed(2)}`, 135, ((i * 4.25) + 190)));
  data.clockins.forEach((e, i) => doc.text(`${((e.worked_hours / 3600000) * e.rate).toFixed(2)}`, 188, ((i * 4.25) + 190), {align: "right"}));

  const array = data.clockins.map(e => Number(((e.worked_hours)/3600000).toFixed(2)));
  const totalHoursWorked = array.reduce((accumulator, currentValue) => accumulator + currentValue);
  const totalCadToReceive = (data.clockins[0].rate * totalHoursWorked).toFixed(2);
  doc.text(totalCadToReceive, 188, 250.4, {align: "right"});
  doc.text("---", 179, 255.5);
  doc.text(totalCadToReceive, 188, 261, {align: "right"});

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