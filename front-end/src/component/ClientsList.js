import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import {  Card, Button, Form, Container } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import GetClients from "./aux/GetClients.js";
// import DateRangePicker from "./aux/DateRangePicker.js";
import PhoneInput from "./aux/PhoneInput.js";


class ClientsList extends Component {

  state = {
    message       : "",
    clientSelected: false,
  }

  componentDidUpdate(){
    console.log("this.props", this.props);
    this.setState({
      clientName: this.props.storeClientName
    })
  }

  handleChange = event => {
// console.log("inside changes", event.target.value);
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
      const addClockin = await axios.post( 
        url,
        data,
        {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${this.props.storeToken}` }
      });
console.log("addClockin", addClockin);

      if (addClockin.data.message) {
        this.setState({
          message: `${addClockin.data.message} -client: ${addClockin.data.client}`
        });
      } else if (addClockin.data.error)
        this.setState({
          message: addClockin.data.error
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
          Your clients' list
        </h1>
        <p>Select the client in order to check or modify data</p>

        <Card style={{ width: '40rem' }}>
        <Card.Body>
          <Card.Title>Clients:</Card.Title>

         <GetClients />     { /* mount the Dropbox Button with all clients for the user */ }

        </Card.Body>
      </Card>        

      {/* { this.state.clientSelected */}
      { this.props.storeClientId
        ? 
          <div>
            <Card>
              <Form onSubmit={this.handleSubmit}>

                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    // autoFocus   = {true}
                    type        = "text"
                    placeholder = {this.state.clientName || "Type the client's name"}
                    name        = "name"
                    onChange    = {this.handleChange}
                    value       = {this.state.clientName}
                    onKeyPress  = {this.handleChange}
                    // ref         = {input => this.textInput1 = input }
                     />
                </Form.Group>

                <Form.Group controlId="formNickName">
                  <Form.Label>Nickname</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = "Type the client's nickname"
                    name        = "nickName"
                    onChange    = {this.handleChange}
                    // value       = {this.state.clientNickname}
                    defaultValue= {this.props.storeClientNickName}
                    onKeyPress  = {this.handleChange}
                    // ref         = {input => this.textInput2 = input } 
                    />
                </Form.Group>

                <Form.Group controlId="formBirthday">
                  <Form.Label>Birthday</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = "Type the client's birthday"
                    name        = "birthday"
                    onChange    = {this.handleChange}
                    value       = {this.state.birthday}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput3 = input } />
                </Form.Group>

                <Form.Group controlId="formMother">
                  <Form.Label>Mother</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = "Type the client's mother name"
                    name        = "mother"
                    onChange    = {this.handleChange}
                    value       = {this.state.mother}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput4 = input } />
                </Form.Group>

                <Form.Group controlId="formMPhone">
                  <Form.Label>Mother's Phone</Form.Label>
                  {/* <Form.Control
                    type        = "text"
                    placeholder = "Type the mother's phone number"
                    name        = "mPhone"
                    onChange    = {this.handleChange}
                    value       = {this.state.mPhone}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput5 = input }
                  /> */}
                    <PhoneInput
                      placeholder = "Type the mother's phone number" 
                      type        = "text" 
                      className   = "form-control"
                      name        = "mPhone"
                      onChange    = {this.handleChange}
                      value       = {this.state.defaultRate}
                      onKeyPress  = {this.handleChange}
                      // ref         = {input => this.textInput4 = input}
                    />
                </Form.Group>

                <Form.Group controlId="formMEmail">
                  <Form.Label>Mother's Email address</Form.Label>
                  <Form.Control
                    type        = "email"
                    placeholder = "Type the mother's email"
                    name        = "mEmail"
                    onChange    = {this.handleChange}
                    value       = {this.state.mEmail}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput6 = input } />
                </Form.Group>

                <Form.Group controlId="formFather">
                  <Form.Label>Father</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = "Type the client's father name"
                    name        = "father"
                    onChange    = {this.handleChange}
                    value       = {this.state.father}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput7 = input } />
                </Form.Group>

                <Form.Group controlId="formFPhone">
                  <Form.Label>Father's Phone</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = "Type the father's phone number"
                    name        = "fPhone"
                    onChange    = {this.handleChange}
                    value       = {this.state.fPhone}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput8 = input }  />
                </Form.Group>

                <Form.Group controlId="formFEmail">
                  <Form.Label>Father's Email address</Form.Label>
                  <Form.Control
                    type        = "email"
                    placeholder = "Type the father's email"
                    name        = "fEmail"
                    onChange    = {this.handleChange}
                    value       = {this.state.fEmail}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput9 = input } />
                </Form.Group>

                <Form.Group controlId="formConsultant">
                  <Form.Label>Consultant</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = "Type the consultant's name"
                    name        = "consultant"
                    onChange    = {this.handleChange}
                    value       = {this.state.consultant}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput10 = input }  />
                </Form.Group>

                <Form.Group controlId="formCPhone">
                  <Form.Label>Consultant's Phone</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = "Type the consultant's phone number"
                    name        = "cPhone"
                    onChange    = {this.handleChange}
                    value       = {this.state.cPhone}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput11 = input }  />
                </Form.Group>

                <Form.Group controlId="formCEmail">
                  <Form.Label>Consultant's Email address</Form.Label>
                  <Form.Control
                    type        = "email"
                    placeholder = "Type the consultant's email"
                    name        = "cEmail"
                    onChange    = {this.handleChange}
                    value       = {this.state.cEmail}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput12 = input }  />
                </Form.Group>

                <Form.Group controlId="formDefaultRate">
                  <Form.Label>Rate</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = "Type the hourly rate - CAD$"
                    name        = "defaultRate"
                    onChange    = {this.handleChange}
                    value       = {this.state.defaultRate}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput13 = input }  />
                </Form.Group>


                <Button variant="primary" type={this.state.btnType}>
                  Save
                </Button>

                <Container className="msgcolor">
                  {this.state.errorMsg}
                </Container>
              </Form>
            </Card>

          </div>
        : null
      }
      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token,
    storeRate     : store.client_dr,
    storeClientId : store.client_id,

    storeClientName : store.client_name,
    storeClientNickName : store.client_nickname,
    storeClientBirthday : store.client_birthday,
    storeClientMother : store.client_mother,
    storeClientMphone : store.client_mphone,
    storeClientMemail : store.client_memail,
    storeClientFather : store.client_father,
    storeClientFphone : store.client_fphone,
    storeClientFemail : store.client_femail,
    storeClientConsultant : store.client_consultant,
    storeClientCphone : store.client_cphone,
    storeClientCemail : store.client_cemail
  };
};


// const mapDispatchToProps = dispatch => {
//   return {
//     dispatchLogin: user => dispatch({
//       type:"LOGIN",
//       data: user })
//   };
// };


export default connect(mapStateToProps, null)(ClientsList);
