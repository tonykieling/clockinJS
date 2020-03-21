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
    props.closeInvoiceEditModal();
  }

  const [invoiceCode, setInvoiceCode] = useState(props.invoice.code);

  const [receivedAmount, setReceivedAmount] = useState("");

  const [reason, setReason] = useState("");

  const [message, setMessage] = useState("");
  
  const [classNameMessage, setClassNameMessage] = useState("");
  
  const handleSubmit = async () => {
    console.log("code- ", invoiceCode)
    console.log("receivedAmount- ", receivedAmount)
    console.log("reason- ", !(!reason || !reason.trim()))
console.log("xxXXx=", reason.trim(), " = ", !!(reason.trim()))
console.log("ooooo", (reason !== ""))
    if ((invoiceCode === props.invoice.code) && !receivedAmount && (!reason || !(reason.trim()))) {
      setClassNameMessage("messageFailure");
      setMessage("Nothing to be changed");
      setReason("");
    } else {
      if (invoiceCode === "") {
        setClassNameMessage("messageFailure");
        setMessage("Missing Invoice's Code");
      } else if ((receivedAmount !== "") && (reason === "" || !(reason.trim()))) {
        setClassNameMessage("messageFailure");
        setMessage("Missing Reason");
        setReason("");
      } else if ((receivedAmount === "") && ((reason !== "") && !!(reason.trim()))) {
        setClassNameMessage("messageFailure");
        setMessage("Missing Received Amount");
      } else if (!(Number(receivedAmount))) {
        setClassNameMessage("messageFailure");
        setMessage("'Received $' has to be a number.");
      } else {
        const data = {
          invoiceId         : props.invoice_id,
          code              : invoiceCode,
          cad_adjustment    : receivedAmount,
          reason_adjustment : reason
        };
        console.log("sending data", data);
        console.log("props invoice", props.invoice);
        console.log("props", props);


        // perform the action to send data to be recorded bu the server

        // const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;
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
  
          console.log("received", updateInvoice)

          if (updateInvoice.data.dataX){
            console.log("2 received:", updateInvoice.data)
          } else {
            //////////////////just in case
            console.log("something wrong")
          }
        } catch(err) {
          console.log("ERRRRRRRRRRRRRRRRR")
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
      {/* <Modal.Header closeButton={handleClose}>
        <Modal.Title>Invoice {props.invoice.code}</Modal.Title>
      </Modal.Header> */}

      <Modal.Body>
        <Card className="card-settings" style={{marginLeft: 0, backgroundColor: "lightsteelblue"}}>
          <Card.Header>
            Edit Invoice's data
          </Card.Header>
          <br />
          <Form>
            {/* { console.log("invoice:", props.invoice)} */}

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
                      placeholder = "Invoice's Code"
                      name        = "invoiceCode"
                      onChange    = { (event) => setInvoiceCode(event.target.value)}
                      value       = { invoiceCode }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Received $</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      style         = {{ textAlign: "right"}}
                      type        = "number"
                      placeholder = "Actually $ received"
                      name        = "receivedAmount"
                      value       = { receivedAmount}
                      // onChange    = { (event) => Number(event.target.value) && setReceivedAmount(event.target.value)}
                      onChange    = { event => setReceivedAmount(event.target.value)}
                    />
                  </Col>
                </Row>

                <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Reason</Form.Label>
                <Form.Control
                  style         = {{ textAlign: "right"}}
                  as          = "textarea"
                  rows        = "3"
                  placeholder = "Why the diff btw the Total CAD and Received Amount"
                  name        = "reason"
                  value       = { reason}
                  onChange    = { (event) => setReason(event.target.value)}
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
