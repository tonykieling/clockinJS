import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import {  Card, Button, Form, Row, Col } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import GetClients from "./aux/GetClients.js";
// import DateRangePicker from "./aux/DateRangePicker.js";


class PunchInNew extends Component {

  state = {
    date          : undefined,
    startingTime  : undefined,
    endingTime    : undefined,
    // rate          : this.props.storeRate ? this.props.storeRate : "yyy",
    rate          : "",
    notes         : undefined,
    errorMsg      : undefined,
    message       : undefined
  }


  handleChange = event => {
// console.log("inside changes");
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleSubmit = async event => {
    event.preventDefault();
console.log("inside onSubmit");

  const data = { 
    date      : this.state.date,
    timeStart : this.state.startingTime,
    timeEnd   : this.state.endingTime,
    rate      : this.state.rate || this.props.storeRate,
    notes     : this.state.notes,
    clientId  : this.props.storeClientId };

    const url = "/clockin";
      try {
        const getClients = await axios.post( 
          url,
          data,
          {  
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${this.props.storeToken}` }
        });
console.log("getClientsXXX", getClients);

        if (getClients.data.message.length > 0) {
          this.setState({
            message: `${getClients.data.message} -client: ${getClients.data.client}`
          });
        }
      } catch(err) {
        this.setState({
          errorMsg: err.message });
      }
}


  render() {
    return (
      <div>
        <h1>
          PunchIn New over here CLASS
        </h1>
        <p>changing state after componentDidMount and working on looping of a list of items</p>

        <Card style={{ width: '30rem' }}>
        <Card.Body>
          <Card.Title>Punch in</Card.Title>

         <GetClients />     { /* mount the Dropbox Button with all clients for the user */ }

<br></br>
          <Form onSubmit={this.handleSubmit} >
            <Form.Group as={Row} controlId="formDate">
              <Form.Label column sm="3" >Date</Form.Label>
              <Col sm="15">
                <Form.Control 
                  // autoFocus   = {true}
                  type        = "date"
                  // placeholder = "Session's Date"
                  name        = "date"
                  onChange    = {this.handleChange}
                  value       = {this.state.date}
                  onKeyPress  = {this.handleChange}
                  // ref         = {input => this.textInput1 = input } 
                />
              </Col>
            {/* <DatePicker
              name="dates"
              placeholderText = "Click to select"
              // selected = {this.state.time_start}
              // onChange = {this.handleChangeStartDate}
              // selectsStart
              // minDate={this.state.time_start || new Date()}
              // dateFormat="dd/MM/YYYY"
              // startDate={this.state.time_start}
              // endDate={this.state.time_end}
              // className = "form-control"
              // required

              selected={startDate}
              onChange={date => setStartDate(date)}
              fixedHeight
            /> */}

            </Form.Group>

            <Form.Group as={Row} controlId="formST">
              <Form.Label column sm="3" >Time Start</Form.Label>
              <Col sm="15">
                <Form.Control
                    type        = "time"
                    placeholder = "Starting Time"
                    name        = "startingTime"
                    onChange    = {this.handleChange}
                    value       = {this.state.startingTime}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput2 = input } />
              </Col>
              </Form.Group>

            <Form.Group as={Row} controlId="formET">
              <Form.Label column sm="3" >Time End</Form.Label>
              <Col sm="15">
                <Form.Control                
                  type        = "text"
                  placeholder = "Ending Time"
                  name        = "endingTime"
                  onChange    = {this.handleChange}
                  value       = {this.state.endingTime}
                  onKeyPress  = {this.handleChange}
                  ref         = {input => this.textInput3 = input } />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formRate">
              <Form.Label column sm="3" >Rate</Form.Label>
              <Col sm="15">
                <Form.Control
                  type        = "text"
                  placeholder = { this.props.storeRate ? this.props.storeRate : "Default Rate"}
                  // defaultValue = { this.props.storeRate ? this.props.storeRate : "Default Rate"}
                  // value = { this.props.storeRate ? this.props.storeRate : "xx" }
                  // defaultValue     = { this.props.storeRate}
                  name        = "rate"
                  onChange    = {this.handleChange}
                  // value       = {this.state.rate}
                  onKeyPress  = {this.handleChange}
                  ref         = {input => this.textInput4 = input } />
              </Col>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as          = "textarea"
                rows        = "4"
                type        = "text"
                placeholder = "Session's Notes"
                name        = "notes"
                onChange    = {this.handleChange}
                value       = {this.state.notes}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput5 = input } />
            </Form.Group>

            <Button variant="primary" type= "submit" onClick = { this.handleSubmit }>
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token,
    storeRate     : store.client_dr,
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
