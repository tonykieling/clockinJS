// import React, { Component } from 'react'
import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import Card   from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form   from "react-bootstrap/Form";
import Row    from "react-bootstrap/Row";
import Col    from "react-bootstrap/Col";
import Table  from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import GetClients from "./aux/GetClients.js";

const thinScreen = window.innerWidth < 800 ? true : false;

function PunchInsList(props) {

  // general page variables
  const [state, setState] = useState({
    client: {
      id    : "",
      name  : ""
    },
    period: {
      dateStart : "2020-01-01",
      dateEnd   : "2020-12-30",
    },
    message: {
      descripition      : "",
      classNameMessage  : ""
    },
    showOutput      : false,
    clearButton     : false,
    checkAllClients : false
    // checkAllClients : ""
  })

  // function to change date
  const handleChangeDate = event => {
    const { name, value } = event.target;

    setState({
      ...state,
      period: {
        ...state.period,
        [name]: value
      },
      message: {
        descripition: ""
      }
    });
  }


  // report variables
  const [report, setreport] = useState({
    period: {
      dateStart : "",
      dateEnd   : ""
    },
    summary : {
      totalClockins         : "",
      totalHours            : "",
      totalClockinsInvoiced : "",
      totalHoursInvoiced    : "",
      totalClockinsNoInvoice: "",
      totalHoursNoInvoice   : "",
      client                : ""
    },
    clockinsByClient : []
  });

  const clearReport = () => {
    console.log("Clear report function");
  }

  const handleSubmit = async event => {
    // console.log("state::::::::", state)
    setState({
      ...state,
      message: {
        descripition: ""
      }
    });

    event.preventDefault();
    const 
      client    = state.client,
      dateStart = state.period.dateStart,
      dateEnd   = state.period.dateEnd;

    if (client._id || state.checkAllClients) {
      const a = new Date(dateStart).getTime();
      const b = new Date(dateEnd).getTime();

      if (a > b) {
        console.log("A > B");
        setState({
          ...state,
          message: {
            descripition      : "Check you dates.",
            classNameMessage  : "messageFailure"
          }
        });
      } else {
        try {
          const url = `/report/clockins?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${state.client._id}&checkAllClients=${state.checkAllClients}`;

          const getClockinsReport = await axios.get( 
            url,
            {  
              headers: { 
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${props.storeToken}` }
          });
// console.log("getclockinsREPORT", getClockinsReport)
          if ("summary" in getClockinsReport.data){
            // set variable to show output
            setState({
              ...state,
              showOutput: true
            });

            //load report variable
            setreport({
              ...report,
              period            : getClockinsReport.data.period,
              summary           : getClockinsReport.data.summary,
              clockinsByClient  : getClockinsReport.data.clockinsByClient
            });

          } else {
            console.log("ERRRRRRRRRRRRRRRRRRRRRR")
            setState({
              ...state,
              message: {
                descripition      : getClockinsReport.data.error,
                classNameMessage  : "messageFailure"
              }
            });
          }
        } catch(err) {
          console.log("Another ERRRRRRR")
          setState({
            ...state,
            message: {
              descripition    : err.message,
              classNameMessage: "messageFailure"
            }
          });
        }
      }
    } else {
      console.log("VAlidation method has been fired!!!")
      setState({
        ...state,
        message: {
          descripition    : "Please, choose a client option.",
          classNameMessage: "messageFailure"
        }
      });
    }
  }


  // set client info coming from the green button
  const getClientInfo = client => {
    console.log("client hereeee", client)
    setState({
      ...state,
      client,
      message: {
        descripition: ""
      },
      checkAllClients: !client._id ? true : false
    });
  }


    return (
      <div className="formPosition">
        <br />

        <Card className="card-settings">
          <Card.Header>Reports - Clockins</Card.Header>
          <Card.Body>
            
          { /* mount the Dropbox Button with all clients for the user */ }
          <div className="gridClientBtContainer">
            <GetClients
              client        = { state.client }
              getClientInfo = { getClientInfo }
              report        = { true }
            />

          </div>


            <br></br>
            <Form >

              <Form.Group as={Row} controlId="formST">
                <Form.Label column sm="3" className="cardLabel">Date Start:</Form.Label>
                <Col sm="5">
                  <Form.Control
                    type        = "date"
                    name        = "dateStart"
                    onChange    = {handleChangeDate}
                    value       = {state.period.dateStart}
                    // disabled    = {( this.state.clientId === "" ) ? true : false } 
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formET">
                <Col sm="3">
                  <Form.Label className="cardLabel">Date End:</Form.Label>
                </Col>
                <Col sm="5">
                  <Form.Control                
                    type        = "date"
                    name        = "dateEnd"
                    onChange    = {handleChangeDate}
                    value       = {state.period.dateEnd}
                    // disabled    = {( this.state.clientId === "" ) ? true : false } 
                  />
                </Col>
              </Form.Group>

              <Card.Footer className= { state.message.classNameMessage}>          
                { state.message && state.message.descripition
                  ? state.message.descripition
                  : <br /> }
              </Card.Footer>
              <br />

              <div className="d-flex flex-column">
                { state.clearButton
                  ? 
                    <ButtonGroup className="mt-3">
                      <Button 
                        variant="primary" 
                        onClick = { handleSubmit } >
                        Get Report
                      </Button>
                      <Button variant="info" onClick = { clearReport }>
                        Clear
                      </Button>
                    </ButtonGroup>
                  :
                    <Button 
                      variant="primary" 
                      onClick = { handleSubmit } >
                      Get List
                    </Button>
                }
              </div>
            </Form>
          </Card.Body>
        </Card>


        { state.showOutput &&
            <Card className="cardInvoiceGenListofClockins card">
              <Card.Header style={{textAlign: "center"}}>
                {/* Client: <b>{state.client.nickname || state.client.name}</b> */}
                Clockins' Report
              </Card.Header>

              { console.log("REPORT:::", report) }
              {state.checkAllClients
                ?
                  // <Card.Text
                  <Card.Text style={{backgroundColor: "#F8F8F8"}}>
                    All {props.storeUser}'s clients report.
                  </Card.Text>
                :
                  <Card.Text>
                    {/* Client: {state.client.nickname || state.client.name} */}
                    Client: {report.summary.client}
                  </Card.Text>
              }

              <Card.Text>
                Period: {report.period.dateStart} -- {report.period.dateEnd}
              </Card.Text>
              <Card.Text>
                Summary: {JSON.stringify(report.summary)}
              </Card.Text>

              {state.checkAllClients &&
                <Card.Text>
                  Clockins by Client: {JSON.stringify(report.clockinsByClient)}
                </Card.Text>
              }
            </Card>
        }
{/*}
            {(this.state.clockinList.length > 0)
              ? thinScreen 
              ? <Table striped bordered hover size="sm" responsive>
                  <thead style={{textAlign: "center"}}>
                    <tr>
                      <th style={{verticalAlign: "middle"}}>#</th>
                      <th style={{verticalAlign: "middle"}}>Date</th>
                      <th style={{verticalAlign: "middle"}}>At</th>
                      <th style={{verticalAlign: "middle"}}>Duration</th>
                      <th style={{verticalAlign: "middle"}}>Invoice</th>
                    </tr>
                  </thead>
                  <tbody style={{textAlign: "center"}}>
                    {this.state.clockInListTable}
                  </tbody>
                </Table> 
              : <Table striped bordered hover size="sm" responsive>
                  <thead style={{textAlign: "center"}}>
                    <tr>
                      <th style={{verticalAlign: "middle"}}>#</th>
                      <th style={{verticalAlign: "middle"}}>Date</th>
                      <th style={{verticalAlign: "middle"}}>Time Start</th>
                      <th style={{verticalAlign: "middle"}}>Total Time</th>
                      <th style={{verticalAlign: "middle"}}>CAD$</th>
                      <th style={{verticalAlign: "middle"}}>Invoice</th>
                    </tr>
                  </thead>
                  <tbody style={{textAlign: "center"}}>
                    {this.state.clockInListTable}
                  </tbody>
                </Table>
            */}

        </div>

    );
}


const mapStateToProps = store => {
  return {
    storeUser   : store.name,
    storeToken  : store.token
  };
};


export default connect(mapStateToProps, null)(PunchInsList);
