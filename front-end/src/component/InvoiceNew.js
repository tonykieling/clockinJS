import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";
import * as formatDate from "./aux/formatDate.js";


/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */



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
    clockinWithInvoiceCode: false
  }


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleGetClockins = async event => {
    event.preventDefault();

    const
      dateStart = this.state.dateStart,
      dateEnd   = this.state.dateEnd,
      clientId  = this.state.clientId ;


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
          tableVisibility   : true,
          clientId,
          clockinWithInvoiceCode: this.checkIfThereIsInvoiceCode(getClockins.data.allClockins)
        });
      } else {
        this.setState({
          message: "No clockins for this period."
        });

        this.clearMessage();
      }


    } catch(err) {
      this.setState({
        message: err.message });
      
      this.clearMessage();
    }
  }


  /**
   * Inovice's Generator Method
   */
  handleInvoiceGenerator = async event => {
    event.preventDefault();

    if (!this.state.invoiceCode || this.state.invoiceCode === "") {
      alert("Please, provide Invoice's Code.");
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
              message : `Invoice Generated!`
            });

            // reload clockins after creating invoice
            this.getClockinsBtn.click();

          } else if (Invoice.data.error)
            this.setState({
              message: Invoice.data.error
            });
          this.clearMessage();
          
        } catch(err) {
          this.setState({
            message: err.message });
          this.clearMessage();
        }
      }
    }  



//************************************ */
// work on edit with this.state.clockList
renderDataTable = (clockins) => {
  let 
    totalTime = 0, 
    totalCAD  = 0;
  return clockins.map((clockin, index) => {
    const ts    = new Date(clockin.time_start);
    const te    = new Date(clockin.time_end);  
    const clockinsToSend = {
      num         : index + 1,
      date        : formatDate.show(clockin.date),
      timeStart   : ts.getUTCHours() + ":" + (ts.getUTCMinutes() < 10 ? ("0" + ts.getUTCMinutes()) : ts.getUTCMinutes()),
      timeEnd     : te.getUTCHours() + ":" + (te.getUTCMinutes() < 10 ? ("0" + te.getUTCMinutes()) : te.getUTCMinutes()),
      rate        : clockin.rate,
      totalTime   : ((te - ts) / ( 60 * 60 * 1000)),
      total       : ((te - ts) / ( 60 * 60 * 1000)) * (Number(clockin.rate)),
      invoice     : clockin.invoice_id ? clockin.invoice.code : "not yet"
      // invoice     : clockin.invoice_id ? (() => {
      //   this.setState({ clockinwithInvoiceCode: true });
      //   return(clockin.invoice.code);
      //  })
      //  : "not yet"
      }
    totalTime += clockinsToSend.totalTime;
    totalCAD += clockinsToSend.total;
    return ((clockins.length === index + 1) 
      ? (<tr key={clockinsToSend.num} onClick={() => this.test()}>
        <td>{clockinsToSend.num}</td>
        <td>{clockinsToSend.date}</td>
        <td>{clockinsToSend.totalTime} {clockinsToSend.totalTime > 1 ? "hours" : "hour"}</td>
        <td>{clockinsToSend.total}</td>
        <td>{clockinsToSend.invoice}</td>
      </tr>,
      <tr key={clockinsToSend.num + 1}>
        <th></th>
        <th></th>
        <th>{totalTime} {totalTime > 1 ? "hours" : "hour"}</th>
        <th>$ {totalCAD}</th>
        <th></th>
      </tr>
      )
      
      : (<tr key={clockinsToSend.num} onClick={() => this.test()}>
        <td>{clockinsToSend.num}</td>
        <td>{clockinsToSend.date}</td>
        <td>{clockinsToSend.totalTime} {clockinsToSend.totalTime > 1 ? "hours" : "hour"}</td>
        <td>{clockinsToSend.total}</td>
        <td>{clockinsToSend.invoice}</td>
        {/* <td>
          <Button
            variant   = "info"
            onClick   = {() => this.handleDelete(clockin._id, clockinsToSend.num)}
            // variant   = "info"
            // onClick   = {() => this.handleCallEdit(userToSend)}    // call modal to edit the clockin without invoice related to
            // data-user = {JSON.stringify(userToSend)}
          > Edit</Button>
        </td> */}
      </tr> )
    )
  })
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



  checkIfThereIsInvoiceCode = (listOfClockins) => {
    const check = listOfClockins.filter(clockin => clockin.invoice);
    return((check.length > 0) ? true : false)
  }



  test = () => {
    console.log("YUP!!!! \n\n NEED TO ADD A MODAL TO EDIT DATA OR DELETE THE CLOCKINS ROW ");
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

          <Button 
            variant   = "primary" 
            type      = "submit" 
            disabled  = { (this.state.dateStart && this.state.dateEnd && this.state.client) ? false : true }
            onClick   = { this.handleGetClockins } 
            ref       = {input => this.getClockinsBtn = input }  >
            Get Clockins
          </Button>

          <span className="invoiceGenMsg">
            {this.state.message}
          </span>

            
          </Form>
        </Card.Body>
      </Card>


      { this.state.tableVisibility
          ?
            // <Card id="clockinListResult">
            <Card className="cardInvoiceGenListofClockins card">
              <Form.Label className="cardLabel">Client: {this.state.client.nickname}</Form.Label>
              {(this.state.clockinList.length > 0) 
                ? 
                  <div>
                    <Table striped bordered hover size="sm" responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          {/* <th>Time Start</th>
                          <th>Time End</th> */}
                          <th>Total Time</th>
                          {/* <th>Rate</th> */}
                          <th>Total CAD$</th>
                          <th>Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.clockInListTable}
                      </tbody>
                    </Table>

                    <Button 
                      variant   = "primary" 
                      type      = "submit"
                      disabled  = {this.state.clockinWithInvoiceCode}
                      onClick   = { this.handleInvoiceGenerator } >
                      Invoice's Generator
                    </Button>

                    <Form.Group as={Row} controlId="invoiceCode">
                      <Form.Label column sm="3" className="cardLabel">Code:</Form.Label>
                      <Col sm="5">
                        <Form.Control
                          type        = "text"
                          name        = "invoiceCode"
                          onChange    = {this.handleChange}
                          value       = {this.state.invoiceCode}
                          disabled    = {this.state.clockinWithInvoiceCode}
                          ref         = {input => this.textCode = input }
                        />
                      </Col>
                    </Form.Group>

                  </div>
                : null }
            </Card>
          : null }

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
