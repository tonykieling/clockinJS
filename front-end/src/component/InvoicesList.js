import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";
import InvoiceModal from "./InvoiceModal.js";
import * as formatDate from "./aux/formatDate.js";


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
        message           : "Select a client.",
        classNameMessage  : "messageFailure"
      });
      // this.clearMessage();
    } else {
      // const url = `/invoice?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;
      const url = `/api/invoice?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;


      try {
        this.setState({
          message           : "Processing...",
          classNameMessage  : "messageSuccess"
        });

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
            message           : "",
            clientId,
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
  let totalCadReceived  = 0;
  let totalCadDelivered = 0;
  let totalCadGenerated = 0;
  let totalCad          = 0;


  const result = invoices.map((invoice, index) => {
    const invoiceToSend = {
      num         : index + 1,
      date        : formatDate.show(invoice.date),
      totalCad    : Number(invoice.cad_adjustment) || Number(invoice.total_cad),
      code        : invoice.code,
      status      : invoice.status
    }

    totalCad += invoiceToSend.totalCad;
    if (invoiceToSend.status === "Generated")
      totalCadGenerated += invoiceToSend.totalCad;
    else if (invoiceToSend.status === "Delivered")
      totalCadDelivered += invoiceToSend.totalCad;
    else if (invoiceToSend.status === "Received")
      totalCadReceived += invoiceToSend.totalCad;

    return (
      <tr key={invoiceToSend.num} onClick={() => this.invoiceEdit(invoice)}>
        <td>{invoiceToSend.num}</td>
        <td>{invoiceToSend.date}</td>
        <td>{invoiceToSend.totalCad.toFixed(2)}</td>
        <td>{invoiceToSend.code}</td>
        <td>{invoiceToSend.status}</td>
        {/* <td>
          <Button
            variant   = "info"
            onClick   = {() => this.invoiceEdit(invoice)}
          > Edit</Button>
        </td> */}
      </tr>
    );
  });

  const addTotal = (
    // something curious: React.Fragment need a key as well,
    // but, I realized that for PunchinList, the key prop does not complain.. 
    // maybe it is because here, the trs are under the fragmente, and so the fragment need the key
    <React.Fragment key = {totalCad}>
      <tr key = {totalCad + 1} style={{background: "gainsboro"}}>
        <td colSpan="5"></td>
      </tr>
      

      {/*generated total*/}
      <tr key = {totalCad + 5}>
        <td colSpan="2" style={{textAlign: "left", paddingLeft: "2rem"}}><b>Generated</b></td>
        <td 
          colSpan="3" 
          style={{verticalAlign: "middle", textAlign: "right", paddingRight: "2rem"}}
        >
          <b>{totalCadGenerated.toFixed(2)}</b>
        </td>
      </tr>

      {/*delivered total*/}
      <tr key = {totalCad + 4}>
        <td colSpan="2" style={{textAlign: "left", paddingLeft: "2rem"}}><b>Delivered</b></td>
        <td 
          colSpan="3" 
          style={{verticalAlign: "middle", textAlign: "right", paddingRight: "2rem"}}
        >
          <b>{totalCadDelivered.toFixed(2)}</b>
        </td>
      </tr>

      {/*received total*/}
      <tr key = {totalCad + 3}>
        <td colSpan="2" style={{textAlign: "left", paddingLeft: "2rem"}}><b>Received</b></td>
        <td 
          colSpan="3" 
          style={{verticalAlign: "middle", textAlign: "right", paddingRight: "2rem"}}
        >
          <b>{totalCadReceived.toFixed(2)}</b>
        </td>
      </tr>

      {/*raw total*/}
      <tr key = {totalCad + 2}>
        <td colSpan="2" style={{textAlign: "left", paddingLeft: "2rem"}}><b>Total</b></td>
        <td 
          colSpan="3" 
          style={{verticalAlign: "middle", textAlign: "right", paddingRight: "2rem"}}
        >
          <b>CAD {totalCad.toFixed(2)}</b>
        </td>
      </tr>

    </React.Fragment>
  );

  result.push(addTotal);
  return result;
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


  updateScreen = newStatus => {
    let tempInvoices;

    if (newStatus) {
      tempInvoices = this.state.invoiceList.map(invoice => {
        if (invoice._id === this.state.invoice._id)
          invoice.status = newStatus;

          return invoice;
        });
    } else {
      const invoiceToRemove   = this.state.invoice._id;
      tempInvoices      = this.state.invoiceList.filter( invoice => invoice._id !== invoiceToRemove);
    }
    
    const tempInvoicesTable = this.renderDataTable(tempInvoices);
    this.setState({
      invoiceList       : tempInvoices,
      invoiceListTable  : tempInvoicesTable,
      openInvoiceModal  : false
    });
  }


  updateInvoiceData = data => {
    const tempInvoice = { ...this.state.invoice};
    tempInvoice.code              = data.newInvoiceCode;
    tempInvoice.cad_adjustment    = data.newReceivedAmount;
    tempInvoice.reason_adjustment = data.newReason;

    // update invoiceList
    const newInvoiceList = this.state.invoiceList.map(invoice => (invoice._id === data.invoiceId) ? invoice = tempInvoice : invoice);

    this.setState({
      invoice           : tempInvoice,
      invoiceList       : newInvoiceList,
      invoiceListTable  : this.renderDataTable(newInvoiceList)
    });

  }


  render() {
    return (
      <div className="formPosition">
        <br />
        {this.state.openInvoiceModal ?
          <InvoiceModal
            invoice           = { this.state.invoice }
            client            = { this.state.client }
            closeModal        = { this.closeModal }
            updateScreen      = { this.updateScreen }
            openInvoiceModal  = { this.state.openInvoiceModal }
            changeInvoiceData = { data => this.updateInvoiceData(data)}
            storeToken        = { this.props.storeToken}
         />
        : "" }
        
        <Card className="card-settings">
          <Card.Header>Invoice's List and Edit</Card.Header>
          <Card.Body>
            <div className="gridClientBtContainer">
              <GetClients 
                client        = { this.state.client }
                getClientInfo = { this.getClientInfo }
                invoiceFlag   = { true }
              /> { /* mount the Dropbox Button with all clients for the user */ }
            </div>

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
                  ref       = {input => this.getInvoicesBtn = input }
                >
                  Get Invoices
                </Button>
              </div>
            
          </Form>
        </Card.Body>
      </Card>


      { this.state.tableVisibility
          ?
            <Card className="cardInvoiceGenListofInvoices">
              <Card.Header style={{textAlign: "center"}}>
                Client: <b>{this.state.client.nickname || this.state.client.name}</b>, {" "}
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
    storeToken    : store.token
  };
};



export default connect(mapStateToProps, null)(InvoicesList);
