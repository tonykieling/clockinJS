import React from 'react';
import { Modal, ButtonGroup, Button } from "react-bootstrap";

const btnStyle = {
  width : "50%",
  paddingLeft: "0px",
  paddingRight: "0px"
};


export default function InvoicePdfModal(props) {
  return (
    <div>
      <Modal
        show    = { props.openModal }
        onHide  = { props.closeInvoicePdfModal }
      >
        <Modal.Header>
          I am: { props.user.name}
        </Modal.Header>

        <Modal.Body>
          Client is: { props.client.name}
        </Modal.Body>

        <Modal.Footer>
        </Modal.Footer>

        <ButtonGroup>
          <Button
            variant   = { "success"}
            onClick   = { () => console.log("PDF is coming soon")}
            disabled  = { true }
            style     = { btnStyle }
          >
            Generate a PDF file
          </Button>
          <Button
            variant = { "danger"}
            onClick = { props.closeModal}
            style   = { btnStyle }
          >
            Close
          </Button>
        </ButtonGroup>

      </Modal>      
    </div>
  )
}
