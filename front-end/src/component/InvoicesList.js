import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";
import InvoiceModal from "./InvoiceModal.js";

/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */



class InvoicesList extends Component {

  state = {
    dateStart         : "",
    dateEnd           : "",
    clientId          : "",
    invoiceList       : [],
    client            : "",
    invoiceListTable  : "",
    tableVisibility   : false,
    message           : "",

    openInvoiceModal  : false,
    invoice           : ""
  }


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleGetInvoices = async event => {
    event.preventDefault();

    const
      dateStart = this.state.dateStart,
      dateEnd   = this.state.dateEnd,
      clientId  = this.state.clientId ;

    if (!this.state.clientId) {
      this.setState({
        message: "Select a client."
      });
      // this.clearMessage();
    } else {
      const url = `/invoice?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;

      try {
        const getInvoices = await axios.get( 
          url,
          {  
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${this.props.storeToken}` }
        });

        if (getInvoices.data.allInvoices){
          this.setState({
            invoiceList       : getInvoices.data.allInvoices,
            invoiceListTable  : this.renderDataTable(getInvoices.data.allInvoices),
            tableVisibility   : true,
            clientId,
            // clockinWithInvoiceCode: this.checkIfThereIsInvoiceCode(getInvoices.data.allInvoices)
          });
        } else {
          this.setState({
            message: "No Invoices for this period."
          });

          // this.clearMessage();
        }


      } catch(err) {
        this.setState({
          message: err.message });
        
        // this.clearMessage();
      }
    }
    this.clearMessage();
  }



renderDataTable = (invoices) => {
  // date date_start date_end notes total_cad status
  return invoices.map((invoice, index) => {
    const date  = new Date(invoice.date);
    const invoiceToSend = {
      num         : index + 1,
      date        : (date.getUTCDate() > 10 
                      ? date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear()
                      : "0" + date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear()),
      totalCad    : invoice.total_cad,
      code        : invoice.code,
      status      : invoice.status
    }

    return (
      <tr key={invoiceToSend.num} onClick={() => this.invoiceEdit(invoice)}>
        <td>{invoiceToSend.num}</td>
        <td>{invoiceToSend.date}</td>
        <td>${invoiceToSend.totalCad}</td>
        <td>{invoiceToSend.code}</td>
        <td>{invoiceToSend.status}</td>
        <td>
          <Button
            variant   = "info"
            onClick   = {() => this.invoiceEdit(invoice)}
            // variant   = "info"
            // onClick   = {() => this.handleCallEdit(userToSend)}    // call modal to edit the invoice without invoice related to
            // data-user = {JSON.stringify(userToSend)}
          > Edit</Button>
        </td>
      </tr>
    );
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


  getClientInfo = client => {
    this.setState({
      client,
      clientId        : client._id,
      disabledIPBtn   : false,
      tableVisibility : false
    });
  }



  checkIfThereIsInvoiceCode = (listOfClockins) => {
    const check = listOfClockins.filter(invoice => invoice.invoice);
    return((check.length > 0) ? true : false)
  }



  invoiceEdit = (invoice) => {
    this.setState({
      openInvoiceModal: true,
      invoice
    });
  }


  closeModal = () => {
    this.setState({
      openInvoiceModal: false
    });
  }


  updateScreen = () => {
    this.closeModal();
    this.getInvoicesBtn.click();
  }



  render() {
    return (
      <div className="formPosition">
        <h3>Invoice's List and Edit</h3>
        <p>.</p>

        {this.state.openInvoiceModal ?
          <InvoiceModal
            invoice           = { this.state.invoice }
            client            = { this.state.client }
            closeModal        = { this.closeModal }
            updateScreen      = { this.updateScreen }
            openInvoiceModal  = { this.state.openInvoiceModal }
         />
        : "" }

        <Card className="card-settings">
        <Card.Body>

         <GetClients 
              client        = { this.state.client }
              getClientInfo = { this.getClientInfo } /> { /* mount the Dropbox Button with all clients for the user */ }

          <br></br>
          <Form onSubmit={this.handleGetInvoices} >

            <Form.Group as={Row} controlId="formST">
              <Form.Label column sm="3" className="cardLabel">Date Start:</Form.Label>
              <Col sm="5">
                <Form.Control
                  type        = "date"
                  name        = "dateStart"
                  onChange    = {this.handleChange}
                  value       = {this.state.dateStart} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formET">
              <Col sm="3">
                <Form.Label className="cardLabel">Date End:</Form.Label>
              </Col>
              <Col sm="5">
                <Form.Control                
                  type        = "date"
                  name        = "dateEnd"
                  onChange    = {this.handleChange}
                  value       = {this.state.dateEnd} />
              </Col>
            </Form.Group>

          <Button 
            variant   = "primary" 
            type      = "submit" 
            onClick   = { this.handleGetInvoices } 
            ref       = {input => this.getInvoicesBtn = input }  >
            Get Invoices
          </Button>

          <span className="invoiceGenMsg">
            {this.state.message}
          </span>

            
          </Form>
        </Card.Body>
      </Card>


      { this.state.tableVisibility
          ?
            <Card className="cardInvoiceGenListofInvoices card">
              <Form.Label className="cardLabel">Client: {this.state.client.nickname}</Form.Label>
              {(this.state.invoiceList.length > 0) 
                ? 
                  <div>
                    <Table striped bordered hover size="sm" responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          <th>Total CAD$</th>
                          <th>Code</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.invoiceListTable}
                      </tbody>
                    </Table>

                  </div>
                : null }
            </Card>
          : null }

          </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};



export default connect(mapStateToProps, null)(InvoicesList);
