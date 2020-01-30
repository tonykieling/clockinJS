import React from "react";
import { Modal, ButtonGroup, Button } from "react-bootstrap";

/**
 * it is going to receive as props:
 *  - openModal: to control if the Modal should be displayed
 *  - message: to be displayed in the box
 *  - yesMethod: to be used if hitting Yes button
 *  - noMethod: to be used if hitting No button
 */
export default function ConfirmModal(props) {
  return (
    <div>
      <Modal
        show    = { props.openModal }
        onHide  = { props.noMethod }
      >
        <Modal.Header closeButton>
          <Modal.Title>Clockin.js</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Footer>
          <ButtonGroup 
            className = "mt-3"
            style     = {{ width: "50%" }} >
            <Button 
              variant   = "primary" 
              onClick   = { props.yesMethod } 
              style     = {{width: "50%"}} >
              Yes
            </Button>
            <Button 
              variant   = "danger" 
              onClick   = { props.noMethod } 
              style     = {{ width: "50%"}} >
              No
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>      
    </div>
  )
}
