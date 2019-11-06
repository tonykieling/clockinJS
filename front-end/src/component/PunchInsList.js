import React, { Component, Fragment } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import {  Card, Button, Form, Row, Col, Table } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";


class PunchInNew extends Component {

  state = {
    dateStart         : "",
    dateEnd           : "",
    clientId          : this.props.storeClientId,
    clockinList       : [],
    client            : "",
    clockInListTable  : "",
    tableVisibility   : "hiddenTable"
  }


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleSubmit = async event => {
    event.preventDefault();

    const
      dateStart = this.state.dateStart,
      dateEnd   = this.state.dateEnd,
      clientId  = this.props.storeClientId ;

    const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;

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
          tableVisibility   : "showTable"
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
        num         : index + 1,
        date        : dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate(),
        timeStart   : ts.getHours() + ":" + (ts.getMinutes() < 10 ? ("0" + ts.getMinutes()) : ts.getMinutes()),
        timeEnd     : te.getHours() + ":" + (te.getMinutes() < 10 ? ("0" + te.getMinutes()) : te.getMinutes()),
        rate        : clockin.rate,
        totalTime   : ((te - ts) / ( 60 * 60 * 1000)),
        total       : ((te - ts) / ( 60 * 60 * 1000)) * (Number(clockin.rate)),
        invoice     : clockin.invoice_id ? clockin.invoice_id : "not yet"
      }
console.log("clockinsToSend", clockinsToSend);

      return (
        <tr key={clockinsToSend.num}>
          <td>{clockinsToSend.num}</td>
          <td>{client}</td>
          <td>{clockinsToSend.date}</td>
          <td>{clockinsToSend.timeStart}</td>
          <td>{clockinsToSend.timeEnd}</td>
          <td>{clockinsToSend.totalTime}</td>
          <td>{clockinsToSend.rate}</td>
          <td>{clockinsToSend.total}</td>
          <td>{clockinsToSend.invoice}</td>
          <td>
            <Button
              variant   = "info"
              // onClick   = {() => this.handleCallEdit(userToSend)}    // call modal to edit the clockin without invoice related to
              // data-user = {JSON.stringify(userToSend)}
            > Edit</Button>
          </td>
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
        tableVisibility : "hiddenTable"
      });
    }, 3000);
  }


  render() {
    return (
      // <div>
      <Fragment>
        <h1>
          List of Punch ins
        </h1>
        <p>some random text</p>

        <Card style={{ width: '40rem' }}>
        <Card.Body>

         <GetClients />     { /* mount the Dropbox Button with all clients for the user */ }

          <br></br>
          <Form onSubmit={this.handleSubmit} >

            <Form.Group as={Row} controlId="formST">
              <Form.Label column sm="3" >Date Start:</Form.Label>
              <Col sm="5">
                <Form.Control
                  type        = "date"
                  // placeholder = "Starting Time"
                  name        = "dateStart"
                  onChange    = {this.handleChange}
                  value       = {this.state.dateStart}
                  // onKeyPress  = {this.handleChange}
                  // ref         = {input => this.textInput2 = input } 
                  />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formET">
              <Col sm="3">
                <Form.Label>Date End:</Form.Label>
              </Col>
              <Col sm="5">
                <Form.Control                
                  type        = "date"
                  // placeholder = "Ending Time"
                  name        = "dateEnd"
                  onChange    = {this.handleChange}
                  value       = {this.state.dateEnd}
                  // onKeyPress  = {this.handleChange}
                  // ref         = {input => this.textInput3 = input } 
                  />
              </Col>
            </Form.Group>

          <Button variant="primary" type= "submit" onClick = { this.handleSubmit }>
            Get List
          </Button>            
            
          </Form>
        </Card.Body>
      </Card>


      <Card 
        id="clockinListResult" 
        className={this.tableVisibility }
        >
          {(this.state.clockinList.length > 0) 
            ? <Table striped bordered hover size="sm" responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Time Start</th>
                    <th>Time End</th>
                    <th>Total Time</th>
                    <th>Rate</th>
                    <th>Total CAD$</th>
                    <th>Invoice</th>
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

          </Fragment>
      // </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token,
    storeClientId : store.client_id
  };
};


// const mapDispatchToProps = dispatch => {
//   return {
//     dispatchLogin: user => dispatch({
//       type:"LOGIN",
//       data: user })
//   };
// };


export default connect(mapStateToProps, null)(PunchInNew);
