import React, { useState, useRef, useEffect } from 'react';
import Button   from 'react-bootstrap/Button';
import Form     from 'react-bootstrap/Form';
import Card     from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import MaskedInput from 'react-text-mask';
import { findDOMNode } from "react-dom";
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

function SignUp(props) {

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
  const refTop              = useRef(null);
  const refName             = useRef(null);
  const refEmail            = useRef(null);
  const refCity             = useRef(null);
  const refAddress          = useRef(null);
  const refPhone            = useRef(null);
  const refPC1              = useRef(null);
  const refPC2              = useRef(null);
  const refPassword         = useRef(null);
  const refConfirmPassword  = useRef(null);
  const refButtonSubmit     = useRef(null);

  const [disableForm, setdisableForm] = useState(false);
  const [pcOutsideCanada, setpcOutsideCanada] = useState(false);
  const [message, setmessage] = useState({
    content   : "",
    cssClass  : ""
  });
  const [leave, setleave] = useState(false);
  const [emailValid, setemailValid] = useState(true);
  const [nameValid, setnameValid] = useState(true);
  const [changePC, setchangePC] = useState(false);


  const handleChange = event => {
    const key = event.key;
    const { name, value } = event.target;
    
    if (key === "Enter") {
      event.preventDefault();
      switch (name){
        case "name":
          if (state.name)
            refEmail.current.focus();
          break;
        case "email":
          if (state.email) {
            refCity.current.focus();
          }
          break;
        case "city":
          refAddress.current.focus();
          break;
        case "address":
          pcOutsideCanada ? refPC2.current.focus() : refPC1.current.focus();
          break;
        case "postalCode":
          refPhone.current.focus();
          break;
        case "phone":
          refPassword.current.focus();
          break;
        case "password":
          if (state.password)
            refConfirmPassword.current.focus();
          break;
        case "confirmPassword":
          if (state.confirmPassword)
            refButtonSubmit.current.click();
          break;
        default:
          console.log("it's default")
      }
    }

    setstate({ ...state, [name]: value });
    name === "name" && setnameValid(true);
    name === "email" && new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(value) && setemailValid(true);

  };


  const handlePostalCode = event => {
    const newValue = event.target.value;
    setstate({
      ...state,
      postalCode: isNaN(newValue) ? newValue.toUpperCase() : newValue 
    });
  }


  const onChangePCOutsideCanada = () => {
    setchangePC(true);
    setpcOutsideCanada(!pcOutsideCanada);
    pcOutsideCanada ? refPC2.current.focus() : refPC1.current.focus();
  }


  useEffect(() => {
    if (changePC) {
      pcOutsideCanada ? refPC2.current.focus() : refPC1.current.focus();
      let count = 0;
      for (let x = (state.postalCode.length - 1); x >= 0; x-- ) {
        if (state.postalCode[x] === "_" || state.postalCode[x] === " ") count++;
        else break;
      }
      setstate({ ...state, postalCode: state.postalCode.slice(0, state.postalCode.length - count)})

    } 
  }, [pcOutsideCanada, setpcOutsideCanada]);


  const handleSubmit = async e => {
    e.preventDefault();

    if (state.email !== "" && state.name !== "") {
      if ((state.password !== state.confirmPassword) || (state.password === "")) {
        setmessage({
          content   :  `Password and Confirm Password fields MUST be the same and NOT empty.`,
          cssClass  : "messageFailure"
        });
        refPassword.current.focus();
      } else if (state.phone !== "" 
              &&  ((!Number(state.phone.substring(1,4)))
                || (!Number(state.phone.substring(6,9))) 
                || (!Number(state.phone.substring(10,14))))) { 
        setmessage({
          content   :  "Phone has to have 10 numbers or empty.",
          cssClass  : "messageFailure"
        });
      } else {
        setdisableForm(true);

        const url = "/user/signup";
        const createUser  = {
          name        : state.name,
          email       : state.email,
          password    : state.password,
          address     : state.address,
          city        : state.city,
          postalCode  : state.postalCode,
          phone       : state.phone
        }

        try {
          const addUser = await axios.post(url, createUser);
          if (addUser.data.message) {
            const user = {
              id      : addUser.data.user._id,
              name    : addUser.data.user.name,
              email   : addUser.data.user.email,
              token   : addUser.data.token,
              address     : addUser.data.user.address,
              city        : addUser.data.user.city,
              postalCode  : addUser.data.user.postal_code,
              phone       : addUser.data.user.phone
            };
            props.dispatchLogin({ user });
            setleave(true);
          } else if (addUser.data.error) {
            console.log("it THROWS an ERROR")
            throw(addUser.data.error)
          }

        } catch(err) {
          setmessage({
            content   :  err,
            cssClass  : "messageFailure"
          });
          setdisableForm(false);
        }
      }
    } else {
      setmessage({
        content   :  "Please, entry at least Name, Email, Password and Confirm Password",
        cssClass  : "messageFailure"
      });
      refTop.current.scrollIntoView({ behavior: "smooth" });
      state.name ? refEmail.current.focus() : refName.current.focus();
      setdisableForm(false);
    }
  }


  return (
    <React.Fragment>
      { leave && <Redirect to = "/" />}
    <div className="formPosition">
      <br />
      <Card className="card-settings">
        <Card.Header
          ref = { refTop}
        >
          <h2>Sign Up</h2>
        </Card.Header>
        <Form 
          onSubmit  = { handleSubmit} 
          style     = {{ width: window.innerWidth < 800 || "70%", marginLeft: window.innerWidth < 800 || "15%"}}
          autoComplete  = "nope"
        >

          <br />
          <Form.Group controlId="formName">
            <Form.Label className="cardLabel">Name</Form.Label>
            <Form.Control
              autoFocus   = {true}
              type        = "text"
              placeholder = "User's name"
              name        = "name"
              // onChange    = {e => handleChange(e)}
              onChange    = { handleChange}
              value       = {state.name}
              disabled    = { disableForm}
              // onKeyPress  = { e => handleChange(e)}
              onKeyPress  = { handleChange}
              onBlur      = { () => setnameValid(state.name ? true : false) }
              ref         = { refName }
            />
            { !nameValid &&
                <Overlay
                target    = { refName}
                show      = {true}
                placement = "bottom"
                >
                  <Tooltip id={"tooltip-bottom"}>
                    <strong 
                      style={{color: "gold"}}
                      >
                      Please, type a name
                    </strong>
                  </Tooltip>
                </Overlay>
            }
          </Form.Group>

          <Form.Group 
            controlId="formBasicEmail"
            style       = {{marginBottom: "5px"}}
          >
            <Form.Label className="cardLabel">Email address</Form.Label>
            <Form.Control
              type        = "email"
              placeholder = "User's email"
              name        = "email"
              onChange    = { handleChange}
              onKeyPress  = { handleChange}
              value       = {state.email}
              disabled    = { disableForm}
              onBlur      = { () => setemailValid(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(state.email) ? true : false) }
              ref         = { refEmail }
            />
          </Form.Group>
          <Form.Text className="text-muted" style={{marginTop: "2px"}}>
            We'll never share your email with anyone else.
          </Form.Text>
          <Form.Text className="text-muted" style={{marginTop: "0px", marginBottom: "16px"}}>
            Set a real email so you will receive emails from Clockin.js.
          </Form.Text>
          { !emailValid &&
                <Overlay
                target    = { refEmail}
                show      = {true}
                placement = "bottom"
                >
                  <Tooltip id={"tooltip-bottom"}>
                    <strong 
                      style={{color: "gold"}}
                      >
                      Please, type a valid email
                    </strong>
                  </Tooltip>
                </Overlay>
            }
          
          <Form.Group controlId="formCity">
            <Form.Label className="cardLabel">City</Form.Label>
            <Form.Control
              type        = "text"
              placeholder = "Type the user's city"
              name        = "city"
              onChange    = { handleChange}
              onKeyPress  = { handleChange}
              value       = {state.city}
              disabled    = { disableForm}
              ref         = { refCity }
              />
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label className="cardLabel">Address</Form.Label>
            <Form.Control
              type        = "text"
              placeholder = "Type the user's address"
              name        = "address"
              onChange    = { handleChange}
              onKeyPress  = { handleChange}
              value       = {state.address}
              disabled    = { disableForm}
              ref         = { refAddress }
              />
          </Form.Group>

          <Form.Group controlId="formPostalCode">
            <Form.Label className="cardLabel">Postal Code</Form.Label>
            <Form.Check 
              inline 
              label     = " outside Canada"
              checked   = { pcOutsideCanada}
              // onClick   = { () => console.log("PC CLick")}
              // onChange  = { () => console.log("PC Change")}
              type      = "checkbox"
              style     = {{marginLeft: "1rem"}}
              disabled  = { disableForm}
              onChange  = { onChangePCOutsideCanada}
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
                  onKeyPress  = { handleChange}
                  ref         = {input => refPC1.current = findDOMNode(input) }
                />
              : 
                <Form.Control
                  type        = "text"
                  placeholder = {"Enter client's postal code"}
                  name        = "postalCode"
                  onChange    = {e => handleChange(e)}
                  value       = {state.postalCode}
                  disabled    = { disableForm}
                  onKeyPress  = { handleChange}
                  ref         = { refPC2}
                />
            }
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label className="cardLabel">Phone</Form.Label>
            <MaskedInput
              mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
              className   = "form-control"
              placeholder = "Enter your phone number"
              name        = "phone"
              id          = "phone"
              value       = {state.phone}
              onKeyPress  = {e => handleChange(e)}
              disabled    = { disableForm}
              ref         = { input => refPhone.current = findDOMNode(input) }
              />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label className="cardLabel">Password</Form.Label>
            <Form.Control
              type        = "password"
              placeholder = "Password"
              name        = "password"
              onChange    = { handleChange}
              value       = { state.password}
              disabled    = { disableForm}
              onKeyPress  = { handleChange}
              ref         = { refPassword }
              />
          </Form.Group>

          <Form.Group controlId="formConfirmPassword">
            <Form.Label className="cardLabel">Confirm Password</Form.Label>
            <Form.Control
              type        = "password"
              placeholder = "Confirm Password"
              name        = "confirmPassword"
              onChange    = { handleChange}
              value       = {state.confirmPassword}
              disabled    = { disableForm}
              onKeyPress  = { handleChange}
              ref         = { refConfirmPassword }
            />
          </Form.Group>


        <Card.Footer className= { message.cssClass}>          
          { message.content
            ? message.content
            : <br /> }
        </Card.Footer>

        <br />
        <div className="d-flex flex-column">
          <Button 
            variant   = "primary" 
            type      = "submit"
            onClick   = { handleSubmit}      
            disabled  = { disableForm}
            ref       = { refButtonSubmit}
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


const mapDispatchToProps = dispatch => {
  return {
    dispatchLogin: user => dispatch({
      type:"LOGIN",
      data: user })
  }
}


export default connect(null, mapDispatchToProps)(SignUp);
