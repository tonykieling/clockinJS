import React, { Component } from 'react'
import axios from "axios";
// import { connect } from "react-redux";
import {  Card, Button, Form, Container } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";
// import DateRangePicker from "./aux/DateRangePicker.js";
// import PhoneInput from "./aux/PhoneInput.js";


class ClientsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message       : "",
      disableEditForm : true
    }
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
      name          : this.state.name,
      nickname      : this.state.nickname,
      birthday      : this.state.birthday,
      mother        : this.state.mother,
      mphone        : this.state.mphone,
      memail        : this.state.memail,
      father        : this.state.father,
      fphone        : this.state.fphone,
      femail        : this.state.femail,
      consultant    : this.state.consultant,
      cphone        : this.state.cphone,
      cemail        : this.state.cemail,
      default_rate  : this.state.default_rate
    };

    const url = "/client";

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
    this.setState({
      disableEditForm: true
    });

    setTimeout(() => {
      this.setState({
        message: undefined
      });
    }, 3000);
  }


  populateForm = client => {
    const {
      name, nickname, birthday, mother, mphone, memail, father, fphone, femail, 
      consultant, cphone, cemail, default_rate } = client;

    this.setState({
      name,
      nickname,
      birthday,
      mother,
      mphone,
      memail,
      father,
      fphone,
      femail,
      consultant,
      cphone,
      cemail,
      default_rate,

      disableEditForm: true
    });
  }


  editForm = () => {
    this.setState({
      disableEditForm: false
    });
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

         <GetClients populateForm = { this.populateForm } />     { /* mount the Dropbox Button with all clients for the user */ }

        </Card.Body>
      </Card>        

      { this.state.name
        ? 
          <div>
            <Card>
              <Form onSubmit={this.handleSubmit}>

                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    // autoFocus   = {true}
                    type        = "text"
                    placeholder = {this.state.name || "Type the client's name"}
                    name        = "name"
                    onChange    = {this.handleChange}
                    value       = {this.state.name}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    // ref         = {input => this.textInput1 = input }
                     />
                </Form.Group>

                <Form.Group controlId="formNickName">
                  <Form.Label>Nickname</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.nickname || "Type the client's nickname"}
                    name        = "nickname"
                    onChange    = {this.handleChange}
                    value       = {this.state.nickname}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    // ref         = {input => this.textInput2 = input } 
                    />
                </Form.Group>

                <Form.Group controlId="formBirthday">
                  <Form.Label>Birthday</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.birthday || "Type the client's birthday"}
                    name        = "birthday"
                    onChange    = {this.handleChange}
                    value       = {this.state.birthday}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput3 = input } />
                </Form.Group>

                <Form.Group controlId="formMother">
                  <Form.Label>Mother</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = { this.state.mother || "Type the client's mother name"}
                    name        = "mother"
                    onChange    = {this.handleChange}
                    value       = {this.state.mother}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput4 = input } />
                </Form.Group>

                <Form.Group controlId="formMPhone">
                  <Form.Label>Mother's Phone</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.mphone || "Type the mother's phone number"}
                    name        = "mphone"
                    onChange    = {this.handleChange}
                    value       = {this.state.mphone}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput5 = input }
                  />
                    {/* <PhoneInput
                      placeholder = {this.state.mphone || "Type the mother's phone number" }
                      type        = "text" 
                      className   = "form-control"
                      name        = "mphone"
                      onChange    = {this.handleChange}
                      value       = {this.state.mphone}
                      onKeyPress  = {this.handleChange}
                      disabled    = {this.state.disableEditForm}
                      // ref         = {input => this.textInput4 = input}
                    /> */}
                </Form.Group>

                <Form.Group controlId="formMEmail">
                  <Form.Label>Mother's Email address</Form.Label>
                  <Form.Control
                    type        = "email"
                    placeholder = {this.state.memail || "Type the mother's email"}
                    name        = "memail"
                    onChange    = {this.handleChange}
                    value       = {this.state.memail}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput6 = input } />
                </Form.Group>

                <Form.Group controlId="formFather">
                  <Form.Label>Father</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.father || "Type the client's father name"}
                    name        = "father"
                    onChange    = {this.handleChange}
                    value       = {this.state.father}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput7 = input } />
                </Form.Group>

                <Form.Group controlId="formFPhone">
                  <Form.Label>Father's Phone</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.fphone || "Type the father's phone number"}
                    name        = "fphone"
                    onChange    = {this.handleChange}
                    value       = {this.state.fphone}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput8 = input }  />
                </Form.Group>

                <Form.Group controlId="formFEmail">
                  <Form.Label>Father's Email address</Form.Label>
                  <Form.Control
                    type        = "email"
                    placeholder = {this.state.femail || "Type the father's email"}
                    name        = "femail"
                    onChange    = {this.handleChange}
                    value       = {this.state.femail}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput9 = input } />
                </Form.Group>

                <Form.Group controlId="formConsultant">
                  <Form.Label>Consultant</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.consultant || "Type the consultant's name"}
                    name        = "consultant"
                    onChange    = {this.handleChange}
                    value       = {this.state.consultant}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput10 = input }  />
                </Form.Group>

                <Form.Group controlId="formCPhone">
                  <Form.Label>Consultant's Phone</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.cphone || "Type the consultant's phone number"}
                    name        = "cphone"
                    onChange    = {this.handleChange}
                    value       = {this.state.cphone}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput11 = input }  />
                </Form.Group>

                <Form.Group controlId="formCEmail">
                  <Form.Label>Consultant's Email address</Form.Label>
                  <Form.Control
                    type        = "email"
                    placeholder = {this.state.cemail || "Type the consultant's email"}
                    name        = "cemail"
                    onChange    = {this.handleChange}
                    value       = {this.state.cemail}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput12 = input }  />
                </Form.Group>

                <Form.Group controlId="formDefaultRate">
                  <Form.Label>Rate</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.default_rate || "Type the hourly rate - CAD$"}
                    name        = "default_rate"
                    onChange    = {this.handleChange}
                    value       = {this.state.default_rate}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput13 = input }  />
                </Form.Group>


                <Button 
                  variant="primary" 
                  // type={this.state.btnType}
                  disabled={this.state.disableEditForm} >
                  Save
                </Button>

                <Button 
                  onClick = { this.editForm } >
                  Edit
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


// const mapStateToProps = store => {
//   return {
//     storeToken    : store.token,
//     storeRate     : store.client_dr,
//     storeClientId : store.client_id,

//     storeClientName : store.client_name,
//     storeClientNickName : store.client_nickname,
//     storeClientBirthday : store.client_birthday,
//     storeClientMother : store.client_mother,
//     storeClientMphone : store.client_mphone,
//     storeClientMemail : store.client_memail,
//     storeClientFather : store.client_father,
//     storeClientFphone : store.client_fphone,
//     storeClientFemail : store.client_femail,
//     storeClientConsultant : store.client_consultant,
//     storeClientCphone : store.client_cphone,
//     storeClientCemail : store.client_cemail
//   };
// };


// const mapDispatchToProps = dispatch => {
//   return {
//     dispatchLogin: user => dispatch({
//       type:"LOGIN",
//       data: user })
//   };
// };


// export default connect(mapStateToProps, null)(ClientsList);
export default ClientsList;
