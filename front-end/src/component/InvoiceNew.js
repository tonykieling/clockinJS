import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

import GetClients from "./aux/GetClients.js";
import { getCurrentDateTime } from "./aux/formatDate.js";
import PunchInModal from "./PunchInModal.js";
import { renderClockinDataTable } from "./aux/renderClockinDataTable.js";
import { getClockins } from "./aux/getClockins.js";



/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */

const 
  colorRedish     = "#c94c4c",
  colorGreenish   = "limegreen";

const thinScreen = window.innerWidth < 800 ? true : false;



class InvoiceNew extends Component {

  constructor(props) {
    super(props);
    this.textCode = React.createRef();
    this.state = {
      // dateStart         : "2020-07-01",
      // dateEnd           : "2020-07-01",
      dateStart         : "",
      dateEnd           : "",
      clientId          : "",
      clockinList       : [],
      client            : "",
      clockInListTable  : "",
      tableVisibility   : false,
      message           : "",
      invoiceCode       : "",
      invoiceDate       : "",
      clockinWithInvoiceCode: false,

      showModal         : false,
      clockinToModal    : "",
      classNameMessage  : "",
      messageInvoice    : "",
      disableInvGenBtn  : false,
      codeMessage       : "",
      lastUsedCode      : "",
      disableGetBt      : false
    }
  };


  handleChange = event => {
    this.setState({
      [event.target.name] : event.target.value,
      // message             : ""
    });
    
    if (event.target.name === "invoiceCode")
      this.setState({ 
        disableInvGenBtn  : false,
        codeMessage       : this.state.lastUsedCode === event.target.value ? "Last used code" : ""
      });
  }


  handleGetClockins = async event => {
    event.preventDefault();

    if (!this.state.dateStart || !this.state.dateEnd) {
      this.setState({
        message           : "Please, select Client and set Date Start and Date End.",
        classNameMessage  : "messageFailure",
        messageInvoice    : ""
      });      
    } else if (this.state.dateEnd < this.state.dateStart) {
      this.setState({
        message           : "Date End has to be greater or equal than Date Start.",
        classNameMessage  : "messageFailure",
        messageInvoice    : ""
      });
    // } else if (this.state.dateStart && this.state.dateEnd && (this.state.client || this.state.company)) {
    } else if (this.state.dateStart && this.state.dateEnd && this.state.client) {
      const
        dateStart             = this.state.dateStart,
        dateEnd               = this.state.dateEnd,
        clientId              = this.state.clientId,
        queryLastInvoiceCode  = true;


      this.setState({
        message           : "Getting clockins...",
        classNameMessage  : "messageSuccess",
        tableVisibility   : false,
        disableGetBt      : true
      });

      const pastClockins = await getClockins(this.props.storeToken, "normal", dateStart, dateEnd, clientId, queryLastInvoiceCode);

        if (pastClockins.error)
          this.setState({
            message           : pastClockins.error,
            classNameMessage  : "messageFailure",
            tableVisibility   : false,
            messageInvoice    : ""
          });
        else if (pastClockins.data.count){
          const tempClockins          = pastClockins.data.allClockins;
          const invoiceSuggestionCode = pastClockins.data.codeSuggestion || "";

          // solution for the clockinWithInvoiceCode, right now, is to run another setState before the one that runs renderDataTable
          // probably notthe best solution, but it is working.
          // this.setState({
          //   clockinWithInvoiceCode: this.checkIfThereIsInvoiceCode(tempClockins)
          // });
          // decide to handle another way:
            // if there is invoice for any of the clockins, 
            // the system will paint the cel in red and show a message
            // and keep showing totals, but it will not able the button to generated a invoice

          this.setState({
            clockinList       : tempClockins,
            clockinWithInvoiceCode: this.checkIfThereIsInvoiceCode(tempClockins),
            disableInvGenBtn  : this.checkIfThereIsInvoiceCode(tempClockins),
            clockInListTable  : this.renderDataTable(tempClockins, colorRedish),
            // clockInListTable  : PunchInTableEdit(getClockins.data.allClockins),
            tableVisibility   : true,
            clientId,
            lastClockinDate   : new Date(tempClockins[tempClockins.length - 1].date.substring(0, 10)).getTime(),
            message           : "",
            invoiceCode       : invoiceSuggestionCode.newCode ||  invoiceSuggestionCode,
            codeMessage       : invoiceSuggestionCode ? (invoiceSuggestionCode.newCode ? "Suggested code" : "Last used code") : "",
            lastUsedCode      : invoiceSuggestionCode && !invoiceSuggestionCode.newCode && invoiceSuggestionCode,
            messageInvoice    : ""
          });

          if (this.state.clockinWithInvoiceCode)
            this.setState({
              classNameMessage  : "messageFailure",
              messageInvoice    : "No clockins with invoice, please."
            });

          this.generatorBtn.scrollIntoView({ behavior: "smooth" });
          // this.clearMessage();
        } else {
          this.setState({
            message           : "No clockins for this period.",
            classNameMessage  : "messageFailure",
            tableVisibility   : false,
            messageInvoice    : ""
          });

          // this.clearMessage();
        }


    } else {
      this.setState({
        message           : "Please, select client and set dates.",
        classNameMessage  : "messageFailure"
      });

      // this.clearMessage();
    }

    this.setState({
      disableGetBt : false
    });
  }


