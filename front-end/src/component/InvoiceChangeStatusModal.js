import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, ButtonGroup, Form, Row, Col, Table } from "react-bootstrap";

// import GetClients from "./aux/GetClients.js";
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
    dateStart         : "",
    dateEnd           : "",
    clientId          : "",
    invoiceList       : [],
    client            : "",
    invoiceListTable  : "",
    
    message           : ""
  };


  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message     : "",
        invoiceCode : ""
      });
    }, 3500);
  }



  componentDidMount = async() => {
console.log("didMOUNT");
return;
    const
      dateStart = this.props.invoice.date_start,
      dateEnd   = this.props.invoice.date_end,
      clientId  = this.props.clientId;

    const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;

      try {
        const getClockins = await axios.get( 
          url,
          {  
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${this.props.storeToken}` }
        });

        if (getClockins.data.allClockins){
          this.setState({
            clockinList       : getClockins.data.allClockins,
            clockInListTable  : this.renderDataTable(getClockins.data.allClockins),
            tableVisibility   : true
          });
        } else {
          //////////////////it's not suppose to happen and I need to get ride of it
          this.setState({
            message         : getClockins.data.message,
            tableVisibility : false
          });
        }
      } catch(err) {
        this.setState({
          message         : err.message,
          tableVisibility : false
        });
        
      }

  }


  handleChangeInvoiceStatus = () => {
    console.log("It is gonna change Invoice's status SOON\nHEREEEEE");
  }


  render() {
    return (
      <ReactModal
        isOpen = { true }
        style = {customStyles}
        >

        <Card>
          <Card.Header as="h3">Invoice</Card.Header>
          <Card.Body>
            <Card.Title> Change Invoice Status </Card.Title>
            <Card.Text>
              Do you wanna change the Invoice's Status to:
              {/* Do you wanna change the Invoice's Status to { this.props.invoiceStatus === "generated" ? "Delivered" : "Received"}? */}
            </Card.Text>

            <Form>
              <Form.Row>
                <Button
                  variant  = "secondary"
                  disabled = { true } >
                  Generated 
                </Button>
                <Button
                  disabled  = { this.props.invoiceStatus === "generated" ? false : true }
                  variant   = { this.props.invoiceStatus === "generated" ? "primary" : "secondary" }
                  onClick   = { this.handleChangeInvoiceStatus }
                >
                  Delivered
                </Button>
                <Button
                  disabled = { this.props.invoiceStatus === "delivered" ? false : true}
                  variant  = { this.props.invoiceStatus === "delivered" ? "primary" : "secondary" }
                  onClick   = { this.handleChangeInvoiceStatus }
                >
                  Received
                </Button>
                {/* <Form.Group as={Col} >
                  <Form.Label> Total: ${ this.props.invoice.total_cad }</Form.Label>
                </Form.Group>
                <Form.Group>
                <Form.Label> Date: { this.formatDate(this.props.invoice.date) }
                </Form.Label>
                </Form.Group> */}
              </Form.Row>

              {/* <Form.Row>
              <Form.Group as={Col} >
                <Form.Label> From: { this.formatDate(this.props.invoice.date_start) }</Form.Label>
              </Form.Group>
              <Form.Group>
                <Form.Label> To: { this.formatDate(this.props.invoice.date_end) }
                </Form.Label>
              </Form.Group>
              </Form.Row> */}

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
