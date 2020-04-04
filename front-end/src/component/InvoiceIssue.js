import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";
import PdfModal from "./PdfModal.js";
import * as formatDate from "./aux/formatDate.js";

/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */

class InvoicesIssue extends Component {

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
        message           : "Select a client.",
        classNameMessage  : "messageFailure"
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
            clientId
          });
        } else {
          this.setState({
            message           : "No Invoices for this period.",
            classNameMessage  : "messageFailure",
            tableVisibility   : false
          });
        }


      } catch(err) {
        this.setState({
          message           : err.message,
          classNameMessage  : "messageFailure"
       });
      }
    }
    this.clearMessage();
  }



renderDataTable = (invoices) => {
  return invoices.map((invoice, index) => {
    const invoiceToSend = {
      num         : index + 1,
      date        : formatDate.show(invoice.date),
      totalCad    : Number(invoice.cad_adjustment) || Number(invoice.total_cad),
      code        : invoice.code,
      status      : invoice.status
    }

    return (
      <tr key={invoiceToSend.num} onClick={() => this.invoiceEdit(invoice)}>
        <td>{invoiceToSend.num}</td>
        <td>{invoiceToSend.date}</td>
        <td>{invoiceToSend.totalCad.toFixed(2)}</td>
        <td>{invoiceToSend.code}</td>
        <td>{invoiceToSend.status}</td>
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




  render() {
    return (
      <div className="formPosition">
        <br />
        {this.state.openInvoiceModal ?
          <PdfModal
            invoice           = { this.state.invoice }
            client            = { this.state.client }
            closeModal        = { this.closeModal }
            user              = { this.props.user }
            openInvoiceModal  = { this.state.openInvoiceModal }
         />
        : "" }
        
        <Card className="card-settings">
          <Card.Header>Invoice's Issue</Card.Header>
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

          <Card.Footer className= { this.state.classNameMessage}>          
            { this.state.message
              ? this.state.message
              : <br /> }
          </Card.Footer>
          <br />

          <div className="d-flex flex-column">
            <Button 
              variant   = "primary" 
              type      = "submit" 
              onClick   = { this.handleGetInvoices } 
              ref       = {input => this.getInvoicesBtn = input }  >
              Get Invoices
            </Button>
          </div>
            
          </Form>
        </Card.Body>
      </Card>


      { this.state.tableVisibility
          ?
            <Card className="cardInvoiceGenListofInvoices">
              {/* <Form.Label className="cardLabel">Client: {this.state.client.nickname}</Form.Label> */}
              <Card.Header style={{textAlign: "center"}}>
                Client: <b>{this.state.client.nickname}</b>, {`  `}
                <b>{this.state.invoiceList.length}</b> {this.state.invoiceList.length > 1 ? "Invoices" : "Invoice"}
              </Card.Header>

              {(this.state.invoiceList.length > 0) 
                ? 
                  <div>
                    <Table striped bordered hover size="sm" responsive>
                      <thead>
                        <tr style={{textAlign: "center", verticalAlign: "middle"}}>
                          <th>#</th>
                          <th>Date</th>
                          <th>CAD$</th>
                          <th>Code</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody style={{textAlign: "center"}}>
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
    storeToken  : store.token,
    user        : store
  };
};



export default connect(mapStateToProps, null)(InvoicesIssue);
