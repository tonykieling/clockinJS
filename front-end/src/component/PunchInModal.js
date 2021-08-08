import React, { useState} from "react";
import { Modal, Button, ButtonGroup, Card, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import MessageModal from "./MessageModal.js";
import axios from "axios";

/**
 * 
 * using Hook + Modal from boostrap, instead of react-modal
 */

function PunchInModal(props) {

  const [showClockinModal, setShowClockinModal] = useState(props.showModal);

  const [openModal, setOpenModal] = useState(false);
  const [notPossibleDelete, setNotPossibleDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [classNameMessage, setClassNameMessage] = useState("");

  const letfSpace = (props.thinScreen ? "1rem" : "3rem");

  const handleClose = () => {
    setShowClockinModal(false);
    props.closeModal();
  }

  const handleDelete = () => {
    if (props.invoice) {
      setNotPossibleDelete(true);
    } else {
      setOpenModal(true);
    }
  }


  const yesDelete = async () => {
    setOpenModal(false);
    // const url = `/clockin`;
    const url = "/api/clockin";

    try {
      const deleteClockin = await axios.delete( 
        url,
        {
          data: {
            clockinId: props.clockinData.id
          },
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${props.storeToken}` }
      });

      if (deleteClockin.data.error)
        throw (deleteClockin.data.error);
      else {
        setClassNameMessage("messageSuccess");
        setMessage("Clocking has been deleted.");
        setTimeout(() => {
          props.deleteClockin(props.clockinData.id);
          props.closeModal();
        }, 2500);
      }
    } catch(err) {
      setClassNameMessage("messageFailure"); 
      setMessage(err);
    }
  }

  return (
    <div>
        <Modal
          show    = { showClockinModal }
          onHide  = { props.closeModal }
          // style   = {{ backgroundColor: "red"}}
        >

          <Modal.Header closeButton={handleClose}>
            <Modal.Title>ClockIn Information</Modal.Title>
          </Modal.Header>

          {props.thinScreen
            ?
              <Modal.Body>
                <Card className="card-settings" style={{marginLeft: 0, backgroundColor: "lightsteelblue"}}>
                  <Card.Header className="cardTitle">Client: {props.client}</Card.Header>
                  <Form style={{paddingLeft: letfSpace}}>
                    <Row>
                      <Col>
                        <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Date</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          disabled      = { true}
                          value         = { props.clockinData.date || "date"}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Time Start</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          disabled      = { true}
                          value         = { props.clockinData.timeStart || "timestart"}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Time End</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          disabled      = { true}
                          value         = { props.clockinData.timeEnd || "timeend"}
                        />
                      </Col>
                    </Row>


                    { props.clockinData.breakStart
                    ?
                      <div>
                        <Row>
                          <Col>
                            <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Break Start</Form.Label>
                          </Col>
                          <Col>
                            <Form.Control
                              disabled      = { true}
                              value         = { props.clockinData.breakStart || "break start"}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Break End</Form.Label>
                          </Col>
                          <Col>
                            <Form.Control
                              disabled      = { true}
                              value         = { props.clockinData.breakEnd || "break end"}
                            />
                          </Col>
                        </Row>
                      </div>
                    : ""
                  }



                    <Row>
                      <Col>
                        <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Total Time</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          disabled      = { true}
                          value         = { !!props.clockinData.workedHours ? props.clockinData.workedHours : props.clockinData.totalTime }
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Rate</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          disabled      = { true}
                          value         = { props.clockinData.rate || "rate"}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Total CAD$</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          disabled      = { true}
                          value         = { props.clockinData.totalCad || "cad$"}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Invoice</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          disabled      = { true}
                          value         = { props.clockinData.invoice || "invoice"}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Label column className="cardLabel" style={{paddingLeft: "0px"}}>Notes</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          disabled      = { true}
                          value         = { props.clockinData.notes || " "}
                        />
                      </Col>
                    </Row>

                  </Form>
                </Card>
              </Modal.Body>
            
            :
              <Modal.Body>
                <Card className="card-settings" style={{marginLeft: 0, backgroundColor: "lightsteelblue"}}>
                  <Card.Header className="cardTitle">Client: {props.client}</Card.Header>

                  <Form style={{paddingLeft: letfSpace}}>
                    <Form.Group as={Row} controlId="formDate" style={{marginBottom: 0}}>
                      <Form.Label column sm={4} className="cardLabel" style={{paddingLeft: "0px"}}>Date</Form.Label>
                      <Col sm={5} style={{paddingLeft: "0px"}}>
                        <Form.Control
                          disabled      = { true}
                          value         = { props.clockinData.date || "date"}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formTS" style={{marginBottom: 0}}>
                      <Form.Label column sm={4} className="cardLabel" style={{paddingLeft: "0px"}}>Time Start</Form.Label>
                      <Col sm={5} style={{paddingLeft: "0px"}}>
                        <Form.Control
                          disabled      = { true}
                          value         = { props.clockinData.timeStart || "timestart"}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formTE" style={{marginBottom: 0}}>
                        <Form.Label column sm={4} className="cardLabel" style={{paddingLeft: "0px"}}>Time End</Form.Label>
                        <Col sm={5} style={{paddingLeft: "0px"}}>
                          <Form.Control
                            disabled      = { true}
                            value         = { props.clockinData.timeEnd || "timeend"}
                          />
                        </Col>
                    </Form.Group>
                    
                  { props.clockinData.breakStart
                    ?
                      <div>
                        <Form.Group as={Row} controlId="formTt" style={{marginBottom: 0}}>
                            <Form.Label column sm={4} className="cardLabel" style={{paddingLeft: "0px"}}>Break Start</Form.Label>
                            <Col sm={5} style={{paddingLeft: "0px"}}>
                              <Form.Control
                                disabled      = { true}
                                value         = { props.clockinData.breakStart || "totaltime"}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formTt" style={{marginBottom: 0}}>
                            <Form.Label column sm={4} className="cardLabel" style={{paddingLeft: "0px"}}>Break End</Form.Label>
                            <Col sm={5} style={{paddingLeft: "0px"}}>
                              <Form.Control
                                disabled      = { true}
                                value         = { props.clockinData.breakEnd || "totaltime"}
                                />
                            </Col>
                        </Form.Group>
                      </div>
                    : ""
                  }

                    <Form.Group as={Row} controlId="formTt" style={{marginBottom: 0}}>
                        <Form.Label column sm={4} className="cardLabel" style={{paddingLeft: "0px"}}>Total Time</Form.Label>
                        <Col sm={5} style={{paddingLeft: "0px"}}>
                          <Form.Control
                            disabled      = { true}
                            value         = { !!props.clockinData.workedHours ? props.clockinData.workedHours : props.clockinData.totalTime }
                          />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formRate" style={{marginBottom: 0}}>
                        <Form.Label column sm={4} className="cardLabel" style={{paddingLeft: "0px"}}>Rate</Form.Label>
                        <Col sm={5} style={{paddingLeft: "0px"}}>
                          <Form.Control
                            disabled      = { true}
                            value         = { props.clockinData.rate || "rate"}
                          />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formTotalCad" style={{marginBottom: 0}}>
                        <Form.Label column sm={4} className="cardLabel" style={{paddingLeft: "0px"}}>Total $</Form.Label>
                        <Col sm={5} style={{paddingLeft: "0px"}}>
                          <Form.Control
                            disabled      = { true}
                            value         = { props.clockinData.totalCad || "CAD$"}
                          />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formInvoice" style={{marginBottom: 0}}>
                        <Form.Label column sm={4} className="cardLabel" style={{paddingLeft: "0px"}}>Invoice</Form.Label>
                        <Col sm={5} style={{paddingLeft: "0px"}}>
                          <Form.Control
                            disabled      = { true}
                            value         = { props.clockinData.invoice || "invoice"}
                          />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formInvoice" style={{marginBottom: 0}}>
                        <Form.Label column sm={4} className="cardLabel" style={{paddingLeft: "0px"}}>Notes</Form.Label>
                        <Col sm={5} style={{paddingLeft: "0px"}}>
                          <Form.Control
                            disabled      = { true}
                            value         = { props.clockinData.notes || " "}
                          />
                        </Col>
                    </Form.Group>

                  </Form>
                </Card>
            </Modal.Body>
          }


          <Card.Footer className={classNameMessage}>          
            { message
              ? message
              : <br /> }
          </Card.Footer>

        <Modal.Footer>
          { props.deleteClockin
            ?
              <ButtonGroup 
                className = "mt-3"
                style     = {{ width: "50%" }}
              >
                <Button 
                  variant   = "primary" 
                  onClick   = { handleClose } 
                  style     = {{width: "50%"}}
                >
                  Close
                </Button>
                <Button 
                  variant   = "danger" 
                  onClick   = { handleDelete } 
                  style     = {{ width: "50%"}}
                >
                  Delete
                </Button>
              </ButtonGroup>
            :
              <Button 
                variant   = "primary" 
                onClick   = { handleClose } 
                style     = {{width: "50%"}}
              >
                Close
              </Button>
          }
        </Modal.Footer>

      </Modal>      

      { openModal
        ?
          <MessageModal
            openModal = { openModal}
            message   = { "Are you sure you want to Delete this clockin?" }
            yesMethod = { yesDelete }
            colorBtn1 = { "warning"}
            colorBtn2 = { "success"}
            noMethod  = { () => setOpenModal(false)} 
          />
        : ""
      }

      { notPossibleDelete
        ?
          <MessageModal
            openModal = { notPossibleDelete}
            message   = {
              <div>
                <p>This clockin cannot be delete due there is a invoice related to it.</p>
                <br />
                <p>You need to delete the invoice first.</p>
              </div>
            }
            noMethod  = { () => setNotPossibleDelete(false) } 
          />
        : ""
      }
    </div>
  );
}

const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};


export default connect(mapStateToProps, null)(PunchInModal);
