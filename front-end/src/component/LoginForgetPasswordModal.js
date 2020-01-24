import React, { Component } from 'react'
import axios from "axios";

import { Card, Button, ButtonGroup, Form } from "react-bootstrap";

import ReactModal from "react-modal";

ReactModal.setAppElement('#root');

const customStyles = { 
    content : {
      top                   : '40%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  }


const btnStyle = {
  width : "50%"
};

/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */



class ForgetPasswordModal extends Component {

  state = {
    emailFP           : "",
    message           : "",
    classNameMessage  : "",
    disableBtnReset   : false,
    disableBtnCancel  : false,
    label2            : "Cancel"
  };



  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });

    if (event.key === "Enter") {
      event.preventDefault();
      if (this.state.emailFP !== "")
      // if (event.target.name === "emailFP")
        this.resetPasswordBtn.click();
    }
  }


  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message          : "",
        disableBtnReset  : false,
        disableBtnCancel : false
      });
    }, 3500);
  }


  closeFTModal = () => {
    this.props.closeModal();
  }


  
  handleResetPassword = async event => {
    event.preventDefault();

    if (!this.state.emailFP) {
      this.setState({
        message           : "Type a valid email to have the password reseted.",
        classNameMessage  : "messageFailure",
        disableBtnReset   : true,
        disableBtnCancel  : true
      });
      this.resetPasswordEmail.focus();
      this.clearMessage();
    } else {
      const url = `/user/forgetPassword`;

      try {
        const forgetPassword = await axios.post( 
          url,
          {
            data: {
              email: this.state.emailFP
            }
        });
console.log("@@@ forgetPassword", forgetPassword);
        if (forgetPassword.data.message){
          this.setState({
            message           : `If <${this.state.emailFP}> is a valid email, you are about to receive an email with instructions to reset the password.`,
            // message2          : "you are about to receive an email with instructions to reset the password.",
            classNameMessage  : "messageSuccess",
            disableBtnReset   : true,
            label2            : "Close"
          });
        } else {
          this.setState({
            message           : forgetPassword.data.error,
            classNameMessage  : "messageFailure",
          });

          this.clearMessage();
        }


      } catch(err) {
        this.setState({
          message: err.message });
        
        this.clearMessage();
      }
    }
  }


  render() {
    return (
      <ReactModal
        isOpen  = { this.props.openFPModal }
        style   = { customStyles }
        >

        <Card>
          <Card.Header as="h3"> Reset Password </Card.Header>
          <Card.Body>
            <Form>
              <Form.Label>This procedure is going to send an email to reset the password.</Form.Label>
                <Form.Control
                  autoFocus
                  type        = "email"
                  placeholder = "Type the Email"
                  name        = "emailFP"
                  value       = {this.state.emailFP}
                  onChange    = {this.handleChange}
                  onKeyPress  = {this.handleChange}
                  ref         = {input => this.resetPasswordEmail = input }
                  />

              <Card.Text
                className = { this.state.classNameMessage }>
                { this.state.message }
              </Card.Text>


              <div className="d-flex flex-column">
                <ButtonGroup className="mt-3">
                  <Button
                    variant   = "info"
                    style     = { btnStyle }
                    disabled  = { this.state.disableBtnReset }
                    onClick   = { this.handleResetPassword }
                    ref       = {input => this.resetPasswordBtn = input }
                    > Reset password </Button>

                  <Button 
                    variant = "danger"
                    disabled  = { this.state.disableBtnCancel }
                    style     = { btnStyle }
                    onClick = { this.closeFTModal }
                  > { this.state.label2 }  </Button>
                </ButtonGroup>
              </div>
            </Form>

          </Card.Body>
        </Card>

      </ReactModal>
    );
  }
}


export default ForgetPasswordModal;
