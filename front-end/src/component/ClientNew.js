import React, { Component } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from "axios";

import MaskedInput from 'react-text-mask';

class ClientNew extends Component {

  state = {
      name            : "",
      nickname        : "",
      birthday        : "",
      mother          : "",
      mPhone          : "",
      mEmail          : "",
      father          : "",
      fPhone          : "",
      fEmail          : "",      
      consultant      : "",
      cPhone          : "",
      cEmail          : "",
      defaultRate     : "",
      message         : "",
      btnType         : undefined
    }

  handleChange = e => {
    // if (e.key === "Enter")
    //   switch(e.target.name) {
    //     case "name":
    //       if (this.state.name !== "")
    //         this.textInput2.focus();
    //       break;
    //     case "email":
    //       if (this.state.email !== "")
    //         this.textInput4.focus();
    //       break;
    //     case "password":
    //       if (this.state.password !== "")
    //         this.textInput5.focus();
    //       break;
    //     case "confirmPassword":
    //       if (this.state.confirmPassword !== "")
    //         this.setState({ btnType: "submit" });
    //       break;
    //     default:                     
    //   }
// console.log("e.target.name", e.target.name, "e.target.value", e.target.value);
      this.setState({
        [e.target.name]: e.target.value,

        btnType: "Submit"
      });
  }

  handleSubmit = async e => {
    e.preventDefault();

    // if (this.state.name.length > 60) {
    //   alert("Name's maximun length is 60 characters.");
    //   this.textInput1.focus();
    // } else if (this.state.email.length > 60) {
    //   alert("Email's maximun length is 60 characters.");
    //   this.textInput2.focus();
    // } else if (this.state.email !== "" && this.state.name !== "" && this.state.password !== "" && this.state.confirmPassword !== "") {
    //   if (this.state.password !== this.state.confirmPassword) {
    //     alert("Password and \nConfirm Password fields\n\nMUST be the same.");
    //     this.setState({
    //       password        : "",
    //       confirmPassword : ""
    //     })
    //     this.textInput4.focus();
      // } else {
        const url = "/client";
        // const url         = "http://localhost:3333/client";    // this is dev setting
        const createClient  = {
          name        : this.state.name,
          nickname    : this.state.nickname,
          birthday    : this.state.birthday,
          mother      : this.state.mother,
          mPhone      : this.state.mPhone,
          mEmail      : this.state.mEmail,
          father      : this.state.father,
          fPhone      : this.state.fPhone,
          fEmail      : this.state.fEmail,
          consultant  : this.state.consultant,
          cPhone      : this.state.cPhone,
          cEmail      : this.state.cEmail,
          defaultRate : this.state.defaultRate
        }

        try {
          const addClient = await axios.post( 
            url, 
            createClient,
            {  
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${this.props.storeToken}` }
          });

          if (addClient.data.message) {
console.log("client added:", addClient.data);  
            this.setState({
              message: addClient.data.message,

              name        : "",
              nickname    : "",
              birthday    : "",
              mother      : "",
              mPhone      : "",
              mEmail      : "",
              father      : "",
              fPhone      : "",
              fEmail      : "",
              consultant  : "",
              cPhone      : "",
              cEmail      : "",
              defaultRate : ""
            });

          } else if (addClient.data.error) {
            this.setState({
              message : addClient.data.error });
            }
            
          this.clearMessage();

        } catch(err) {
          this.setState({
            message : err.message });

          this.clearMessage();
        }
    }


  //it clears the error message after 3.5s
  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message         : ""
      })
      this.textInput1.focus();
    }, 3500);
  }


  afterChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div>
        <h2>Add New Client Page</h2>
        <Card>
          <Form
            autoComplete  = "off"
            onSubmit      = {this.handleSubmit}
            className     = "formPosition"  >

            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                autoFocus   = {true}
                type        = "text"
                placeholder = "Type the client's name"
                name        = "name"
                onChange    = {this.handleChange}
                value       = {this.state.name}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput1 = input } />
            </Form.Group>

            <Form.Group controlId="formNickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Type the client's nickname"
                name        = "nickname"
                onChange    = {this.handleChange}
                value       = {this.state.nickname}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput2 = input } />
            </Form.Group>

            <Form.Group controlId="formBirthday">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type        = "date"
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
              <MaskedInput
                mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className   = "form-control"
                placeholder = "Enter mother's phone number"
                name        = "mPhone"
                // guide={false}
                id="mPhone"
                onBlur={e => this.afterChange(e)}
                value       = {this.state.mPhone}
                onKeyPress  = {() => this.handleChange}
                ref         = {input => this.textInput5 = input } />
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
                ref         = {input => this.textInput7 = input }  />
            </Form.Group>

            <Form.Group controlId="formFPhone">
              <Form.Label>Father's Phone</Form.Label>
              <MaskedInput
                mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className   = "form-control"
                placeholder = "Enter father's phone number"
                name        = "fPhone"
                // guide={false}
                id          = "fPhone"
                onBlur      = {e => this.afterChange(e)}
                value       = {this.state.fPhone}
                onKeyPress  = {() => this.handleChange}
                ref         = {input => this.textInput8 = input } />
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
              <MaskedInput
                mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className   = "form-control"
                placeholder = "Enter consultant's phone number"
                name        = "cPhone"
                // guide={false}
                id          = "cPhone"
                onBlur      = {e => this.afterChange(e)}
                value       = {this.state.cPhone}
                onKeyPress  = {() => this.handleChange}
                ref         = {input => this.textInput11 = input } />
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
                type        = "number"
                placeholder = "Type the hourly rate - CAD$"
                name        = "defaultRate"
                onChange    = {this.handleChange}
                value       = {this.state.defaultRate}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput13 = input }  />
            </Form.Group>

            <Card.Header className="cardTitle message">          
              { this.state.message
                ? this.state.message
                : <span className="noMessage">.</span> }
            </Card.Header>

            <Button 
              variant = "primary" 
              type    = {this.state.btnType}
              className="gridBtnEdit" 
              >
              Save
            </Button>

            <br></br>
            <br></br>

          </Form>
        </Card>
      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken: store.token
  };
};


export default connect(mapStateToProps, null)(ClientNew)
