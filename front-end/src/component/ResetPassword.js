import React, { Component } from 'react';
import { Button, Form, Card, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { matchPath } from "react-router-dom";
import axios from "axios";


class ResetPassword extends Component {

    state = {
      newPassword       : "",
      confirmPassword   : "",
      code              : "",
      url               : "",
      user              : "",
      cancel            : false,
      logged            : false,
      newResetPassword  : false,
      message           : ""
    }


  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    
    // if (e.key === "Enter" && this.state.email !== "") {
    if (e.key === "Enter" && e.target.name === "newPassword" && e.target.value !== "") {
      this.textInput2.focus();
      e.preventDefault();
    } else if (e.key === "Enter" && e.target.name === "confirmPassword" && e.target.value !== "") {
      this.handleSubmit(e);
      e.preventDefault();
    }
  }



  handleSubmit = async event => {
      event.preventDefault();

      if (this.state.newPassword === "")
        alert("New Password and Confirm Password have to be the same and not empty!");
      else if (this.state.newPassword !== this.state.confirmPassword)
        alert("New Password and Confirm Password have to be the same.");
      else {
        const url = `/user${this.state.url}`;

        try {
          const resetPassword = await axios.post( 
            url,
            {
              data: {
                userId      : this.state.user._id,
                newPassword : this.state.newPassword
              }
          });
          
          if (resetPassword.data.message){
            const user  = resetPassword.data.user;
            user.token  = resetPassword.data.token
            this.props.dispatchLogin({ user });
            this.setState({
              logged: true
            });
          } else {
            this.setState({
              message           : resetPassword.data.error,
              classNameMessage  : "messageFailure",
            });
          }
  
        } catch(err) {
          this.setState({
            message: err.message,
            classNameMessage  : "messageFailure",
          });
        }
        this.clearMsg();
      }
  }


  clearMsg = () => {
    setTimeout(() => {
      this.setState({
        message: ""
      })
    }, 3500);
  }

  
  cancelResetPassword = () => {
    this.setState({
      cancel: true
    });
  }


  componentDidMount = async () => {
    const match = matchPath(window.location.pathname, {
      path: '/reset_password/:param',
      exact: true,
      strict: false
    });

    try {
      const url = `/user/get_by_code/${match.params.param}`;
      const getUser = await axios.get( 
        url,
        {
          data: {
            code  : this.state.code
          }
      });

      if (getUser.data.message){
        this.setState({
          user  : getUser.data.user,
          code  : match.params.param,
          url   : match.url
        });
      } else {
        const user = {
          name: "<code is invaild>"
        };

        this.setState({
          user              : getUser.data.code ? getUser.data.user.name : user,
          message           : getUser.data.error,
          classNameMessage  : "messageFailure"
        });

        setTimeout(() => {
          this.setState({
            newResetPassword: true
          });
        }, 5000);        
      }

    } catch(err) {
      this.setState({
        message           : err.message,
        classNameMessage  : "messageFailure",
      });
    }

    this.clearMsg();

  }


  render() {
    return (
      (this.state.cancel || this.state.newResetPassword)
        ? <Redirect to = "/login" />
        : this.state.logged
          ? <Redirect to = "/" />
          :
            <div>
              <div className="formPosition">
                <br />
                <h3>Reset Password</h3>
                <br />
                <p>Hi {this.state.user.name}</p>
                <br />
                <Card className="card-settings">
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>New password</Form.Label>
                      <Form.Control
                        autoFocus   = {true}
                        type        = "password"
                        placeholder = "Type new password"
                        name        = "newPassword"
                        onChange    = {this.handleChange}
                        onKeyPress  = {this.handleChange}
                        value       = {this.state.newPassword}
                        ref         = {input => this.textInput1 = input }
                        />
                      <Form.Text className="text-muted">
                        Never share your password. ;)
                      </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type        = "password"
                        placeholder = "Confirm New Password"
                        name        = "confirmPassword"
                        value       = {this.state.confirmPassword}
                        onChange    = {this.handleChange}
                        onKeyPress  = {this.handleChange}
                        ref         = {input => this.textInput2 = input }
                      />

                    </Form.Group>

                    <Container className = { this.state.classNameMessage }>
                      {this.state.message}
                    </Container>
                    
                    <br />

                    <Button 
                      variant="primary" 
                      type="submit" >
                      Proceed New Password
                    </Button>

                    <Button 
                      variant = "danger"
                      onClick = { this.cancelResetPassword } >
                      Cancel Reset Password
                    </Button>
                  </Form>
                  </Card>
              </div>
            </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchLogin: user => dispatch({type:"LOGIN", data: user })
  }
};

export default connect(null, mapDispatchToProps)(ResetPassword);
