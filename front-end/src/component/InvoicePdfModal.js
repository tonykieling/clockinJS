import React from 'react';
import { Modal, ButtonGroup, Button } from "react-bootstrap";


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
          This is body.
          Client is: { props.client.name}
        </Modal.Body>

        <Modal.Footer>
          Footer
        </Modal.Footer>

        <ButtonGroup>
          <Button
            variant = { "success"}
            onClick = { () => console.log("PDF is coming soon")}
            >
            Generate a PDF file
          </Button>
          <Button
            variant = { "danger"}
            onClick = { props.closeModal}
            >
            Close
          </Button>
        </ButtonGroup>

      </Modal>      
    </div>
  )
}
