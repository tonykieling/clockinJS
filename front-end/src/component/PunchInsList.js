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
    dateStart     : "",
    dateEnd       : "",
    clientId      : this.props.storeClientId,
    clockins      : []

  }


  handleChange = event => {
console.log("event", event.target.name, event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleSubmit = async event => {
    event.preventDefault();
console.log("inside onSubmit");

    const
      dateStart = this.state.dateStart,
      dateEnd   = this.state.dateEnd,
      clientId  = this.props.storeClientId ;

    const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;
console.log("url= ", url);
    try {
      const getClockins = await axios.get( 
        url,
        {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${this.props.storeToken}` }
      });
console.log("getClockins", getClockins);

      if (getClockins.data.message) {
        this.setState({
          message: `${getClockins.data.message} -client: ${getClockins.data.client}`
        });
      } else if (getClockins.data.error)
        this.setState({
          message: getClockins.data.error
        });

      this.cleanForm();
      
    } catch(err) {
      this.setState({
        message: err.message });
      
    }
  }


  cleanForm = () => {
    setTimeout(() => {
      this.setState({
        date      : undefined,
        timeStart : undefined,
        timeEnd   : undefined,
        rate      : undefined,
        notes     : undefined,
        message   : undefined
      });
    }, 3000);
  }


  render() {
    return (
      <div>
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
      </div>
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
