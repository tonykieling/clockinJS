import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import {  Card, Button, Form, Row, Col } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import GetClients from "./aux/GetClients.js";
// import DateRangePicker from "./aux/DateRangePicker.js";

import "../App.css";


class PunchInNew extends Component {

  state = {
    date          : "",
    startingTime  : "",
    endingTime    : "",
    rate          : "",
    notes         : "",
    message       : "",
    clientId      : "",
    // flagToRenderDB: false
  }


  handleChange = event => {
// console.log("inside changes");
    this.setState({
      [event.target.name]: event.target.value
    });

    this.cleanMessage();
  }


  handleSubmit = async event => {
    event.preventDefault();
console.log("inside onSubmit");

    const data = { 
      date      : this.state.date,
      timeStart : this.state.startingTime,
      timeEnd   : this.state.endingTime,
      rate      : this.state.rate,
      notes     : this.state.notes,
      clientId  : this.state.clientId };

    if ( !data.date || !data.timeStart || !data.timeEnd || !data.rate){
console.log(`  
               date = ${data.date}
                ts  = ${data.timeStart}
                te  = ${data.timeEnd}
               rate = ${data.rate} `);
      this.messageValidationMethod();
    }
      
    else {
      const url = "/clockin";
      try {
        const addClockin = await axios.post( 
          url,
          data,
          {  
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${this.props.storeToken}` }
        });

        if (addClockin.data.message) {
          this.setState({
            message: `Punched in!`,
            // flagToRenderDB: true
          });
        } else if (addClockin.data.error)
          this.setState({
            message: addClockin.data.error
          });

        // this.setState({
        //   flagToRenderDB: false
        // })
        this.cleanForm();
        
      } catch(err) {
        this.setState({
          message: err.message });
        this.cleanForm();
      }
    }
  }


  messageValidationMethod = () => {
    this.setState({
      message: !this.state.clientId ? "Please, select client." : "Please fill the fields."
    });

    setTimeout(() => {
      this.cleanMessage();
    }, 3000);
  }

  cleanMessage = () => {
      this.setState({
        message: ""
      });
  }


  cleanForm = () => {
    setTimeout(() => {
      this.setState({
        date          : "",
        startingTime  : "",
        endingTime    : "",
        rate          : "",
        notes         : "",
        message       : ""
      });
    }, 3000);
  }


  showTotalTime = () => {
    const time1 = Date.parse(`01 Jan 1970 ${(this.state.startingTime)}:00 GMT`);
    const time2 = Date.parse(`01 Jan 1970 ${this.state.endingTime}:00 GMT`);

    return(
      <Form.Group as={Row} controlId="formTotal">
        <Form.Label column sm="9" >Total time: {((time2 - time1) / (60 * 60 * 1000))} hr</Form.Label>
      </Form.Group>
    )
  }

  getClientInfo = client => {
    this.setState({
      clientId  : client._id,
      rate      : client.default_rate
    });
  }

  render() {

    // return (
    //   !this.state.date
    //     ?
    //       <h1>YES</h1>
    //     : <h1>NO</h1>
    // )

    return (
      <div>
        <h1>
          PunchIn New over here CLASS
        </h1>
        <p>changing state after componentDidMount and working on looping of a list of items</p>

        <Card style={{ width: '40rem' }}>
        <Card.Body>
          <Card.Title>Punch in</Card.Title>

          { /* mount the Dropbox Button with all clients for the user */ }
          <div className="gridClientBtContainer">
            <GetClients getClientInfo = { this.getClientInfo } />
            <span>
              { this.state.message ? this.state.message : "" }
            </span>
          </div>


          <br></br>
          <Form onSubmit={this.handleSubmit} >

            <Form.Group as={Row} controlId="formDate">
              <Form.Label column sm="3">Date:</Form.Label>
              <Col sm="6">
                <Form.Control 
                  type        = "date"
                  // placeholder = "Session's Date"
                  name        = "date"
                  onChange    = {this.handleChange}
                  value       = {this.state.date}
                  onKeyPress  = {this.handleChange}
                  // ref         = {input => this.textInput1 = input } 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formST">
              <Form.Label column sm="3" >Time Start:</Form.Label>
              <Col sm="3">
                <Form.Control
                  type        = "text"
                  placeholder = "Starting Time"
                  name        = "startingTime"
                  onChange    = {this.handleChange}
                  value       = {this.state.startingTime}
                  onKeyPress  = {this.handleChange}
                  // ref         = {input => this.textInput2 = input } 
                  />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formET">
              <Col sm="3">
                <Form.Label>Time End:</Form.Label>
              </Col>
              <Col sm="3">
                <Form.Control                
                  type        = "text"
                  placeholder = "Ending Time"
                  name        = "endingTime"
                  onChange    = {this.handleChange}
                  value       = {this.state.endingTime}
                  onKeyPress  = {this.handleChange}
                  // ref         = {input => this.textInput3 = input } 
                  />
              </Col>

              <Col sm="6">
                { (this.state.endingTime && this.state.startingTime)
                  ? this.showTotalTime()
                  : null }
              </Col>

              
            </Form.Group>

            <Form.Group as={Row} controlId="formRate">
              <Form.Label column sm="3" >Rate</Form.Label>
              <Col sm="3">
                <Form.Control
                  type        = "text"
                  placeholder = { this.state.rate || "Default Rate"}
                  name        = "rate"
                  onChange    = {this.handleChange}
                  onKeyPress  = {this.handleChange}
                  value       = {this.state.rate}
                  // ref         = {input => this.textInput4 = input } 
                  />
              </Col>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as          = "textarea"
                rows        = "3"
                // type        = "text"
                placeholder = "Session's Notes"
                name        = "notes"
                onChange    = {this.handleChange}
                value       = {this.state.notes}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput5 = input } />
            </Form.Group>

            <Button 
              variant="primary" 
              type= "submit" 
              onClick = { this.handleSubmit } >
              Submit
            </Button>            
            
            {/* <span>
              { this.state.message ? this.state.message : "" }
            </span> */}

          </Form>
        </Card.Body>
      </Card>        

      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token
    // storeRate     : store.client_dr,
    // storeClientId : store.client_id
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
