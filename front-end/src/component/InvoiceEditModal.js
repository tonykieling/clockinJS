import React, { useState } from 'react';
import axios from "axios";
import { connect } from "react-redux";
import { Modal, Card, Button, ButtonGroup, Form, Row, Col } from "react-bootstrap";
import { show } from "./aux/formatDate.js";


// const customStyles = {
//   content : {
//     top                   : '50%',
//     left                  : '50%',
//     right                 : 'auto',
//     bottom                : 'auto',
//     marginRight           : '-50%',
//     transform             : 'translate(-50%, -50%)'
//   }
// };



/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */


function InvoiceEditModal(props) {
  const [showEditInvoice, setShowEditInvoice] = useState(props.showEditInvoiceModal);

  const handleClose = () => {
    setShowEditInvoice(false);
    const invoiceId = props.invoice._id
    changes 
      ? props.closeInvoiceEditModal({ invoiceId, newInvoiceCode, newReceivedAmount, newReason})
      : props.closeInvoiceEditModal();
  }

  const invoiceCode = props.invoice.code;
  const [newInvoiceCode, setNewInvoiceCode] = useState(invoiceCode);

  const receivedAmount = props.invoice.cad_adjustment || "";
  const [newReceivedAmount, setNewReceivedAmount] = useState(receivedAmount);

  const reason = props.invoice.reason_adjustment || "";
  const [newReason, setNewReason] = useState(reason);

  const [message, setMessage] = useState("");
  
  const [classNameMessage, setClassNameMessage] = useState("");

  const [changes, setChanges] = useState(false);

  
  const handleSubmit = async () => {
    if ((invoiceCode === newInvoiceCode) && (receivedAmount === newReceivedAmount) && (reason === newReason)) {
      setClassNameMessage("messageFailure");
      setMessage("Nothing to be changed");
      setNewReason("");
    } else {
      if (newInvoiceCode === "") {
        setClassNameMessage("messageFailure");
        setMessage("Missing Invoice's Code");
      } else if ((newReceivedAmount !== "") && (newReason === "" || !(newReason.trim()))) {
        setClassNameMessage("messageFailure");
        setMessage("Missing Reason");
        setNewReason("");
      } else if ((newReceivedAmount === "") && ((newReason !== "") && !!(newReason.trim()))) {
        setClassNameMessage("messageFailure");
        setMessage("Missing Received Amount");
      } else if ((newReceivedAmount !== "") && !(Number(newReceivedAmount))) {
        setClassNameMessage("messageFailure");
        setMessage("'Received $' has to be a number.");
      } else {
        const data = {
          invoiceId         : props.invoice._id,
          code              : newInvoiceCode,
          cad_adjustment    : newReceivedAmount,
          reason_adjustment : newReason
        };


        // perform the action to send data to be recorded bu the server
        const url = `/invoice/edit`;

        try {
          const updateInvoice = await axios.patch( 
            url,
            data,
            {  
              headers: { 
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${props.storeToken}` },
            
          });
  
          if (updateInvoice.data.message){
            setClassNameMessage("messageSuccess");
            setMessage("Invoice has been modified");
            setChanges(true);
          } else {
            console.log("something wrong!!");
            setClassNameMessage("messageFailure");
            setMessage(updateInvoice.data.error);
          }
        } catch(err) {
          console.log("ERRRRRRRRRRRRRRRRR");
          setClassNameMessage("messageFailure");
          setMessage(err.message);
        }
      }
    }

    clearMessage();
  }


  const clearMessage = () => {
    setTimeout(() => {
      setClassNameMessage("");
      setMessage("");
    }, 3000);
  }


  return (
    <Modal
      show    = { showEditInvoice}
      onHide  = { handleClose }
    >

      <Modal.Body>
        <Card className="card-settings" style={{marginLeft: 0, backgroundColor: "lightsteelblue"}}>
          <Card.Header>
            Edit Invoice's data
          </Card.Header>
          <br />
          <Form>

            <Row>
              <Col>
                <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Total CAD</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  style         = {{ textAlign: "right"}}
                  disabled      = { true}
                  value         = { `$ ${props.invoice.total_cad.toFixed(2)}`}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Date Start</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  style         = {{ textAlign: "right"}}
                  disabled      = { true}
                  value         = { show(props.invoice.date_start) }
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Date End</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  style         = {{ textAlign: "right"}}
                  disabled      = { true}
                  value         = { show(props.invoice.date_end) }
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Date Generated</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  style         = {{ textAlign: "right"}}
                  disabled      = { true}
                  value         = { show(props.invoice.date) }
                />
              </Col>
            </Row>

            { props.invoice.date_delivered &&
                <div>
                  <Row>
                    <Col>
                      <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Date Delivered</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        style         = {{ textAlign: "right"}}
                        disabled      = { true}
                        value         = { show(props.invoice.date_delivered) }
                      />
                    </Col>
                  </Row>
                </div>
            }

            { props.invoice.date_received &&
                <div>
                  <Row>
                    <Col>
                      <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Date Received</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        style         = {{ textAlign: "right"}}
                        disabled      = { true}
                        value         = { show(props.invoice.date_received) }
                      />
                    </Col>
                  </Row>
                </div>
            }

            <br />
            <Card>
              <Card.Header>
                What you can change
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Code</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      style         = {{ textAlign: "right"}}
                      type        = "text"
                      placeholder = { newInvoiceCode || "Invoice's Code"}
                      name        = "newInvoiceCode"
                      onChange    = { (event) => setNewInvoiceCode(event.target.value)}
                      value       = { newInvoiceCode }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Received $</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      disabled    = { (props.invoice.status === "Received") ? false : true}
                      style       = {{ textAlign: "right"}}
                      type        = "number"
                      placeholder = { (props.invoice.status === "Received") ? "Actually $ received" : "disabled"}
                      name        = "newReceivedAmount"
                      value       = { newReceivedAmount}
                      onChange    = { event => setNewReceivedAmount(event.target.value)}
                    />
                  </Col>
                </Row>

                <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Reason</Form.Label>
                <Form.Control
                  disabled    = { (props.invoice.status === "Received") ? false : true}
                  style         = {{ textAlign: "right"}}
                  as          = "textarea"
                  rows        = "3"
                  placeholder = { (props.invoice.status === "Received") 
                                ? "Why the diff btw the Total CAD and Received Amount" 
                                : "Only enabled when Invoice's status is 'Received'"}
                  name        = "newReason"
                  value       = { newReason}
                  onChange    = { (event) => setNewReason(event.target.value)}
                />

              </Card.Body>
            </Card>


          </Form>

          <br />
          <Card.Footer className= { classNameMessage}>          
            { message
              ? message
              : <br /> }
          </Card.Footer>

          <ButtonGroup className="mt-3">
            <Button
              style     = { { width: "50%" }}
              onClick = { handleClose }
            >
              Close
            </Button>
            <Button
              style     = { { width: "50%" }}
              variant   = "success"
              onClick   = { handleSubmit }
            >
              Save Changes
            </Button>
          </ButtonGroup>

        </Card>
      </Modal.Body>

    </Modal>
  )
}




const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};



export default connect(mapStateToProps, null)(InvoiceEditModal);
