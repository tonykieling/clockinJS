import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import Card   from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form   from "react-bootstrap/Form";
import Row    from "react-bootstrap/Row";
import Col    from "react-bootstrap/Col";

// import Table  from "react-bootstrap/Table";

import "../report.css";
import { show as formatedDate} from "./aux/formatDate";

import GetClients from "./aux/GetClients.js";

// const thinScreen = window.innerWidth < 800 ? true : false;

function PunchInsList(props) {

  // general page variables
  const [state, setState] = useState({
    client: {
      id    : "",
      name  : ""
    },
    period: {
      // dateStart : "2020-01-01",
      // dateEnd   : "2020-12-30",
      dateStart : "",
      dateEnd   : "",
    },
    message: {
      descripition      : "",
      classNameMessage  : ""
    },
    showOutput      : false,
    checkAllClients : false
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
    clockinsByClient  : [],
    message           : ""
  });


  const handleSubmit = async event => {
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

    console.log("dates:", dateEnd, dateStart)
    if (!dateStart || !dateEnd) {
      setState({
        ...state,
        message: {
          descripition    : (client._id || state.checkAllClients) ? "Please, set period." : "Please, select client and set period.",
          classNameMessage: "messageFailure"
        }
      });
    } else if (client._id || state.checkAllClients) {
      const a = new Date(dateStart).getTime();
      const b = new Date(dateEnd).getTime();

      if (a > b) {
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
console.log("getClockinsReport", getClockinsReport)
          if ("summary" in getClockinsReport.data){
            if ("message" in getClockinsReport.data.summary) {
              setreport({
                message : "There is no clockins for this period.",
                summary : {
                  client: getClockinsReport.data.summary.client
                },
                period  : getClockinsReport.data.period,
              })
            } else {
              //load report variable
              setreport({
                ...report,
                message           : "",
                period            : getClockinsReport.data.period,
                summary           : getClockinsReport.data.summary,
                clockinsByClient  : getClockinsReport.data.clockinsByClient
              });
            }

            // set variable to show output
            setState({
              ...state,
              showOutput  : true,
              message     : ""
            });

          } else {
            console.log("ERROR:", getClockinsReport.data.error)
            setState({
              ...state,
              message: {
                classNameMessage  : "messageFailure",
                descripition      : getClockinsReport.data.error.search("ECA01")
                                      ? "Token expired - User needs to login again."
                                      : getClockinsReport.data.error
              }
            });
          }
        } catch(err) {
          console.log("Another ERRRRRRR", err.message || err);
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
    setState({
      ...state,
      client,
      message: {
        descripition: ""
      },
      checkAllClients: !client._id ? true : false,
      showOutput: false
    });
  }



    return (
      <div className="formPosition">
        <br />

{/**
 * 
 * this is the form 
 * 
 * */}
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
                <Button 
                  variant="primary" 
                  onClick = { handleSubmit } 
                >
                  Get List
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>



{/**
 * 
 * this is the report 
 * 
 * */}
        { state.showOutput &&
            <div>
              <Card className = "report-card">
                <Card.Header className = "report-header">
                  Clockins' Report
                </Card.Header>

                {state.checkAllClients
                  ?
                    <Card.Text className = "report-main-title">
                      All {props.storeUser}'s clients report
                    </Card.Text>
                  :
                    <Card.Text className = "report-main-title">
                      {props.storeUser}'s Client: {report.summary.client}
                    </Card.Text>
                }

                <Card.Text className = "report-period">
                  <b>Period:</b> {formatedDate(report.period.dateStart)} to {formatedDate(report.period.dateEnd)}
                </Card.Text>

                <Card.Text className = "report-general-subtitle">
                  Summary:
                </Card.Text>

                { !report.message
                  ?
                    <React.Fragment>
                      <Card.Text className = "report-items">
                        Total of <b>{report.summary.totalHours} hours</b> in <b>{report.summary.totalClockins} clockins.</b>
                      </Card.Text>
                      <Card.Text className = "report-items">
                        Clockins Invoiced: {report.summary.totalClockinsInvoiced}
                      </Card.Text>
                      <Card.Text className = "report-items">
                        Clockins no Invoice: {report.summary.totalClockinsNoInvoice}
                      </Card.Text>
                      <Card.Text className = "report-items">
                        Hours Invoiced: {report.summary.totalHoursInvoiced}
                      </Card.Text>
                      <Card.Text className = "report-items">
                        Hours no Invoice: {report.summary.totalHoursNoInvoice}
                      </Card.Text>
                    </React.Fragment>
                  :
                    <Card.Text className = "report-items">
                      {report.message}
                    </Card.Text>
                }

                {state.checkAllClients &&
                  <div>
                    <Card.Text className = "report-general-subtitle">
                      Clockins by Client:
                    </Card.Text>

                    { report.clockinsByClient.map((e, i) =>
                        e.message
                          ?
                            <div key = {i}>
                              <Card.Text className = "report-items-by-client-first">
                                <b>{ i + 1}- Client: {e.client}</b>
                              </Card.Text>
                              <Card.Text className = "report-items-by-client">
                                { e.message}
                              </Card.Text>
                            </div>
                          :
                            <div key = {i}>
                              <Card.Text className = "report-items-by-client-first">
                                <b>{ i + 1}- Client: {e.client}</b>
                              </Card.Text>
                              <Card.Text className = "report-items-by-client">
                                Total of <b>{e.totalHours} hour{e.totalHours > 1 && "s"}</b> in <b>{e.totalClockins} clockin{e.totalClockins > 1 && "s"}.</b>
                              </Card.Text>
                              <Card.Text className = "report-items-by-client">
                                Clockins Invoiced: {e.totalClockinsInvoiced}
                              </Card.Text>
                              <Card.Text className = "report-items-by-client">
                                Clockins no Invoice: {e.totalClockinsNoInvoice}
                              </Card.Text>
                              <Card.Text className = "report-items-by-client">
                                Hours Invoiced: {e.totalHoursInvoiced}
                              </Card.Text>
                              <Card.Text className = "report-items-by-client">
                                Hours no Invoice: {e.totalHoursNoInvoice}
                              </Card.Text>
                            </div>
                    )}

                  </div>
                }
                <br/>
              </Card>
              <br />
            </div>
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
