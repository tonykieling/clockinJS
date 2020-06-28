import React, { useState, useEffect} from 'react';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { show } from "./aux/formatDate";
// import ReactModal from "react-modal";
import "../Pdf.css";
// import "./aux/generatePdf.js";

import { getClockins } from "./aux/getClockins.js";



// const cs = {
//   content : {
//     width: "95%",
//     height: "85%",
//     // left: "0",
//     // top: "0"
//     top                   : '50%',
//     left                  : '50%',
//     right                 : 'auto',
//     bottom                : 'auto',
//     marginRight           : '-50%',
//     transform             : 'translate(-50%, -50%)',
//     overflow              : 'scroll'  
//   }
// };

export default function InvoicePdfModal(props) {
  console.log("invoicePDFmodal porps:", props)
  const currentDate = new Date();
  const [clockins, setclockins] = useState("");

  useEffect(() => {
    console.log("load clockins!!!!!!!!!!!!")
    getClockins()
    setclockins("asd");
  }, []);

  return (
    <div className="main-screen">
{console.log("clockins::::", clockins)}
      <Modal
        // isOpen  = { props.openModal }
        onHide  = {props.closeModal}
        show    = { props.openModal }
        size    = "xl"
        // keyboard
        centered
        // onHide  = { props.closeInvoicePdfModal }
        // style   = {cs}
        // className = "modal-format"
        // dialogClassName = "modal-format"
      >

        <h1 className="title">Invoice</h1>
        <div className="info">
          <p>Date: {show(currentDate)}</p>
          <p>Invoice Number: {props.invoice.code}</p>
        </div>
        
        <div className="pdf-card">
          <Card className="pdf-card-people" style={{float: "left"}}>
            <h3>Bill to</h3>
            <div className="pdf-card-people-item">
              <p>{ props.client.name}</p>
              { props.client.address && <p> { props.client.address}</p>}
              { props.client.phone && <p> { props.client.phone}</p>}
              { props.client.email && <p> { props.client.email}</p>}
              <p>Address</p>
              <p>Phone</p>
            </div>
          </Card>
          <Card className="pdf-card-people" style={{float: "right"}}>
            <h3>SHIP to</h3>
            <div className="pdf-card-people-item">
              <p>{ props.user.name}</p>
              { props.user.address && <p> { props.user.address}</p>}
              { props.user.phone && <p> { props.user.phone}</p>}
              { props.user.email && <p> { props.user.email}</p>}
              <p>Address</p>
              <p>Phone</p>
            </div>
          </Card>
        </div>

        <Table className="pdf-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qtd</th>
              <th>Unit price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>

          </tbody>
        </Table>

        <Card.Footer>
          Footer
        </Card.Footer>

        <ButtonGroup>
          <Button
            variant = { "primary"}
            style   = { {width: "33%"}}
            onClick = { () => console.log("PDF is coming soon")}
            >
            Generate a PDF file
          </Button>
          <Button
            variant = { "warning"}
            style   = { {width: "33%"}}
            onClick = { () => console.log("EDIT PDF is coming soon")}
            >
            Edit
          </Button>
          <Button
            variant = { "danger"}
            style   = { {width: "33%"}}
            onClick = { props.closeModal}
            >
            Close
          </Button>
        </ButtonGroup>

      </Modal>      
    </div>
  )
}
