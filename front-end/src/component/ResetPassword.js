import React, { Component } from 'react';
import { Button, Form, Card, Container, ButtonGroup } from 'react-bootstrap';
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
      message           : "Processing...",
      classNameMessage  : "messageSuccess",
      flag              : "Processing...",
      disableButton     : true
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
        // const url = `/user${this.state.url}`;
        const url = "/api/user";

        this.setState({
          message         : "Processing...",
          classNameMessage: "messageSuccess",
          disableButton   : true
        });

        try {
          const resetPassword = await axios.post( 
            url,
            {
              userId      : this.state.user._id,
              newPassword : this.state.newPassword,
              whatToDo    : "reset-password"
          });
          
          if (resetPassword.data.message){
            const user  = resetPassword.data.user;
            user.id     = resetPassword.data.user._id;
            user.token  = resetPassword.data.token;

            await this.props.dispatchLogin({ user });

            this.setState({
              logged: true
            });

          } else {
            this.setState({
              message           : resetPassword.data.error,
              classNameMessage  : "messageFailure",
              disableButton     : false,
            });
          }
  
        } catch(error) {
          this.setState({
            message           : error.message,
            classNameMessage  : "messageFailure",
            disableButton     : false
          });
        }
      }
  }

  
  cancelResetPassword = () => {
    this.setState({
      cancel: true
    });
  }


  // this method will receive data from user, after they have clicked in the email with a link to change password
  componentDidMount = async () => {
    const match = matchPath(window.location.pathname, {
      path: '/reset_password/:param',
      exact: true,
      strict: false
    });
    const code = match.params.param;

    try {
      // const url = `/api/user/${code}`;  // req.params  did not work in vercel migration, maybe kz vercel routes

      // const url = "/api/user";
      const url = `/api/user/?code=${code}`; // req.query

      const getUser = await axios.get( 
        url
      );

      if (getUser.data.message){
        this.setState({
          code,
          user    : getUser.data.user,
          url     : match.url,
          flag    : "",
          message : "",
          disableButton : false
        });
      } else {
        const user = {
          name: "<code_is_invaild>"
        };

        this.setState({
          user              : getUser.data.code ? getUser.data.user.name : user,
          message           : getUser.data.error,
          classNameMessage  : "messageFailure",
          flag              : "",
          disableButton     : false
        });
      }

    } catch(err) {
      this.setState({
        message           : err.message,
        classNameMessage  : "messageFailure",
        flag              : ""
      });
    }
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
                <p>Hi <b>{this.state.flag
                        ? <span className="messageSuccess">{this.state.flag}</span>
                        : this.state.user ? this.state.user.name.split(" ")[0] : ""}
                      </b></p>
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
                        Never share your password. ;D
                      </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Confirm New Password</Form.Label>
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

                    <div className="d-flex flex-column">
                      <ButtonGroup className="mt-3">
                        <Button 
                          disabled  = { this.state.disableButton }
                          variant   = "primary" 
                          type      = "submit" 
                        >
                          Submit
                        </Button>

                        <Button 
                          disabled  = { this.state.disableButton }
                          variant   = "danger"
                          onClick   = { this.cancelResetPassword } 
                        >
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </div>
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
