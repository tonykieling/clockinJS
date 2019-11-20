import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import {  Card, Button, Form, Row, Col } from "react-bootstrap";
// import moment from "moment";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import GetClients from "./aux/GetClients.js";
// import DateRangePicker from "./aux/DateRangePicker.js";


class PunchInNew extends Component {

  state = {
    date          : "",
    startingTime  : "",
    endingTime    : "",
    rate          : "",
    notes         : "",
    message       : "",
    client        : {}
  }


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });

    this.cleanMessage();
  }


  handleSubmit = async event => {
    event.preventDefault();

    const data = { 
      // date      : (new Date(this.state.date).getTime()),
      // date      : new Date(this.state.date.toLocaleString('en-US', { timeZone: "UTC" })),
      // date      : new Date().toLocaleDateString({timeZone: "America/Vancouver"}),
      // date      : moment(d).format("L"),
      date      : this.state.date,
      timeStart : this.state.startingTime,
      timeEnd   : this.state.endingTime,
      rate      : this.state.rate,
      notes     : this.state.notes,
      clientId  : this.state.client._id };

      console.log(`  
                    client = ${data.clientId}
                    date = ${data.date}
                      ts  = ${data.timeStart}
                      te  = ${data.timeEnd}
                    rate = ${data.rate} `);
    // if ( !data.clientId || !data.date || !data.timeStart || !data.timeEnd || !data.rate){
    //   this.messageValidationMethod();
    // }
    if (1===2){}
    else {
console.log("xxxxxxxx")    
      const url = "/clockin";
      try {
        const addClockin = await axios.post( 
          url,
          data,
          {  
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${this.props.storeToken}` }
        })

        if (addClockin.data.message) {
          this.setState({
            message: `Punched in!`
          });
        } else if (addClockin.data.error)
          this.setState({
            message: addClockin.data.error
          });

        // this.cleanForm();
        
      } catch(err) {
        this.setState({
          message: err.message });
        // this.cleanForm();
      }
    }
  }


  messageValidationMethod = () => {
    this.setState({
      message: !this.state.client ? "Please, select client." : "Please fill the fields."
    });

    // setTimeout(() => {
    //   this.cleanMessage();
    // }, 3000);
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
        message       : "",
        client        : {}
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
console.log("inside getclientInfo - client: ", client);

// setTimeout(() => 
  this.setState({
    client  : client,
    rate    : client.default_rate
  })
    // console.log("this.state.rate", this.state.rate)
    // , 0);
  }

  render() {
console.log("this.state", this.state);
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
            <GetClients 
              client        = { this.state.client }
              getClientInfo = { this.getClientInfo } />
              
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
                  name        = "date"
                  onChange    = {this.handleChange}
                  value       = {this.state.date}
                  onKeyPress  = {this.handleChange}
                  disabled    = {( this.state.rate === "" ) ? true : false } />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formST">
              <Form.Label column sm="3" >Time Start:</Form.Label>
              <Col sm="3">
                <Form.Control
                  type        = "time"
                  placeholder = "Starting Time"
                  name        = "startingTime"
                  onChange    = {this.handleChange}
                  value       = {this.state.startingTime}
                  onKeyPress  = {this.handleChange}
                  disabled    = {( this.state.rate === "" ) ? true : false } />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formET">
              <Col sm="3">
                <Form.Label>Time End:</Form.Label>
              </Col>
              <Col sm="3">
                <Form.Control                
                  type        = "time"
                  placeholder = "Ending Time"
                  name        = "endingTime"
                  onChange    = {this.handleChange}
                  value       = {this.state.endingTime}
                  onKeyPress  = {this.handleChange}
                  disabled    = {( this.state.rate === "" ) ? true : false } />
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
                  type        = "number"
                  placeholder = { this.state.rate || "Rate ($)"}
                  name        = "rate"
                  onChange    = {this.handleChange}
                  onKeyPress  = {this.handleChange}
                  value       = {this.state.rate}
                  disabled    = {( this.state.rate === "" ) ? true : false } />
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
                disabled    = {( this.state.rate === "" ) ? true : false } />
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
