import React, { Component } from 'react';
import { Button, Form, Card, Container } from 'react-bootstrap';
import { connect } from 'react-redux';

class Login extends Component {

    state = {
      email         : "",
      password      : "",
      errorMsg      : ""
    }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    
    if (e.key === "Enter" && this.state.email !== "") {
      if (e.target.name === "email")
        this.textInput2.focus();
    }
  }


  handleSubmit = event => {
      event.preventDefault();

      if (this.state.email !== "" && this.state.password !== "") {
        // const url = "/login"; // if the fetch is being made to the same machine, just consider the API place.
        // const url = "http://localhost:3333/user/login";   // dev setting
        const url = "/user/login";   // dev setting
        // const url = window.location.origin + "/login";
        fetch( url, {  
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
                email     : this.state.email,
                password  : this.state.password
              })
        })
        .then(response => response.json())
        .then((resJSON) => {
          if ('message' in resJSON){
            const user = resJSON.user;
            user.id    = user._id;
            user.token = resJSON.token;
            this.props.dispatchLogin({ user });
          }
          else if ( 'error' in resJSON){
            this.setState({
              errorMsg  : resJSON.error,
              email     : "",
              password  : ""
            });

            // when login fails, it focus in the email field
            this.textInput1.focus();

            //it clears the error message after 3.5s
            this.clearMsg();
          }
        })
        .catch((error) => {
          console.error(error);
          this.setState({errorMsg: error.message});
          this.clearMsg();
        })
      }
  }

  clearMsg = () => {
    setTimeout(() => {
      this.setState({
        errorMsg: ""
      })
    }, 3500);
  }

  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formBasicEmail">
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

            <Form.Group controlId="formBasicPassword">
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
              {/* <p id="errorMsg">{ this.state.errorMsg }</p> */}
            </Form.Group>
            
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Container className="msgcolor">
              {this.state.errorMsg}
            </Container>
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
