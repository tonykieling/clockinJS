import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";
import { generatePdf } from "./aux/generatePdf.js";
import { show } from "./aux/formatDate.js";
import InvoicePdfModal from "./InvoicePdfModal";

class InvoicesPrint extends Component {

  state = {
    dateStart         : "",
    dateEnd           : "",
    clientId          : "",
    invoiceList       : [],
    client            : "",
    invoiceListTable  : "",
    tableVisibility   : false,
    message           : "",

    invoice           : "",
    openInvoicePdfModal  : false
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
          // const hasInvoiceSample = this.state.client.invoice_sample ? true : false;

          this.setState({
            invoiceList       : getInvoices.data.allInvoices,
            invoiceListTable  : this.renderDataTable(getInvoices.data.allInvoices),
            tableVisibility   : true,
            clientId

            // classNameMessage  : "messageSuccess",
            // classNameMessage  : `${hasInvoiceSample ? "messageSuccess" : "messageFailure"}`,
            // message           : `${hasInvoiceSample 
            //   ? "Click on the invoice to generate a pdf document and check your download folder." 
            //   // : "Client does not have invoice sample registered. Please contact tony.kieling@gmail.com and ask for it."}`
            //   : "Click in the invoice to a general pdf invoice. Please, contact tony.kieling@gmail.com for any format changes."}`
          });
        } else {
          throw(getInvoices.data.message);
        }
      } catch(err) {
        this.setState({
          message           : err,
          classNameMessage  : "messageFailure"
        });
        this.clearMessage();
      }
    }
  }



renderDataTable = (invoices) => {
  return invoices.map((invoice, index) => {
    const invoiceToSend = {
      num         : index + 1,
      date        : show(invoice.date),
      totalCad    : Number(invoice.cad_adjustment) || Number(invoice.total_cad),
      code        : invoice.code,
      status      : invoice.status
    }

    return (
      <tr key={invoiceToSend.num} onClick={this.state.client.invoice_sample 
                        ? () => this.issuePdf(invoice) 
                        : () => this.setState({ openInvoicePdfModal: true })}>
      {/* <tr key={invoiceToSend.num} onClick={() => this.setState({ openInvoicePdfModal: true })}> */}
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
      tableVisibility : false,
      message         : "",
      classNameMessage: "messageSuccess"
    });
  }



  issuePdf = (invoice) => {
console.log("inside issuePdf")
    if (this.state.client.invoice_sample) {
      const data = {
        invoice,
        user      : this.props.user,
        client    : this.state.client
      };
      generatePdf(data);
    } else {
      console.log("NO INVOICESAMPLE!");

    }
  }


  render() {
    return (
      <div className="formPosition">
        {this.state.openInvoicePdfModal 
          &&
            <InvoicePdfModal
              user        = { this.props.user}
              client      = { this.state.client}
              openModal   = { this.state.openInvoicePdfModal}
              closeModal  = { () => this.setState({ openInvoicePdfModal: false})}
            />
        
        }
        <br />
        <Card className="card-settings">
          <Card.Header>Export an Invoice to a Pdf file</Card.Header>
          <Card.Body>
          <GetClients 
                client            = { this.state.client }
                getClientInfo     = { this.getClientInfo } 
                askInvoiceSample  = { true } />

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
                  value       = {this.state.dateEnd}
                />
              </Col>
            </Form.Group>

            <Card.Footer className= { this.state.classNameMessage} style={{textAlign: "left"}}>
              { this.state.client
                // ? this.state.message
                ?
                  this.state.client.invoice_sample
                    ?
                      <React.Fragment>
                        <ol>
                          <li>Select invoice,</li>
                          <li>Click on the invoice to export, and </li>
                          <li>Find the pdf in your downloads.</li>
                        </ol>
                      </React.Fragment>
                    :
                      <React.Fragment>
                        <ol>
                          <li>Get the invoice,</li>
                          <li>Click on the invoice and check its format, and </li>
                          <li>For a customized invoice, please contact tony.kieling@gmail.com.</li>
                        </ol>
                      </React.Fragment>
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
                Client: <b>{ this.state.client.nickname || this.state.client.name }</b>, {" "}
                  <b>{this.state.invoiceList.length}</b> {this.state.invoiceList.length > 1 ? "Invoices" : "Invoice"}
              </Card.Header>

              {(this.state.invoiceList.length > 0) 
                ? 
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



export default connect(mapStateToProps, null)(InvoicesPrint);
