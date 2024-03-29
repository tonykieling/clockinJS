import React, { Component } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import ForgetPasswordModal from "./LoginForgetPasswordModal.js";
import axios from "axios";
import ReCaptchaV2 from "react-google-recaptcha";

class Login extends Component {

    state = {
      email     : "",
      password  : "",
      errorMsg  : "",
      disable   : false,
      classNameMessage: "",

      forgetPasswordModal: false,
      reCaptchaToken : ""
    }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errorMsg: ""
    });
    
    if (e.key === "Enter" && e.target.name === "email") {
      if (this.state.email !== "")
        this.textInput2.focus();
    }
  }


  handleSubmit = async event => {
      event.preventDefault();

      if (!this.state.email || !this.state.password) {
        this.setState({
          errorMsg: "Please, type email and password."
        });

        this.textInput1.focus();
      } else {

        this.setState({
          disable: true
        });

        this.setState({
          disable   : true,
          errorMsg  : "Processing...",
          classNameMessage: "messageSuccess",
        });

        await this.refReCaptcha.executeAsync();

        // const url = "https://clockinjs.herokuapp.com/user/login";
        const url = "/api/user";

        const data = {
          whatToDo  : "login",
          email     : this.state.email,
          password  : this.state.password,
          reCaptchaToken  : this.state.reCaptchaToken     
        }

        try {
          const login = await axios.post(
            url,
            data,
          );

          
          const answer = login.data;
          
          if (answer.message) {
            const user = answer.user;
            user.id = user._id;
            user.token = login.data.token;

            await this.props.dispatchLogin( { user });
          } else
            throw(answer.error);
          
        } catch(error) {
          // resets reCaptcha and messages the user

          this.refReCaptcha.reset();

          this.setState({
            disable   : false,
            errorMsg  : error.message || error,
            classNameMessage: "messageFailure"
          });
        }
      }
  };
  

  openModal = event => {
    event.preventDefault();
    this.setState({
      forgetPasswordModal: true
    });
  };


  closeModal = () => {
    this.setState({
      forgetPasswordModal: false
    });
  };

  reCaptchaChange = async token => {
    // console.log("+++inside reCaptchaChange, token:", token);
    this.setState({
      reCaptchaToken: token
    });
  };


  render() {
    return (
      <div className="formPosition">
        <br />

        <ReCaptchaV2
          sitekey   = { process.env.REACT_APP_RECAPTCHA_SITE_KEY }
          onChange  = { this.reCaptchaChange }
          size      = "invisible"
          ref       = { input => this.refReCaptcha = input }
        />

        <Card className="card-settings">
          <Card.Header>
            <h2>Login</h2>
          </Card.Header>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <br />
              <Form.Label>User's Email</Form.Label>
              <Form.Control
                autoFocus   = {true}
                type        = "email"
                placeholder = "Type the user's email"
                name        = "email"
                onChange    = {this.handleChange}
                onKeyPress  = {this.handleChange}
                value       = {this.state.email}
                ref         = {input => this.textInput1 = input }
                />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group 
              controlId   = "formBasicPassword"
              style       = {{marginBottom: "5px"}}
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type        = "password"
                placeholder = "Password"
                name        = "password"
                value       = {this.state.password}
                onChange    = {this.handleChange}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput2 = input }
              />
            </Form.Group>

            <p style = {{
              marginBottom  : "20px", 
              fontStyle     : "italic",
              fontSize      : "0.9rem",
              paddingLeft   : "1rem"}}>
                <a href={window.location.hash} onClick={this.openModal}>
                  Forget password</a></p>


            {this.state.forgetPasswordModal
              ?
                <ForgetPasswordModal
                  openFPModal = { this.state.forgetPasswordModal }
                  closeModal  = { this.closeModal }
                  email       = { this.state.email }
                >
                </ForgetPasswordModal>
              : ""
            }
            
            <Card.Footer className= { this.state.classNameMessage }>
              { this.state.errorMsg
                ? this.state.errorMsg
                : <br /> }
            </Card.Footer>

            <div className="d-flex flex-column">
              <Button 
                variant   ="primary" 
                type      ="submit"
                disabled  = { this.state.disable }
              >
                Submit
              </Button>
            </div>

          </Form>
          </Card>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchLogin: user => dispatch({type:"LOGIN", data: user })
  }
};

export default connect(null, mapDispatchToProps)(Login);
