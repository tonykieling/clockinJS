import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, ButtonGroup, Form, Row, Col } from "react-bootstrap";
import ReactModal from "react-modal";
import * as formatDate from "./aux/formatDate.js";


const customStyles = {
  content : {
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
    message         : "",
    newStatus       : this.props.currentStatus === "Generated" ? "Delivered" : "Received",
    disableButtons  : false,
    classNameMessage: "",
    dateDelivered   : this.props.invoice.date_delivered || this.props.dateDelivered || "",
    dateReceived    : this.props.invoice.date_received || this.props.dateReceived || ""
  };


  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message       : "",
        disableButtons : false
      });
    }, 3500);
  }


  handleChangeInvoiceStatus = async () => {
    const newStatusTemp   = this.state.newStatus;
    const dtGeneratedTemp = new Date(this.props.invoice.date.substring(0,10)).getTime();
    const dtDeliveredTemp = this.state.dateDelivered ? new Date(this.state.dateDelivered.substring(0, 10)).getTime() : null;   
    const dtReceivedTemp  = this.state.dateReceived ? new Date(this.state.dateReceived.substring(0, 10)).getTime() : null;   

    if (!dtDeliveredTemp && !dtReceivedTemp) {
      this.setState({
        message           : "Please, provide date.",
        classNameMessage  : "messageFailure"
      });
    } else if ((newStatusTemp === "Delivered") && (dtDeliveredTemp < dtGeneratedTemp)) {
      // ((newStatusTemp === "Received") && (dtReceivedTemp < dtDeliveredTemp))) {
        this.setState({
          message           : `Delivered date should be greater or equal to ${formatDate.show(dtGeneratedTemp)}.`,
          classNameMessage  : "messageFailure"
        });
        return;
    } else if ((newStatusTemp === "Received") && (dtReceivedTemp < dtDeliveredTemp)) {
        this.setState({
          message           : `Received date should be greater or equal to ${formatDate.show(dtDeliveredTemp)}`,
          classNameMessage  : "messageFailure"
        });
        return;
    } else {
      const data = {
        newStatus     : this.state.newStatus,
        dateDelivered : this.state.dateReceived ? null : this.state.dateDelivered,
        dateReceived  : this.state.dateReceived
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
            message           : `Invoice's status changed to ${this.state.newStatus}`,
            disableButtons    : true,
            classNameMessage  : "messageSuccess"
          });

          // this.props.receiveNewStatus(this.state.newStatus);
          const tempDate = data.dateDelivered || data.dateReceived;
          // const tempDate = this.state.dateDelivered || this.state.dateReceived;
          this.props.updateInvoice(this.state.newStatus, tempDate);
          setTimeout(() => {
            this.props.closeChangeModal();
          }, 3500);
        } else {
          this.setState({
            message           : "Something wrong happened.",
            classNameMessage  : "messageFailure"
          });
          
        }
      } catch(err) {
        console.log("Error:", err.message);
      }
    }

    this.clearMessage();
  }


  handleChange = e => {
    this.setState({
      [e.target.name] : e.target.value,
      message         : ""
    });
  }


  render() {
    return (
      <ReactModal
        isOpen = { this.props.openChangeInvoiceModal }
        style  = { customStyles }
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
                  disabled  = { this.state.disableButtons ? true : this.state.newStatus === "Delivered" ? false : true }
                  variant   = { this.state.newStatus === "Delivered" ? "primary" : "secondary" }
                  onClick   = { this.handleChangeInvoiceStatus }
                >
                  Delivered
                </Button>
                <Button
                  disabled = { this.state.disableButtons ? true : this.state.newStatus === "Received" ? false : true}
                  variant  = { this.state.newStatus === "Received" ? "primary" : "secondary" }
                  onClick   = { this.handleChangeInvoiceStatus }
                >
                  Received
                </Button>
              </ButtonGroup>
            </div>


            <br />
            <Form.Group as={Row} controlId="formDT">
              <Form.Label column sm="5" className="cardLabel">Date {this.state.newStatus}:</Form.Label>
              <Col sm="7">
                <Form.Control
                  type        = "date"
                  name        = {`date${this.state.newStatus}`}
                  onChange    = {this.handleChange}
                  value       = {this.state.newStatus === "Delivered" ? this.state.dateDelivered : this.state.dateReceived} />
              </Col>
            </Form.Group>


            <Card.Footer className= { this.state.classNameMessage}>          
              { this.state.message
                ? this.state.message
                : <br /> }
            </Card.Footer>

            <div className="d-flex flex-column">
              <ButtonGroup className="mt-3">
                <Button
                  variant   = "success"
                  onClick   = { this.handleChangeInvoiceStatus }
                  disabled  = { this.state.disableButtons }
                >Yes</Button>
                <Button 
                  variant   = "danger"
                  onClick   = { this.props.closeChangeModal}
                  disabled  = { this.state.disableButtons }
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
