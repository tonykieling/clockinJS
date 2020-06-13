import React, { useState, useRef } from 'react';
import Button   from 'react-bootstrap/Button';
import Form     from 'react-bootstrap/Form';
import Card     from 'react-bootstrap/Card';
// import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
// import axios from "axios";
import MaskedInput from 'react-text-mask';
// import { findDOMNode } from "react-dom";

export default function SignUp() {

  const [state, setstate] = useState({
    name    : "",
    email   : "",
    city    : "",
    address : "",
    phone   : "",
    postalCode      : "",
    password        : "",
    confirmPassword : ""
  });

  const [disableForm, setdisableForm] = useState(false);
  const [pcOutsideCanada, setpcOutsideCanada] = useState(false);
  const [message, setmessage] = useState("");
  const [classNameMessage, setclassNameMessage] = useState("");
  const [btnType, setbtnType] = useState("");
  const [leave, setleave] = useState(false);


  const handleChange = ({ target : { name, value }}) => {
    console.log("name: ", name, "value: ", value);
    setstate({ ...state, [name]: value});
  };

  const handlePostalCode = event => {
    const newValue = event.target.value;
    setstate({
      ...state,
      postalCode: isNaN(newValue) ? newValue.toUpperCase() : newValue 
    });
    console.log("postalCode: ", state.postalCode)
  }

  const handleSubmit = e => {
    e.preventDefault();
    console.log("inside handlesubmit");
    setdisableForm(true);
    setleave(true);
  }


  return (
    <React.Fragment>
      { leave && <Redirect to = "/" />}

    <div className="formPosition">
      <br />
      <Card className="card-settings">
        <Card.Header>
          <h2>Sign Up</h2>
        </Card.Header>
        <Form 
          onSubmit  = { handleSubmit} 
          style     = {{ width: window.innerWidth < 800 || "70%", marginLeft: window.innerWidth < 800 || "15%"}}
          autoComplete  = "nope"
        >

          <br />
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              autoFocus   = {true}
              type        = "text"
              placeholder = "User's name"
              name        = "name"
              onChange    = {e => handleChange(e)}
              value       = {state.name}
              disabled    = { disableForm}
              // onKeyPress  = {this.handleChange}
              // ref         = {input => this.textInput1 = input }
            />
          </Form.Group>

          <Form.Group 
            controlId="formBasicEmail"
            style       = {{marginBottom: "5px"}}
          >
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type        = "email"
              placeholder = "User's email"
              name        = "email"
              onChange    = {e => handleChange(e)}
              value       = {state.email}
              disabled    = { disableForm}
              // onKeyPress  = {this.handleChange}
              // ref         = {input => this.textInput2 = input }
            />
          </Form.Group>
          <Form.Text className="text-muted" style={{marginTop: "2px"}}>
            We'll never share your email with anyone else.
          </Form.Text>
          <Form.Text className="text-muted" style={{marginTop: "0px", marginBottom: "16px"}}>
            Set a real email so you will receive emails from Clockin.js.
          </Form.Text>
          
          <Form.Group controlId="formCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type        = "text"
              placeholder = "Type the user's city"
              name        = "city"
              onChange    = {e => handleChange(e)}
              value       = {state.city}
              disabled    = { disableForm}
              // onKeyPress  = {this.handleChange}
              // ref         = {input => this.textInput3 = input }
              />
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type        = "text"
              placeholder = "Type the user's address"
              name        = "address"
              onChange    = {e => handleChange(e)}
              value       = {state.address}
              disabled    = { disableForm}
              // onKeyPress  = {this.handleChange}
              // ref         = {input => this.textInput4 = input }
              />
          </Form.Group>

          <Form.Group controlId="formPostalCode">
            <Form.Label className="cardLabel">Postal Code</Form.Label>
            <Form.Check 
              inline 
              label     = " outside Canada"
              checked   = { pcOutsideCanada}
              type      = "checkbox"
              style     = {{marginLeft: "1rem"}}
              // onClick   = { () => setpcOutsideCanada(!pcOutsideCanada) }
              onChange  = { () => setpcOutsideCanada(!pcOutsideCanada) }
              disabled    = { disableForm}
                // onChange  = { () => changepcOutsideCanada() }
              // disabled  = {disableBtn}
            />
            { !pcOutsideCanada
              ?
                <MaskedInput
                  mask        = {[/[A-Z]/i, /\d/, /[A-Z]/i, ' ', /\d/, /[A-Z]/i, /\d/]}
                  className   = "form-control"
                  placeholder = "Enter client's postal code"
                  name        = "postalCode"
                  value       = {state.postalCode}
                  disabled    = { disableForm}
                  onChange    = { e => handlePostalCode(e)}
                  // ref         = {input => this.textPC1 = findDOMNode(input) }
                />
              : 
                <Form.Control
                  type        = "text"
                  placeholder = {"Enter client's postal code"}
                  name        = "postalCode"
                  onChange    = {e => handleChange(e)}
                  value       = {state.postalCode}
                  disabled    = { disableForm}
                  // onKeyPress  = {this.handleChange}
                  // ref         = {this.textPC2}
                />
            }
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <MaskedInput
              mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
              className   = "form-control"
              placeholder = "Enter your phone number"
              name        = "phone"
              id          = "phone"
              // onBlur      = {e => this.afterChange(e)}
              value       = {state.phone}
              onKeyPress  = {e => handleChange(e)}
              disabled    = { disableForm}
              // ref         = {input => this.textInput6 = input }
              // alwaysShowMask = {true}
              />
          </Form.Group>



          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type        = "password"
              placeholder = "Password"
              name        = "password"
              onChange    = { e => handleChange(e)}
              value       = { state.password}
              disabled    = { disableForm}
              // onKeyPress  = {this.handleChange}
              // ref         = {input => this.textInput7 = input }
              />
          </Form.Group>

          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type        = "password"
              placeholder = "Confirm Password"
              name        = "confirmPassword"
              onChange    = {e => handleChange(e)}
              value       = {state.confirmPassword}
              disabled    = { disableForm}
              // onKeyPress  = {this.handleChange}
              // ref         = {input => this.textInput8 = input }
              />
          </Form.Group>


        <Card.Footer className= { classNameMessage}>          
          { message
            ? message
            : <br /> }
        </Card.Footer>

        <br />
        <div className="d-flex flex-column">
          <Button 
            variant = "primary" 
            type    = {btnType}
            onClick = {handleSubmit}              
            disabled    = { disableForm}
          >
            Submit
          </Button>
        </div>

        </Form>
      </Card>
    <br></br>
    <br></br>
  </div>
  </React.Fragment>

  )
}