  /**
   * Inovice's Generator Method
   */
  handleInvoiceGenerator = async event => {
    event.preventDefault();
    
    if (!this.state.invoiceCode || this.state.invoiceCode === "") {
      this.setState({
        messageInvoice    : "Please, provide Invoice's Code.",
        classNameMessage  : "messageFailure"
      });
      
      this.textCode.current.focus();
    } else if ((this.state.codeMessage === "last used code") || this.state.lastUsedCode === this.state.invoiceCode) {
      this.setState({
        messageInvoice    : "Please, provide a new Invoice's Code.",
        classNameMessage  : "messageFailure"
      });
      
      this.textCode.current.focus();
    } else {
      const dtGeneration = this.state.invoiceDate 
              ? new Date(this.state.invoiceDate).getTime() 
              : getCurrentDateTime();
              
      if (dtGeneration < this.state.lastClockinDate) {
        this.setState({
          messageInvoice    : "Date should be greater or equal to the last clockin date.",
          classNameMessage  : "messageFailure"
        });
        return;
      }

      this.setState({disableInvGenBtn: true});

      const data = {
        date      : dtGeneration,
        dateStart : this.state.dateStart,
        dateEnd   : this.state.dateEnd,
        notes     : this.state.notes,
        clientId  : this.state.clientId,
        code      : this.state.invoiceCode.toUpperCase(),
        clockinArray : this.state.clockinList
      }

      const url = "/api/invoice";

        try {
          const invoice = await axios.post( 
            url,
            data,
            {  
              headers: { 
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${this.props.storeToken}` }
          });

          if (invoice.data.message) {
            const newClockinTable = this.state.clockinList.map(e => ({...e, invoice: {code: data.code}}));

            this.setState({
              messageInvoice          : `Invoice has been Generated!`,
              classNameMessage        : "messageSuccess",
              clockinWithInvoiceCode  : true,
              invoiceDate             : "",
              lastUsedCode            : "",
              codeMessage             : "",
              clockinList             : newClockinTable,
              clockInListTable        : this.renderDataTable(newClockinTable, colorGreenish)
            });

            // this.clearMessage();

          } else
            throw (invoice.data.error || "Sorry, something bad has happened.");

        } catch(err) {
          this.setState({
            messageInvoice    : err,
            classNameMessage  : "messageFailure"
          });
        }
      }

      this.setState({ disableInvGenBtn: false });
    }  


  renderDataTable = (clockins, invoiceCellColor) => {
    let result = [];
    let totalHours  = 0;

    const dataTable = clockins.map((clockin, index) => {
      // totalHours += (clockin.worked_hours / (3600000));
      totalHours += ((clockin.worked_hours 
                      ? clockin.worked_hours 
                      : ((new Date(clockin.time_end).getTime()) - (new Date(clockin.time_start).getTime()))
                    ) / (3600000));

      // here, that question about round before or after the final result, considering the rate at the end or in each interaction
      // choose doing the math at the end, after summin up all hours for the period, so calculate the totalCad
      // totalCads += (currentHours * clockin.rate);

      const clockinsToSend = renderClockinDataTable(clockin, index);
        if (thinScreen) {   // small devices

          return (
                <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
                  <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
                  <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
                  <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
                  <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
                  {clockinsToSend.invoice === "not yet"
                    ? <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
                    : <td style={{verticalAlign: "middle", backgroundColor: invoiceCellColor}}>{clockinsToSend.invoice}</td>
                  }
                </tr>
          );

        } else {
          return (
                <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
                  <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
                  <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
                  <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
                  <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
                  <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalCad}</td>
                  {clockinsToSend.invoice === "not yet"
                    ? <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
                    : <td style={{verticalAlign: "middle", backgroundColor: invoiceCellColor}}>{clockinsToSend.invoice}</td>
                  }
                  {/* <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td> */}
                </tr>
          );
        }
    });


    const totalCads = (totalHours.toFixed(2)) * clockins[0].rate;

    const addHoursAndCads =  !this.state.clockinWithInvoiceCode &&
      (
        <React.Fragment key="1.1">
          <tr key="2.1">
            <td colSpan= { thinScreen ? 5 : 6 } style={{background: "gainsboro"}}></td>
          </tr>

          <tr key="2.2">
            <td></td>
            <td colSpan= { thinScreen ? 2 : 3 } style={{textAlign: "left", paddingLeft: "1rem"}}><b>Total of worked hours</b></td>
            <td colSpan= { thinScreen ? 2 : 3 }><b>{totalHours.toFixed(2)}</b></td>
          </tr>

          <tr key="2.3">
            <td></td>
            <td colSpan= { thinScreen ? 2 : 3 } style={{textAlign: "left", paddingLeft: "1rem"}}><b>Total Cads</b></td>
            <td colSpan= { thinScreen ? 2 : 3 }><b>$ {totalCads.toFixed(2)}</b></td>
          </tr>
        </React.Fragment>
      );

    result = [...dataTable, addHoursAndCads];

    return result;
  }


  editClockin = data => {
    this.setState({
      showModal       : true,
      clockinToModal  : data,
    });
  }


  closeClockinModal = () => {
    this.setState({
      showModal: false
    });
  }


  updateClockins = (clockinToRemove) => {
    const tempClockins      = this.state.clockinList.filter( clockin => clockin._id !== clockinToRemove);
    const tempClockinsTable = this.renderDataTable(tempClockins, colorRedish);

    this.setState({
      clockinList       : tempClockins,
      clockInListTable  : tempClockinsTable
    });
  }



  // clearMessage = () => {
  //   setTimeout(() => {
  //     this.setState({
  //       message         : "",
  //       messageInvoice  : "",
  //       invoiceCode     : "",
  //       // disableInvGenBtn: false
  //     });
  //   }, 3500);
  // }


  getClientInfo = client => {
    this.setState({
      client,
      clientId        : client._id,
      disabledIPBtn   : false,
      tableVisibility : false,
      message         : ""
    });
  }


  handleEnter = (e) => {
    if (e.key === "Enter")
      if (e.target.name === "invoiceCode")
        this.generatorBtn.click();
  }


  checkIfThereIsInvoiceCode = listOfClockins => {
    const check = listOfClockins.filter(clockin => clockin.invoice);
    return((check.length > 0) ? true : false)
  }


  render() {
    return (
      <div className="formPosition">
        <br />
        <Card className="card-settings">
          <Card.Header>Invoice Generator</Card.Header>
          <Card.Body>
            <div className="gridClientBtContainer">
              <GetClients 
                client        = { this.state.client }
                getClientInfo = { this.getClientInfo }
              /> 

            </div>

            <br></br>
            <Form>

              <Form.Group as={Row} controlId="formST">
                <Form.Label column sm="3" className="cardLabel">Date Start:</Form.Label>
                <Col sm="5">
                  <Form.Control
                    type        = "date"
                    name        = "dateStart"
                    onChange    = {this.handleChange}
                    value       = {this.state.dateStart} 
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
                    onChange    = {this.handleChange}
                    value       = {this.state.dateEnd} 
                  />
                </Col>
              </Form.Group>

              <Card.Footer className= { this.state.classNameMessage}>          
                { this.state.message
                  ? this.state.message
                  : <br /> }
              </Card.Footer>
              <br />

              <div className="d-flex flex-column">
                <Button 
                  variant   = "primary" 
                  type      = "submit"
                  onClick   = { this.handleGetClockins } 
                  disabled  = { this.state.disableGetBt }
                  ref       = {input => this.getClockinsBtn = input }  
                >
                  Get Clockins
                </Button>
              </div>

            </Form>
          </Card.Body>
      </Card>


        { this.state.tableVisibility
          ?
            <Card className="cardInvoiceGenListofClockins card">
              <Card.Header style={{textAlign: "center"}}>
                  Client: <b>{this.state.client.nickname || this.state.client.name}</b>, {" "}
                  <b>{this.state.clockinList.length}</b> {this.state.clockinList.length > 1 ? "Clockins" : "Clockin"}
              </Card.Header>

              {(this.state.clockinList.length > 0)
                ? thinScreen 
                  ?
                    <Table striped bordered hover size="sm" responsive>
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
                    :
                      <Table striped bordered hover size="sm" responsive>
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
                : 
                  null 
              }

              <Row >
                <Col xs = "6">
                  <Form.Label 
                    column  
                    style   = {{ paddingRight: 0, marginLeft: "1rem"}} 
                  >
                    <strong>Code: </strong> 
                  </Form.Label>
                </Col>
                <Col xs = "5">
                  <Form.Control
                    autoComplete= { "off"}
                    type        = "text"
                    name        = "invoiceCode"
                    placeholder = "Invoice's code"
                    onKeyPress  = {this.handleEnter}
                    onChange    = {this.handleChange}
                    value       = {this.state.clockinWithInvoiceCode ? "" : this.state.invoiceCode}
                    disabled    = {this.state.clockinWithInvoiceCode}
                    ref         = { this.textCode }
                  />
                  {this.state.codeMessage && !this.state.disableInvGenBtn 
                    ?
                      <Overlay
                        target    = {this.textCode}
                        show      = {true}
                        placement = "left"
                      >
                        <Tooltip id={"tooltip-left"}>
                          <strong 
                            style={{color: this.state.codeMessage === "Suggested code" ? "lime" : "gold"}}
                          >
                            {this.state.codeMessage}
                          </strong>
                        </Tooltip>
                      </Overlay>
                    : ""
                  }
                </Col>
              </Row>

              <Row >
                <Col xs = "6">
                  <Form.Label column style = {{ paddingRight: 0, marginLeft: "1rem"}}><strong>Date: </strong> (optional)</Form.Label>
                </Col>
                <Col xs = "5" >
                  <Form.Control
                    type        = "date"
                    name        = "invoiceDate"
                    // onKeyPress  = {this.handleEnter}
                    onChange    = {this.handleChange}
                    value       = {this.state.invoiceDate}
                    disabled    = {this.state.clockinWithInvoiceCode}
                    style       = {{paddingRight: "0"}}
                  />
                </Col>
              </Row>

              <div style = {{  padding: "1rem", width: "100%"}}>
                <Card.Footer className= { this.state.classNameMessage}>          
                  { this.state.messageInvoice
                    ? this.state.messageInvoice
                    : <br /> }
                </Card.Footer>
              </div>
              
              <Button 
                variant   = "primary" 
                type      = "submit"
                disabled  = { this.state.clockinWithInvoiceCode || this.state.disableInvGenBtn }
                onClick   = { this.handleInvoiceGenerator } 
                ref       = { input => this.generatorBtn = input}
              >
                Invoice's Generator
              </Button>
              <br />

            </Card>
          : null 
        }

        {this.state.showModal
          ? <PunchInModal 
              showModal     = { this.state.showModal }
              clockinData   = { this.state.clockinToModal }
              // client        = { this.state.client.nickname}
              client        = { this.state.client.nickname || this.state.client.name }
              deleteClockin = { (clockinId) => this.updateClockins(clockinId) }
              closeModal    = { this.closeClockinModal }
              thinScreen    = { thinScreen }
            />
          : ""
        }

      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};



export default connect(mapStateToProps, null)(InvoiceNew);
