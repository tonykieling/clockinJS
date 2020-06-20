import React, { useState} from 'react';
import { Modal, ButtonGroup, Button } from "react-bootstrap";
import { show } from "./aux/formatDate";
import "../Pdf.css";

export default function InvoicePdfModal(props) {
  console.log("invoicePDFmodal porps:", props)
  const currentDate = new Date();
  return (
    <div>
      <Modal
        show    = { props.openModal }
        onHide  = { props.closeInvoicePdfModal }
      >
        <Modal.Header className="title">
          <h1>Invoice</h1>
          {/* <p>Date: {show(currentDate)}</p>
          <p>Invoice Number: {props.invoice.code}</p> */}
        </Modal.Header>

        <Modal.Body>
          This is body.
          Client is: { props.client.name}
        </Modal.Body>

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
