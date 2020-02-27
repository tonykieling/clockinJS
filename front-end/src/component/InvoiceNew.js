import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";
// import * as formatDate from "./aux/formatDate.js";
import PunchInModal from "./PunchInModal.js";
import { renderClockinDataTable } from "./aux/renderClockinDataTable.js";



/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */

const thinScreen = window.innerWidth < 800 ? true : false;



class InvoiceNew extends Component {

  state = {
    dateStart         : "",
    dateEnd           : "",
    clientId          : "",
    clockinList       : [],
    client            : "",
    clockInListTable  : "",
    tableVisibility   : false,
    message           : "",
    invoiceCode       : "",
    clockinWithInvoiceCode: false,

    showModal         : false,
    clockinToModal    : "",
    classNameMessage  : ""
  }


  handleChange = event => {
    this.setState({
      [event.target.name] : event.target.value,
      message             : ""
    });
  }


  handleGetClockins = async event => {
    event.preventDefault();

    if (this.state.dateStart && this.state.dateEnd && this.state.client) {
      const
        dateStart = this.state.dateStart,
        dateEnd   = this.state.dateEnd,
        clientId  = this.state.clientId;


      const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;

      try {
        const getClockins = await axios.get( 
          url,
          {  
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${this.props.storeToken}` }
        });
        
        if (getClockins.data.allClockins){
          this.setState({
            clockinList       : getClockins.data.allClockins,
            clockInListTable  : this.renderDataTable(getClockins.data.allClockins),
            // clockInListTable  : PunchInTableEdit(getClockins.data.allClockins),
            tableVisibility   : true,
            clientId,
            clockinWithInvoiceCode: this.checkIfThereIsInvoiceCode(getClockins.data.allClockins)
          });

          this.textCode.scrollIntoView({ behavior: "smooth" });
        } else
          this.setState({
            message           : "No clockins for this period.",
            classNameMessage  : "messageFailure",
            tableVisibility   : false
          });


      } catch(err) {
        this.setState({
          message           : err.message,
          classNameMessage  : "messageFailure"
        });
      }
    } else 
      this.setState({
        message           : "Please, select client and set dates.",
        classNameMessage  : "messageFailure"
      });

    this.clearMessage();
  }


  /**
   * Inovice's Generator Method
   */
  handleInvoiceGenerator = async event => {
    event.preventDefault();

    if (!this.state.invoiceCode || this.state.invoiceCode === "") {
      this.setState({
        message           : "Please, provide Invoice's Code.",
        classNameMessage  : "messageFailure"
      });
      this.textCode.focus();
    } else {
      const data = {
        date      : new Date(),
        dateStart : this.state.dateStart,
        dateEnd   : this.state.dateEnd,
        notes     : this.state.notes || "no notes at all",
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
              message                 : `Invoice has been Generated!`,
              classNameMessage        : "messageSuccess",
              clockinWithInvoiceCode  : true
            });

            // reload clockins after creating invoice
            this.getClockinsBtn.click();

          } else
            throw (Invoice.data.error);
            // this.setState({
            //   message: Invoice.data.error
            // });

        } catch(err) {
          console.log("errrr", err);
          this.setState({
            message           : err,
            classNameMessage  : "messageFailure"
          });

          this.clearMessage();
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
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalCad}</td>
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
        message     : "",
        invoiceCode : ""
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
          <Form onSubmit={this.handleGetClockins} >

            <Form.Group as={Row} controlId="formST">
              <Form.Label column sm="3" className="cardLabel">Date Start:</Form.Label>
              <Col sm="5">
                <Form.Control
                  type        = "date"
                  name        = "dateStart"
                  onChange    = {this.handleChange}
                  value       = {this.state.dateStart} />
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
                  value       = {this.state.dateEnd} />
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
              // disabled  = { (this.state.dateStart && this.state.dateEnd && this.state.client) ? false : true }
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
                Client: <b>{this.state.client.nickname}</b>, <b>{this.state.clockinList.length}</b> clockins
              </Card.Header>

{/* {console.log("this.state", this.state)} */}
              {(this.state.clockinList.length > 0)
                ? thinScreen 
                  ? <Table striped bordered hover size="sm" responsive>
                      <thead style={{textAlign: "center"}}>
                        <tr>
                          <th style={{verticalAlign: "middle"}}>#</th>
                          <th style={{verticalAlign: "middle"}}>Date</th>
                          <th style={{verticalAlign: "middle"}}>Time Start</th>
                          <th style={{verticalAlign: "middle"}}>CAD$</th>
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

              <Form.Group as={Row} controlId="invoiceCode">
                <Form.Label column sm="3" className="cardLabel">
                  Code:
                  {/* Code: <b style={{color: "red", paddingLeft: "1rem"}}>{this.state.messageCode}</b> */}
                </Form.Label>
                    {/* <Form.Label style={{paddingLeft: "1rem", maxWidth: "15%"}}><b>Code:</b></Form.Label> */}
                    {/* <Form.Label column sm={2} className="cardLabel" style={{paddingLeft: "2rem"}}>Code: </Form.Label> */}
                <Col sm="4">
                  <Form.Control sm={2}
                    type        = "text"
                    name        = "invoiceCode"
                    placeholder = "Type Invoice's code"
                    onKeyPress  = {this.handleEnter}
                    onChange    = {this.handleChange}
                    value       = {this.state.invoiceCode}
                    disabled    = {this.state.clockinWithInvoiceCode}
                    ref         = {input => this.textCode = input }
                    />
                </Col>
              </Form.Group>

              <Button 
                variant   = "primary" 
                type      = "submit"
                disabled  = {this.state.clockinWithInvoiceCode}
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
              // deleteClockin = { (clockinId) => console.log("clockin got deleted", clockinId)}
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
