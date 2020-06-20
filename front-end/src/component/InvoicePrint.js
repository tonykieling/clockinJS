import React, { useState } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form, Row, Col, Table } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";
import { generatePdf } from "./aux/generatePdf.js";
import { show } from "./aux/formatDate.js";
import InvoicePdfModal from "./InvoicePdfModal";

function InvoicesPrint(props) {
  const [formData, setformData] = useState({
    client  : "",
    dtStart : "",
    dtEnd   : "",
    message : "",
    classNameMessage    : "",
    tableVisibility     : false,
    openInvoicePdfModal : false
  });
  const [invoices, setinvoices] = useState({
    invoiceList       : "",
    invoiceListTable  : ""
  });
  const [currentInvoice, setcurrentInvoice] = useState("");


  const handleGetInvoices = async event => {
    event.preventDefault();
    const
      dateStart = formData.dtStart,
      dateEnd   = formData.dtEnd,
      clientId  = formData.client._id ;
    if (!clientId) {
      setformData({
        ...formData,
        message           : "Select a client.",
        classNameMessage  : "messageFailure"
      });
    } else if ( dateStart && dateEnd && dateStart > dateEnd ) {
      setformData({
        ...formData,
        message           : "Date End must be greater than Date Start.",
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
              "Authorization" : `Bearer ${props.storeToken}` }
        });
        if (getInvoices.data.allInvoices){
          setformData({ 
            ...formData,
            tableVisibility   : true,
            message           : "",
            classNameMessage  : "messageSuccess"
          });
          setinvoices({
            invoiceList       : getInvoices.data.allInvoices,
            invoiceListTable  : renderDataTable(getInvoices.data.allInvoices)
          });
        } else {
          throw(getInvoices.data.message);
        }
      } catch(err) {
        setinvoices({
          invoiceList: ""
        });
        setformData({
          ...formData,
          message           : err,
          classNameMessage  : "messageFailure",
          tableVisibility   : false
        });
      }
    }
  }


  const renderDataTable = (invoices) => {
    return invoices.map((invoice, index) => {
      const invoiceToSend = {
        num         : index + 1,
        date        : show(invoice.date),
        totalCad    : Number(invoice.cad_adjustment) || Number(invoice.total_cad),
        code        : invoice.code,
        status      : invoice.status
      }
      return (
        <tr 
          key={invoiceToSend.num} 
          onClick={formData.client.invoice_sample 
                          ? () => issuePdf(invoice)
                          : () => callPdfModal(invoice) }
        >
          <td>{invoiceToSend.num}</td>
          <td>{invoiceToSend.date}</td>
          <td>{invoiceToSend.totalCad.toFixed(2)}</td>
          <td>{invoiceToSend.code}</td>
          <td>{invoiceToSend.status}</td>
        </tr>
      );
    });
  }


  const callPdfModal = invoice => {
    setcurrentInvoice(invoice);
    setformData({ 
      ...formData,
      tableVisibility     : true,
      openInvoicePdfModal : true
    });
  }


  const getClientInfo = client => {
    setformData({
      ...formData,
      client,
      tableVisibility : false,
      message         : "",
      classNameMessage: "messageSuccess"
    });
    setinvoices({
      invoiceList: ""
    });
  }


  const issuePdf = (invoice) => {
    const data = {
      invoice,
      user      : props.user,
      client    : formData.client
    };
    generatePdf(data);
  }


  return (
    <div className="formPosition">
      {formData.openInvoicePdfModal 
        &&
          <InvoicePdfModal
            user        = { props.user}
            client      = { formData.client}
            invoice     = { currentInvoice}
            openModal   = { formData.openInvoicePdfModal}
            closeModal  = { () => setformData({ ...formData, openInvoicePdfModal: false})}
          />
      
      }
      <br />
      <Card className="card-settings">
        <Card.Header>Export an Invoice to a Pdf file</Card.Header>
        <Card.Body>
        <GetClients 
              client            = { formData.client }
              getClientInfo     = { getClientInfo } 
              askInvoiceSample  = { true } />

        <br></br>
        <Form onSubmit={ handleGetInvoices} >

          <Form.Group as={Row} controlId="formST">
            <Form.Label column sm="3" className="cardLabel">Date Start:</Form.Label>
            <Col sm="5">
              <Form.Control
                type        = "date"
                name        = "dtStart"
                onChange    = { e => setformData({ ...formData, dtStart: e.target.value})}
                value       = { formData.dtStart} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formET">
            <Col sm="3">
              <Form.Label className="cardLabel">Date End:</Form.Label>
            </Col>
            <Col sm="5">
              <Form.Control                
                type        = "date"
                name        = "dtEnd"
                onChange    = { e => setformData({ ...formData, dtEnd: e.target.value})}
                value       = {formData.dtEnd}
              />
            </Col>
          </Form.Group>

          <Card.Footer className= { formData.classNameMessage}>
            { invoices.invoiceList && !formData.message
              ?
                formData.client.invoice_sample
                  ?
                    <div style={{textAlign: "left"}}>
                      <ol>
                        <li>Select invoice,</li>
                        <li>Click on the invoice to export, and </li>
                        <li>Find the pdf in your downloads.</li>
                      </ol>
                    </div>
                  :
                    <div style={{textAlign: "left"}}>
                      <ol>
                        <li>Get the invoice,</li>
                        <li>Click on the invoice and check its format, and </li>
                        <li>For a customized invoice, please contact tony.kieling@gmail.com.</li>
                      </ol>
                    </div>
              : formData.message || <br /> }
            </Card.Footer>
            <br />

            <div className="d-flex flex-column">
              <Button 
                variant   = "primary" 
                type      = "submit" 
                onClick   = { handleGetInvoices }
              >
                Get Invoices
              </Button>
            </div>

          </Form>
        </Card.Body>
      </Card>


    { formData.tableVisibility
        ?
          <Card className="cardInvoiceGenListofInvoices">
            <Card.Header style={{textAlign: "center"}}>
              Client: <b>{ formData.client.nickname || formData.client.name }</b>, {" "}
                <b>{invoices.invoiceList.length}</b> {invoices.invoiceList.length > 1 ? "Invoices" : "Invoice"}
            </Card.Header>

            {(invoices.invoiceList.length > 0) 
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
                    {invoices.invoiceListTable}
                  </tbody>
                </Table>
              : null }
          </Card>
        : null }
    </div>
  )
}


const mapStateToProps = store => {
  return {
    storeToken  : store.token,
    user        : store
  };
};



export default connect(mapStateToProps, null)(InvoicesPrint);
