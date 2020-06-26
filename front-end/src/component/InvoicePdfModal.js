import React, { useState, useEffect} from 'react';
import { Modal, ButtonGroup, Button, Card, Table } from "react-bootstrap";
import { show } from "./aux/formatDate";
import "../Pdf.css";

export default function InvoicePdfModal(props) {
  console.log("invoicePDFmodal porps:", props)
  const currentDate = new Date();
  const [clockins, setclockins] = useState("");

  useEffect(() => {
    console.log("load closkins!!!!!!!!!!!!")
    setclockins("asd");
  }, []);

  return (
    <div className="main-screen">
{console.log("clockins::::", clockins)}
      <Modal
        show    = { props.openModal }
        onHide  = { props.closeInvoicePdfModal }
        // className = "modali-content"
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

        <Modal.Footer>
          Footer
        </Modal.Footer>

        <ButtonGroup>
          <Button
            variant = { "primary"}
            style   = { {width: "50%"}}
            onClick = { () => console.log("PDF is coming soon")}
            >
            Generate a PDF file
          </Button>
          <Button
            variant = { "danger"}
            style   = { {width: "50%"}}
            onClick = { props.closeModal}
            >
            Close
          </Button>
        </ButtonGroup>

      </Modal>      
    </div>
  )
}
