import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import {  Card, Button, Form, Row, Col, Table } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";
import PdfTemplate from "./PdfTemplate.js";


class InvoiceNew extends Component {

  state = {
    dateStart         : "",
    dateEnd           : "",
    clientId          : this.props.storeClientId,
    clockinList       : [],
    client            : "",
    clockInListTable  : "",
    tableVisibility   : false,
    showPreview       : false
  }


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleSubmit = async event => {
    event.preventDefault();
// this.setState({
//   showPreview: true
// });
// return;
    const
      dateStart = this.state.dateStart,
      dateEnd   = this.state.dateEnd,
      clientId  = this.props.storeClientId ;

    const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;
    ///
    //
    //
    //
    //
    //
//


    try {
      const getClockins = await axios.get( 
        url,
        {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${this.props.storeToken}` }
      });
console.log("getClockins", getClockins.data.allClockins);

      if (getClockins.data.allClockins){
console.log("alrigth");
        this.setState({
          clockinList       : getClockins.data.allClockins,
          client            : getClockins.data.client,
          clockInListTable  : this.renderDataTable(getClockins.data.allClockins, getClockins.data.client),
          clientId,
          // tableVisibility   : "showTable",
          tableVisibility   : true,
          showPreview       : true
        });
      }
console.log("--- this.state", this.state);
    } catch(err) {
console.log("errorrrrr");
      this.setState({
        message: err.message });
      
      this.cleanForm();
    }
  }


  renderDataTable = (clockins, client) => {
console.log("inside rednderDataTable", clockins);
    return clockins.map((clockin, index) => {
      const dt = new Date(clockin.date);
      const ts = new Date(clockin.time_start);
      const te = new Date(clockin.time_end);
      const clockinsToSend = {
        index,
        date        : dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate(),
        // timeStart   : ts.getHours() + ":" + (ts.getMinutes() < 10 ? ("0" + ts.getMinutes()) : ts.getMinutes()),
        // timeEnd     : te.getHours() + ":" + (te.getMinutes() < 10 ? ("0" + te.getMinutes()) : te.getMinutes()),
        rate        : clockin.rate,
        totalTime   : ((te - ts) / ( 60 * 60 * 1000)),
        total       : ((te - ts) / ( 60 * 60 * 1000)) * (Number(clockin.rate))
      }
console.log("clockinsToSend", clockinsToSend);

      return (
        <tr key={clockinsToSend.index}>
          <td>Behavior intervention</td>
          <td>{clockinsToSend.date}</td>
          <td>{clockinsToSend.totalTime}</td>
          <td>{clockinsToSend.rate}</td>
          <td>{clockinsToSend.total}</td>
        </tr>
      )
    })
  }  


  cleanForm = () => {
    setTimeout(() => {
      this.setState({
        date            : "",
        timeStart       : "",
        timeEnd         : "",
        rate            : "",
        notes           : "",
        message         : "",
        tableVisibility : false
      });
    }, 3000);
  }

  invoicePdfPreview = () => {
    const clockinsTable = 
      <Table striped bordered hover size="sm" responsive>
        <thead>
          <tr>
            <th>Type of Service</th>
            <th>Dates</th>
            <th># of Hours</th>
            <th>Rate Per Hour - inclusive of PST if applicable</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {this.state.clockInListTable}
        </tbody>
      </Table> 

      return(
        <PdfTemplate 
            client        = {this.state.client} 
            clockinsTable = {clockinsTable} />
      )
  }


  render() {
    return (
      <div>
        {console.log("this.showPreview", this.state.client)};
        { this.state.showPreview
          ? this.invoicePdfPreview()
          :
      <div className="formPosition">
        <h3>Invoice generator</h3>
        <p>In order to generate the invoice, please select the client and the range of dates.</p>
        <h2 style={{color:"red"}}>This process is UNDER CONSTRUCTION</h2>

        <Card className="card-settings">
        <Card.Body>

         <GetClients />     { /* mount the Dropbox Button with all clients for the user */ }

          <br></br>
          <Form onSubmit={this.handleSubmit} >

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

          <Button variant="primary" type= "submit" onClick = { this.handleSubmit }>
            Invoice Preview
          </Button>            
            
          </Form>
        </Card.Body>
      </Card>


      { this.state.tableVisibility
        ?
          <Card id="clockinListResult"  >
            {(this.state.clockinList.length > 0) 
              ? <Table striped bordered hover size="sm" responsive>
                  <thead>
                    <tr>
                      <th>Type of Service</th>
                      <th>Dates</th>
                      <th># of Hours</th>
                      <th>Rate Per Hour - inclusive of PST if applicable</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.clockInListTable}
                  </tbody>
                </Table> 
              : null }
            {/* <CSVLink
                data      = {this.state.dataTableCSVFile}
                headers   = {fileHeaders}
                separator = {";"}
                filename  = {(this.state.dropDownBtnName === "Wanna consider user's type?") ?
                                          "userList.csv" :
                                          `${this.state.dropDownBtnName}.csv`}
                className = "btn btn-primary"
                target    = "blank" >
                Download me
            </CSVLink>             */}
          </Card>
        : null }

          </div>
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
