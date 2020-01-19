import React, { Component } from 'react'
import { connect } from "react-redux";
import { Card, Button, ButtonGroup, Form } from "react-bootstrap";

import ReactModal from "react-modal";

ReactModal.setAppElement('#root');

const customStyles = { 
    content : {
      // width: "50%",
      height: "50%",
      // left: "0",
      // top: "0"
      top                   : '40%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      // overflow              : 'scroll'  } 
    }
  }


const btnStyle = {
  width : "50%"
};

/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */



class InvoiceModal extends Component {

  state = {
    email: ""
  };



  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }



  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message     : "",
        invoiceCode : ""
      });
    }, 3500);
  }


  closeFTModal = () => {
    this.props.closeModal();
  }



  render() {
    return (
      <ReactModal
        isOpen  = { this.props.openFPModal }
        style   = { customStyles }
        // base = "ModalSettings"
        // className = "ModalSettings"
        // overlayClassName="ModalSettings"
        >

        <Card>
          <Card.Header as="h3"> Forget Password </Card.Header>
          <Card.Body>

            <Form>
              <Form.Label>This procedure is going to send an email to reset the password.</Form.Label>
                <Form.Control
                  type        = "email"
                  placeholder = "Type Email to have the password changed"
                  name        = "text"
                  value       = {this.state.email}
                  onChange    = {this.handleChange}
                  onKeyPress  = {this.handleChange}
                />
              <div className="d-flex flex-column">
                <ButtonGroup className="mt-3">
                  <Button
                    variant   = "info"
                    style     = { btnStyle }
                    // disabled  = { this.state.currentStatus === "Received" ? true : false }
                    // onClick   = { this.handleChangeInvoiceStatus }
                  > Reset password </Button>

                  <Button 
                    variant = "danger"
                    style     = { btnStyle }
                    onClick = { this.closeFTModal }
                  > Cancel  </Button>
                </ButtonGroup>
              </div>
            </Form>

          </Card.Body>
        </Card>


        {/* <Button
          variant = "primary"
          onClick = { this.backToThePrevious }
        >
          Close Window
        </Button> */}

      </ReactModal>
    );
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};



export default connect(mapStateToProps, null)(InvoiceModal);
