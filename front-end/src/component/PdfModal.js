import React, { useEffect } from 'react'
// import axios from "axios";
// import { connect } from "react-redux";
// import { Card, Button, ButtonGroup, Form, Table, Col, Row } from "react-bootstrap";
// import InvoiceChangeStatusModal from "./InvoiceChangeStatusModal.js";
// import ReactModal from "react-modal";
import { show } from "./aux/formatDate.js";
// import InvoiceModalDelete from "./InvoiceModalDelete.js";
// import { renderClockinDataTable } from "./aux/renderClockinDataTable.js";
// import PunchInModal from "./PunchInModal.js";
// import InvoiceEditModal from "./InvoiceEditModal.js";


import jsPDF from 'jspdf';
import { invoiceSample } from "./aux/invoiceTemplate.js";


export default function PdfModal(props) {
  
  const data = {
    invoiceDate         : props.invoice.date,
    invoiceNumber       : props.invoice.code,
    serviceProviderName : props.user.name,
    mailingAddres       : props.user.address,
    city                : props.user.city,
    postalCode          : props.user.postalCode,
    phoneNumber1        : props.user.phone.substring(1,4),
    phoneNumber2        : props.user.phone.substring(6,9),
    phoneNumber3        : props.user.phone.substring(10,14),
    client              : props.name,
    typeOfService       : "Behaviour Intervention",
    clockins            : {},
    totalCad            : props.invoice.total_cad
  };
  
  console.log("DATA:", data);
  console.log("PROPS:", props);

  useEffect(() => {
    console.log("useEffect")
    props.closeModal();
  });

  let doc = new jsPDF();

  doc.addImage(invoiceSample, "JPEG", 0, 0, 210, 297);
  doc.text(100, 100, "100, 100")
  doc.text('50 X 50', 50, 50)
  doc.text('150 X 150', 150, 150)

  doc.setTextColor(92, 76, 76);
  doc.setFontSize(12);
  // doc.text(27, 128, data.invoiceDate);
  doc.text(show(data.invoiceDate), 131, 30);
  doc.text(data.invoiceNumber, 170, 30);
  doc.text(data.serviceProviderName, 77, 41);

  doc.text(data.mailingAddres, 65, 51.5);
  doc.text(data.city, 42, 61.5);
  doc.text(data.postalCode, 154, 61.5);
  doc.text(data.phoneNumber1, 61, 71.5);

  // doc.save('a4.pdf');
  
  
  // const string = doc.output('datauristring');
  // const embed = "<embed width='100%' height='100%' src='" + string + "'/>"
  // // var embed = `<embed width="100%" height="100%" src=${string}/>`
  // let x = window.open();
  // x.document.open();
  // x.document.write(embed);
  // x.document.close();

  return (
    <div>
    </div>
  )
}
