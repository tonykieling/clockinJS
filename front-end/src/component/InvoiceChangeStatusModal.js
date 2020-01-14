import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, ButtonGroup, Form } from "react-bootstrap";
import ReactModal from "react-modal";



ReactModal.setAppElement('#root');


const customStyles = {
  content : {
    // width: "100%",
    // height: "100%",
    // left: "0",
    // top: "0"
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */



class InvoiceChangeStatusModal extends Component {

  state = {
    message           : "",
    newStatus         : this.props.invoice.status === "generated" ? "delivered" : "received"
  };


  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message     : ""
      });
    }, 3500);
  }


  handleChangeInvoiceStatus = async () => {
    console.log("INVOICE info:", this.props.invoice);
    console.log("this.state", this.state);
    
    const data = {
      newStatus: this.state.newStatus
    };

    const url = `/invoice/${this.props.invoice._id}`;
    try {
      const Invoice = await axios.patch( 
        url,
        data,
        {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${this.props.storeToken}` }
      });

      if (Invoice.data.message) {
        this.setState({
          message : `Invoice's status changed!`
        });

        this.props.receiveNewStatus(this.state.newStatus);
        setTimeout(() => {
          this.props.closeChangeModal();
        }, 3500);
      } else {
        this.setState({
          message: "Something wrong happened."
        });
        
        // this.clearMessage();
      }
console.log("Invoice info coming", Invoice);
    } catch(err) {
      console.log("Error:", err.message);
    }

    this.clearMessage();

  }


  render() {
    return (
      <ReactModal
        isOpen = { true }
        style = {customStyles}
        >

        <Card>
          <Card.Header as="h3"> Change Invoice Status </Card.Header>
          <Card.Body>
            <Card.Text>
              Do you wanna change the Invoice's Status to:
            </Card.Text>

            <Form>
            <div className="d-flex flex-column">
              <ButtonGroup className="mt-3">
                <Button
                  variant  = "secondary"
                  disabled = { true } >
                  Generated 
                </Button>
                <Button
                  disabled  = { this.state.newStatus === "delivered" ? false : true }
                  variant   = { this.state.newStatus === "delivered" ? "primary" : "secondary" }
                  onClick   = { this.handleChangeInvoiceStatus }
                >
                  Delivered
                </Button>
                <Button
                  disabled = { this.state.newStatus === "received" ? false : true}
                  variant  = { this.state.newStatus === "received" ? "primary" : "secondary" }
                  onClick   = { this.handleChangeInvoiceStatus }
                >
                  Received
                </Button>
              </ButtonGroup>
            </div>

            <span className="invoiceGenMsg">
              {this.state.message}
            </span>

            <div className="d-flex flex-column">
              <ButtonGroup className="mt-3">
                <Button
                  variant = "success"
                  onClick = { this.handleChangeInvoiceStatus }
                >Yes</Button>
                <Button 
                  variant = "danger"
                  onClick = { this.props.closeChangeModal}
                > No </Button>
              </ButtonGroup>
            </div>
          </Form>

        </Card.Body>
      </Card>

      </ReactModal>
    );
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};



export default connect(mapStateToProps, null)(InvoiceChangeStatusModal);
