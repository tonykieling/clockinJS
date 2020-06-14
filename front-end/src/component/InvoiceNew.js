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



/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */

const thinScreen = window.innerWidth < 800 ? true : false;



class InvoiceNew extends Component {

  constructor(props) {
    super(props);
    this.textCode = React.createRef();
    this.state = {
      // dateStart         : "2020-03-04",
      // dateEnd           : "2020-04-13",
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
      lastUsedCode      : ""
    }
  };


  handleChange = event => {
    this.setState({
      [event.target.name] : event.target.value,
      // message             : ""
    });
    
    if (event.target.name === "invoiceCode")
      this.setState({ 
        messageInvoice    : "",
        disableInvGenBtn  : false,
        codeMessage       : this.state.lastUsedCode === event.target.value ? "Last used code" : ""
      });
  }


  handleGetClockins = async event => {
    event.preventDefault();

    if (!this.state.dateStart || !this.state.dateEnd) {
      this.setState({
        message           : "Please, select Client and set Date Start and Date End.",
        classNameMessage  : "messageFailure"
      });      
    } else if (this.state.dateEnd < this.state.dateStart) {
      this.setState({
        message           : "Date End has to be greater or equal than Date Start.",
        classNameMessage  : "messageFailure"
      });
    } else if (this.state.dateStart && this.state.dateEnd && this.state.client) {
      const
        dateStart             = this.state.dateStart,
        dateEnd               = this.state.dateEnd,
        clientId              = this.state.clientId,
        queryLastInvoiceCode  = true;

      const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}&queryLastInvoiceCode=${queryLastInvoiceCode}`;

      try {
        const getClockins = await axios.get( 
          url,
          {  
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${this.props.storeToken}` }
        });
        
        if (getClockins.data.count){
          const tempClockins          = getClockins.data.allClockins;
          const invoiceSuggestionCode = getClockins.data.codeSuggestion || "";

          this.setState({
            clockinList       : tempClockins,
            clockInListTable  : this.renderDataTable(tempClockins),
            // clockInListTable  : PunchInTableEdit(getClockins.data.allClockins),
            tableVisibility   : true,
            clientId,
            lastClockinDate   : new Date(tempClockins[tempClockins.length - 1].date.substring(0, 10)).getTime(),
            clockinWithInvoiceCode: this.checkIfThereIsInvoiceCode(tempClockins),
            disableInvGenBtn  : this.checkIfThereIsInvoiceCode(tempClockins),
            message           : "",
            invoiceCode       : invoiceSuggestionCode.newCode ||  invoiceSuggestionCode,
            codeMessage       : invoiceSuggestionCode ? (invoiceSuggestionCode.newCode ? "Suggested code" : "Last used code") : "",
            lastUsedCode      : invoiceSuggestionCode && !invoiceSuggestionCode.newCode && invoiceSuggestionCode
          });

          this.generatorBtn.scrollIntoView({ behavior: "smooth" });
          // this.clearMessage();
        } else {
          this.setState({
            message           : "No clockins for this period.",
            classNameMessage  : "messageFailure",
            tableVisibility   : false
          });

          this.clearMessage();
        }

      } catch(err) {
        this.setState({
          message           : err.message,
          classNameMessage  : "messageFailure"
        });

        this.clearMessage();
      }
    } else {
      this.setState({
        message           : "Please, select client and set dates.",
        classNameMessage  : "messageFailure"
      });

      // this.clearMessage();
    }

    // this.clearMessage();
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
        code      : this.state.invoiceCode.toUpperCase()
      }

      const url = "/invoice";
        try {
          const Invoice = await axios.post( 
            url,
            data,
            {  
              headers: { 
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${this.props.storeToken}` }
          });
          
          if (Invoice.data.message) {
            this.setState({
              messageInvoice          : `Invoice has been Generated!`,
              classNameMessage        : "messageSuccess",
              clockinWithInvoiceCode  : true,
              invoiceDate             : "",
              lastUsedCode            : "",
              codeMessage             : ""
            });

            this.clearMessage();
            // reload clockins after creating invoice
            this.getClockinsBtn.click();

          } else
            throw (Invoice.data.error);

        } catch(err) {
          console.log("errrr", err);
          this.setState({
            messageInvoice    : err,
            classNameMessage  : "messageFailure"
          });

          // this.clearMessage();
        }
      }
    }  


  renderDataTable = (clockins) => {
    return clockins.map((clockin, index) => {
      const clockinsToSend = renderClockinDataTable(clockin, index);

      if (thinScreen) {   // small devices
        return (
          <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
            {/* <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalCad}</td> */}
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
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
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
          </tr>
        );
      }
    });
  }

  editClockin = data => {
    this.setState({
      showModal       : true,
      clockinToModal  : data
    });
  }


  closeClockinModal = () => {
    this.setState({
      showModal: false
    });
  }


  updateClockins = (clockinToRemove) => {
    const tempClockins      = this.state.clockinList.filter( clockin => clockin._id !== clockinToRemove);
    const tempClockinsTable = this.renderDataTable(tempClockins);

    this.setState({
      clockinList       : tempClockins,
      clockInListTable  : tempClockinsTable
    });
  }



  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message         : "",
        messageInvoice  : "",
        invoiceCode     : "",
        // disableInvGenBtn: false
      });
    }, 3500);
  }


  getClientInfo = client => {
    this.setState({
      client,
      clientId        : client._id,
      disabledIPBtn   : false,
      tableVisibility : false
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

          <GetClients 
                client        = { this.state.client }
                getClientInfo = { this.getClientInfo } /> { /* mount the Dropbox Button with all clients for the user */ }

          <br></br>
          {/* <Form onSubmit={this.handleGetClockins} > */}
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
                  ? <Table striped bordered hover size="sm" responsive>
                      <thead style={{textAlign: "center"}}>
                        <tr>
                          <th style={{verticalAlign: "middle"}}>#</th>
                          <th style={{verticalAlign: "middle"}}>Date</th>
                          <th style={{verticalAlign: "middle"}}>At</th>
                          {/* <th style={{verticalAlign: "middle"}}>CAD$</th> */}
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
                : null }

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
              showModal     = { this.state.showModal}
              clockinData   = { this.state.clockinToModal}
              client        = { this.state.client.nickname}
              deleteClockin = { (clockinId) => this.updateClockins(clockinId)}
              closeModal    = { this.closeClockinModal}
              thinScreen    = { thinScreen}
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
