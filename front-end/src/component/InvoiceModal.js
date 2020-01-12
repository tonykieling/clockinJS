import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";

// import GetClients from "./aux/GetClients.js";
import ReactModal from "react-modal";



ReactModal.setAppElement('#root');

const user = {
  name: "bob",
  password: "bob"
}

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



class InvoiceModal extends Component {

  state = {
    dateStart         : "",
    dateEnd           : "",
    clientId          : "",
    invoiceList       : [],
    client            : "",
    invoiceListTable  : "",
    tableVisibility   : false,
    message           : "",

    showModal         : true
  };


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }



renderDataTable = (invoices) => {
  // date date_start date_end notes total_cad status
  return invoices.map((invoice, index) => {
    const date  = new Date(invoice.date);
    const invoiceToSend = {
      num         : index + 1,
      date        : (date.getUTCDate() > 10 
                      ? date.getUTCDate()
                      : "0" + date.getUTCDate()) + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear(),
      totalCad    : invoice.total_cad,
      code        : invoice.code,
      status      : invoice.status
    }

    return (
      <tr key={invoiceToSend.num} onClick={() => this.test()}>
        <td>{invoiceToSend.num}</td>
        <td>{invoiceToSend.date}</td>
        <td>${invoiceToSend.totalCad}</td>
        <td>{invoiceToSend.code}</td>
        <td>{invoiceToSend.status}</td>
        {/* <td>
          <Button
            variant   = "info"
            onClick   = {() => this.handleDelete(invoice._id, invoiceToSend.num)}
            // variant   = "info"
            // onClick   = {() => this.handleCallEdit(userToSend)}    // call modal to edit the invoice without invoice related to
            // data-user = {JSON.stringify(userToSend)}
          > Edit</Button>
        </td> */}
      </tr>
    )
  })
}  

  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message     : "",
        invoiceCode : ""
      });
    }, 3500);
  }


  handleCloseModal = () => {
    this.setState({
      showModal: false
    });
  }




  render() {
    return (
      <ReactModal
        isOpen = {this.state.showModal}
        style = {customStyles}
        // contentLabel = {"react model test"}
      >
        <h1>Modal</h1>
        <h3>Form</h3>
          <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                  <Form.Label>User / Email address</Form.Label>
                  <Form.Control
                      type="name"
                      placeholder="Type the user's name"
                      name="name"
                      onChange={this.handleChange}
                      value={this.state.name}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                  />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="danger" onClick={this.handleCloseModal}>
                Close Modal
              </Button>
          </Form>
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
