import React from "react";
import { Modal, ButtonGroup, Button } from "react-bootstrap";

/**
 * this componenet is amied to be a generic componenet to be used in different situation where the user has two options
 * 
 * it is going to receive as props:
 *  - openModal: to control if the Modal should be displayed
 *  - message: to be displayed in the box
 *  - yesMethod: to be used if hitting Yes button
 *    - if there is no yesMethod, then only one button will appear (in this case it is not a confirm, but a alert), instead of two
 *  - noMethod: to be used if hitting No button
 *  - color: to the butto
 */
export default function MessageModal(props) {
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
{console.log("props.yesMethod", props.yesMethod)}
          {props.yesMethod
            ?
              <ButtonGroup 
                className = "mt-3"
                style     = {{ width: "50%" }} >
                <Button 
                  variant   = { props.color || "primary" }
                  onClick   = { props.yesMethod } 
                  style     = {{width: "50%"}} >
                  Yes
                </Button>
                <Button 
                  variant   = { props.color || "danger" }
                  onClick   = { props.noMethod } 
                  style     = {{ width: "50%"}} >
                  No
                </Button>
              </ButtonGroup>
            :
              <Button 
                variant   = { props.color || "primary" }
                onClick   = { props.noMethod } 
                style     = {{ width: "50%"}} >
                OK
              </Button>
          }
        </Modal.Footer>
      </Modal>      
    </div>
  )
}
