import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, ButtonGroup, Form, Row, Col, Table } from "react-bootstrap";

import InvoiceChangeStatusModal from "./InvoiceChangeStatusModal.js";
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



class InvoiceModal extends Component {

  state = {
    dateStart         : "",
    dateEnd           : "",
    clientId          : "",
    invoiceList       : [],
    client            : "",
    invoiceListTable  : "",
    
    clockInListTable  : "",
    tableVisibility   : false,
    message           : "",
    changeStatusModal : false
  };


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }



// renderDataTable = invoices => {
//   // date date_start date_end notes total_cad status
//   return invoices.map((invoice, index) => {
//     const date  = new Date(invoice.date);
//     const invoiceToSend = {
//       num         : index + 1,
//       date        : (date.getUTCDate() > 10 
//                       ? date.getUTCDate()
//                       : "0" + date.getUTCDate()) + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear(),
//       totalCad    : invoice.total_cad,
//       code        : invoice.code,
//       status      : invoice.status
//     }

//     return (
//       <tr key={invoiceToSend.num} onClick={() => this.test()}>
//         <td>{invoiceToSend.num}</td>
//         <td>{invoiceToSend.date}</td>
//         <td>${invoiceToSend.totalCad}</td>
//         <td>{invoiceToSend.code}</td>
//         <td>{invoiceToSend.status}</td>
//         {/* <td>
//           <Button
//             variant   = "info"
//             onClick   = {() => this.handleDelete(invoice._id, invoiceToSend.num)}
//             // variant   = "info"
//             // onClick   = {() => this.handleCallEdit(userToSend)}    // call modal to edit the invoice without invoice related to
//             // data-user = {JSON.stringify(userToSend)}
//           > Edit</Button>
//         </td> */}
//       </tr>
//     )
//   })
// }  

  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message     : "",
        invoiceCode : ""
      });
    }, 3500);
  }



  componentDidMount = async() => {
console.log("this.props.invoice", this.props.invoice);
console.log("this.props.client", this.props.client);
    // event.preventDefault();

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
    console.log("It is gonna change Invoice's status SOON");
    this.setState({
      changeStatusModal: true
    });
  }


  handleDeleteInvoice = () => {
    console.log("It is gonna delete Invoice SOON");
  }


  formatDate = incomingDate => {
    const date = new Date(incomingDate);
    const month = date.toLocaleString('default', { month: 'short' });
    return(date.getUTCDate() > 10 
        ? month + " " + date.getUTCDate() + "," + " " + date.getUTCFullYear()
        : month + " " + "0" + date.getUTCDate() + "," + " " + date.getUTCFullYear());
  }


  renderDataTable = clockins => {
    // moment.locale("en-gb");
    return clockins.map((clockin, index) => {
// console.log("dddd", moment(new Date(clockin.date)).format("LL"));
      // const t = new Date(clockin.date).toLocaleString('en-GB', { timeZone: "UTC" });
      // const date = moment(new Date(t)).format("LL");
      const date = new Date(clockin.date);
      const ts = new Date(clockin.time_start);
      const te = new Date(clockin.time_end);  
      const clockinsToSend = {
        num         : index + 1,
        date        : this.formatDate(date),
        timeStart   : ts.getUTCHours() + ":" + (ts.getUTCMinutes() < 10 ? ("0" + ts.getUTCMinutes()) : ts.getUTCMinutes()),
        timeEnd     : te.getUTCHours() + ":" + (te.getUTCMinutes() < 10 ? ("0" + te.getUTCMinutes()) : te.getUTCMinutes()),
        // rate        : clockin.rate,
        totalTime   : ((te - ts) / ( 60 * 60 * 1000)),
        total       : ((te - ts) / ( 60 * 60 * 1000)) * (Number(clockin.rate)),
        invoice     : clockin.invoice_id ? clockin.invoice_id : "not yet"
      }

      return (
        <tr key={clockinsToSend.num}>
          <td>{clockinsToSend.num}</td>
          {/* <td>{client}</td> */}
          <td>{clockinsToSend.date}</td>
          <td>{clockinsToSend.timeStart}</td>
          <td>{clockinsToSend.timeEnd}</td>
          <td>{clockinsToSend.totalTime}</td>
          {/* <td>{clockinsToSend.rate}</td> */}
          <td>{clockinsToSend.total}</td>
          {/* <td>{clockinsToSend.invoice}</td> */}
          {/*
          ////////////////////MAYBE in the future I can allow delete clocking by this point of the process
          <td>
            <Button
              variant   = "danger"
              onClick   = {() => this.handleDelete(clockin._id, clockinsToSend.num)}
              // variant   = "info"
              // onClick   = {() => this.handleCallEdit(userToSend)}    // call modal to edit the clockin without invoice related to
              // data-user = {JSON.stringify(userToSend)}
            > Delete</Button>
          </td> */}
        </tr>
      )
    })
  }


  closeChangeModal = () => {
    this.setState({
      changeStatusModal: false
    });
  }


  render() {
    return (
      <ReactModal
        isOpen = { true }
        style = {customStyles}
        >

        <Card>
          <Card.Header as="h3">Invoice: { this.props.invoice.code }</Card.Header>
          <Card.Body>
            <Card.Title> Client: { this.props.client.nickname }</Card.Title>

            <Form>
              <Form.Row>
                <Form.Group as={Col} >
                  <Form.Label> Total: ${ this.props.invoice.total_cad }</Form.Label>
                </Form.Group>
                <Form.Group>
                <Form.Label> Date: { this.formatDate(this.props.invoice.date) }
                </Form.Label>
                </Form.Group>
              </Form.Row>

              <Form.Row>
              <Form.Group as={Col} >
                <Form.Label> From: { this.formatDate(this.props.invoice.date_start) }</Form.Label>
              </Form.Group>
              <Form.Group>
                <Form.Label> To: { this.formatDate(this.props.invoice.date_end) }
                </Form.Label>
              </Form.Group>
              </Form.Row>

              <div className="d-flex flex-column">
                <ButtonGroup className="mt-3">
                  <Button
                    variant = "info"
                    onClick = {() => this.handleChangeInvoiceStatus()}
                    // onClick = {() => this.handleChangeInvoiceStatus()}
                  >{this.props.invoice.status}</Button>
                  <Button 
                    variant = "danger"
                    onClick = {() => this.handleDeleteInvoice()}
                  > Delete </Button>
                </ButtonGroup>
              </div>
            </Form>

          </Card.Body>
        </Card>


        { this.state.changeStatusModal 
          ?
            <InvoiceChangeStatusModal
              invoiceStatus = { this.props.invoice.status }
              closeChangeModal    = { this.closeChangeModal }
            />
          :
            ""
        }

        {this.state.tableVisibility 
          ?
            <Card className="cardInvoiceGenListofClockins card">
              <Table striped bordered hover size="sm" responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    {/* <th>Client</th> */}
                    <th>Date</th>
                    <th>Time Start</th>
                    <th>Time End</th>
                    <th>Total Time</th>
                    {/* <th>Rate</th> */}
                    <th>Total CAD$</th>
                    {/* <th>Invoice</th> */}
                  </tr>
                </thead>
                <tbody>
                  {this.state.clockInListTable}
                </tbody>
              </Table>
            </Card>
          :
            <Card>
              <Card.Title>
                {this.state.message}
              </Card.Title>
            </Card>
        }

        <Button
          variant = "primary"
          onClick = { this.props.closeModal }
        >
          Close Window
        </Button>

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
