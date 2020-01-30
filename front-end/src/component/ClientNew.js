import React, { Component } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from "axios";

import MaskedInput from 'react-text-mask';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
      message         : ""
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
        [e.target.name]: e.target.value
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
      if (this.state.name && this.state.nickname) {
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
console.log("client sent: ", createClient);
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
      } else {
        if (!this.state.name)
          this.textInput1.focus();
        else
          this.textInput2.focus();
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


  handleChangeDate = incomingDate => {
    // Im not able to grab e.targe.name and e.target.value
    // console.log("e",e)
    // console.log("e", e.target.name, e.target.selected);
    // console.log("date", date);
    this.setState({
      birthday: incomingDate
    });
    this.textInput4.focus();
  }


  afterChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div className="formPosition">
        <h3>New Client Page</h3>
        <Card className="card-settings">
          <Form
            autoComplete  = "off"
            onSubmit      = {this.handleSubmit}
            className     = "formPosition"  >

            <Form.Group controlId="formName">
              <Form.Label className="cardLabel">Name</Form.Label>
              <Form.Control
                autoFocus   = {true}
                type        = "text"
                placeholder = "Client's name"
                name        = "name"
                onChange    = {this.handleChange}
                value       = {this.state.name}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput1 = input } />
            </Form.Group>

            <Form.Group controlId="formNickname">
              <Form.Label className="cardLabel">Nickname</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Client's nickname"
                name        = "nickname"
                onChange    = {this.handleChange}
                value       = {this.state.nickname}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput2 = input } />
            </Form.Group>

            <Form.Group controlId="formBirthday">
              <Form.Label className="cardLabel">Birthday</Form.Label>
              <Form.Control
                type        = "date"
                placeholder = "Client's birthday"
                name        = "birthday"
                onChange    = {this.handleChange}
                value       = {this.state.birthday}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput3 = input } />
                {/* <br />
                <DatePicker
                  selected  = {this.state.birthday}
                  onSelect  ={this.handleChangeDate}
                  // dateFormat="dd/MM/yyyy"
                  // dateFormat = "MMMM eeee d, yyyy h:mm aa"
                  dateFormat = "MMMM d, yyyy"
                  // onChange = {this.handleChangeDate}
                  className = "form-control"
                  disabled  = {this.state.disableEditForm}
                />
                <br /> */}
            </Form.Group>

            <Form.Group controlId="formMother">
              <Form.Label className="cardLabel">Mother</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Client's mother name"
                name        = "mother"
                onChange    = {this.handleChange}
                value       = {this.state.mother}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput4 = input } />
            </Form.Group>

            <Form.Group controlId="formMPhone">
              <Form.Label className="cardLabel">Mother's Phone</Form.Label>
              <MaskedInput
                mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className   = "form-control"
                placeholder = "Mother's phone number"
                name        = "mPhone"
                // guide={false}
                id="mPhone"
                onBlur={e => this.afterChange(e)}
                value       = {this.state.mPhone}
                onKeyPress  = {() => this.handleChange}
                ref         = {input => this.textInput5 = input } />
            </Form.Group>

            <Form.Group controlId="formMEmail">
              <Form.Label className="cardLabel">Mother's Email address</Form.Label>
              <Form.Control
                type        = "email"
                placeholder = "Mother's email"
                name        = "mEmail"
                onChange    = {this.handleChange}
                value       = {this.state.mEmail}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput6 = input } />
            </Form.Group>

            <Form.Group controlId="formFather">
              <Form.Label className="cardLabel">Father</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Client's father name"
                name        = "father"
                onChange    = {this.handleChange}
                value       = {this.state.father}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput7 = input }  />
            </Form.Group>

            <Form.Group controlId="formFPhone">
              <Form.Label className="cardLabel">Father's Phone</Form.Label>
              <MaskedInput
                mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className   = "form-control"
                placeholder = "Father's phone number"
                name        = "fPhone"
                // guide={false}
                id          = "fPhone"
                onBlur      = {e => this.afterChange(e)}
                value       = {this.state.fPhone}
                onKeyPress  = {() => this.handleChange}
                ref         = {input => this.textInput8 = input } />
            </Form.Group>

            <Form.Group controlId="formFEmail">
              <Form.Label className="cardLabel">Father's Email address</Form.Label>
              <Form.Control
                type        = "email"
                placeholder = "Father's email"
                name        = "fEmail"
                onChange    = {this.handleChange}
                value       = {this.state.fEmail}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput9 = input } />
            </Form.Group>

            <Form.Group controlId="formConsultant">
              <Form.Label className="cardLabel">Consultant</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Consultant's name"
                name        = "consultant"
                onChange    = {this.handleChange}
                value       = {this.state.consultant}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput10 = input }  />
            </Form.Group>

            <Form.Group controlId="formCPhone">
              <Form.Label className="cardLabel">Consultant's Phone</Form.Label>
              <MaskedInput
                mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className   = "form-control"
                placeholder = "Consultant's phone number"
                name        = "cPhone"
                // guide={false}
                id          = "cPhone"
                onBlur      = {e => this.afterChange(e)}
                value       = {this.state.cPhone}
                onKeyPress  = {() => this.handleChange}
                ref         = {input => this.textInput11 = input } />
            </Form.Group>

            <Form.Group controlId="formCEmail">
              <Form.Label className="cardLabel">Consultant's Email address</Form.Label>
              <Form.Control
                type        = "email"
                placeholder = "Consultant's email"
                name        = "cEmail"
                onChange    = {this.handleChange}
                value       = {this.state.cEmail}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput12 = input }  />
            </Form.Group>

            <Form.Group controlId="formDefaultRate">
              <Form.Label className="cardLabel">Rate</Form.Label>
              <Form.Control
                type        = "number"
                placeholder = "Hourly rate - CAD$"
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

            <div className="d-flex flex-column">
              <Button 
                variant = "primary" 
                type    = "submit"
                >
                Save
              </Button>
            </div>
          </Form>
        </Card>
        <br></br>
        <br></br>
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
