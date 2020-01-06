import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";

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
    // invoice_id        : "",
    invoiceCode       : ""
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
console.log("getClockins.data.allClockins", getClockins.data.allClockins);
        this.setState({
          clockinList       : getClockins.data.allClockins,
          clockInListTable  : this.renderDataTable(getClockins.data.allClockins),
          clientId,
          tableVisibility   : true
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
console.log("inside InvoiceGenerator");

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
        code      : this.state.invoiceCode
      }
  console.log("data:", data);

        const url = "/invoice";
        try {
          // const Invoice = "Almost There";
          // Invoice.data.message = Invoice;
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
          } else if (Invoice.data.error)
            this.setState({
              message: Invoice.data.error
            });
  console.log("Invoice result:", Invoice);
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
  return clockins.map((clockin, index) => {
    const date  = new Date(clockin.date);
    const ts    = new Date(clockin.time_start);
    const te    = new Date(clockin.time_end);  
    const clockinsToSend = {
      num         : index + 1,
      date        : (date.getUTCDate() > 10 
                      ? date.getUTCDate()
                      : "0" + date.getUTCDate()) + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear(),
      // date,
      timeStart   : ts.getUTCHours() + ":" + (ts.getUTCMinutes() < 10 ? ("0" + ts.getUTCMinutes()) : ts.getUTCMinutes()),
      timeEnd     : te.getUTCHours() + ":" + (te.getUTCMinutes() < 10 ? ("0" + te.getUTCMinutes()) : te.getUTCMinutes()),
      rate        : clockin.rate,
      totalTime   : ((te - ts) / ( 60 * 60 * 1000)),
      total       : ((te - ts) / ( 60 * 60 * 1000)) * (Number(clockin.rate)),
      invoice     : clockin.invoice_id ? clockin.invoice.code : "not yet"
    }

    return (
      <tr key={clockinsToSend.num} onClick={() => this.test()}>
        <td>{clockinsToSend.num}</td>
        <td>{clockinsToSend.date}</td>
        {/* <td>{clockinsToSend.timeStart}</td>
        <td>{clockinsToSend.timeEnd}</td> */}
        <td>{clockinsToSend.totalTime} {clockinsToSend.totalTime > 1 ? "hours" : "hour"}</td>
        {/* <td>{clockinsToSend.rate}</td> */}
        <td>{clockinsToSend.total}</td>
        {/* <td>{clockinsToSend.invoice}</td> */}
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
      </tr>
    )
  })
}  

  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message     : "",
        invoiceCode : ""
      });
    }, 3000);
  }


  getClientInfo = client => {
    this.setState({
      client,
      clientId        : client._id,
      disabledIPBtn   : false,
      tableVisibility : false
    });
  }

  test = () => {
    console.log("YUP!!!! \n\n NEED TO ADD A MODAL TO EDIT DATA OR DELETE THE CLOCKINS ROW ");
  }

  render() {
    return (
      <div className="formPosition">
        <h3>Invoice generator</h3>
        <p>In order to generate the invoice, select the client and the period's.</p>
        <h2 style={{color:"red"}}>This process is UNDER CONSTRUCTION</h2>

        <Card className="card-settings">
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
            onClick   = { this.handleGetClockins }>
            {/* {this.state.tableVisibility ? "Invoice Preview" : "Get clockins"} */}
            Get Clockins
          </Button>

          <span>
            {this.state.message}
          </span>

            
          </Form>
        </Card.Body>
      </Card>


      { this.state.tableVisibility
          ?
            <Card id="clockinListResult" >
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

                    {/* Button to fire Preview Invoice Method */}
                    <Button 
                      variant   = "primary" 
                      type      = "submit" 
                      onClick   = { this.handleInvoiceGenerator }>
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
