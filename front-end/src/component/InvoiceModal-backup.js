import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, ButtonGroup, Form, Col, Table } from "react-bootstrap";

import InvoiceChangeStatusModal from "./InvoiceChangeStatusModal.js";
import ReactModal from "react-modal";
import * as formatDate from "./aux/formatDate.js";

ReactModal.setAppElement('#root');

const customStyles = window.innerWidth < 800 
  ? { 
      content : {
        // width: "50%",
        height: "95%",
        // left: "0",
        // top: "0"
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        overflow              : 'scroll'  
      } 
    }
  : { 
      content : {
        // width: "50%",
        height: "80%",
        // left: "0",
        // top: "0"
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        overflow              : 'scroll'  
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
    changeStatusModal : false,
    currentStatus     : this.props.invoice.status,
    updateYN          : false
  };



  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
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



  componentDidMount = async() => {
    const
      dateStart = this.props.invoice.date_start,
      dateEnd   = this.props.invoice.date_end,
      clientId  = this.props.client._id;

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
    this.setState({
      changeStatusModal: true
    });
  }



  handleDeleteInvoice = () => {
    console.log("It is gonna delete Invoice SOON");
  }


  /**
   // this call is an old one.
   now it is being done by valling formatDate.show, importing from the file ../aux/formatDate.js
   */

//   formatDate = incomingDate => {
// console.log("===> incomingDate", incomingDate);
//     const date = new Date(incomingDate);
// console.log("===", date, "=", date.toUTCString());
// // the error is because month is taking the date before convert it to UTC
// // solved with the below code
// // need to create a function componenet to have this as a pattern for each date in the system, i.e. "Jan 01, 2020"
//     // const month = date.toLocaleString('default', { month: 'short' });
//     const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// // console.log("month", month);
//     const day = date.getUTCDate() > 9 ? date.getUTCDate() : `0${date.getUTCDate()}`;
//     // return(date.getUTCDate() > 9
//     //     ? `${month} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
//     //     : `${month} 0${date.getUTCDate()}, ${date.getUTCFullYear()}` );
//     return(`${month[date.getUTCMonth()]} ${day}, ${date.getUTCFullYear()}`);
//     // return(`${date}`);
//   }


  renderDataTable = clockins => {
    return clockins.map((clockin, index) => {
      // const date = new Date(clockin.date);
      const ts = new Date(clockin.time_start);
      const te = new Date(clockin.time_end);  
      const clockinsToSend = {
        num         : index + 1,
        // date        : this.formatDate(clockin.date),
        date        : formatDate.show(clockin.date),
        timeStart   : ts.getUTCHours() + ":" + (ts.getUTCMinutes() < 10 ? ("0" + ts.getUTCMinutes()) : ts.getUTCMinutes()),
        timeEnd     : te.getUTCHours() + ":" + (te.getUTCMinutes() < 10 ? ("0" + te.getUTCMinutes()) : te.getUTCMinutes()),
        totalTime   : ((te - ts) / ( 60 * 60 * 1000)),
        total       : ((te - ts) / ( 60 * 60 * 1000)) * (Number(clockin.rate)),
        invoice     : clockin.invoice_id ? clockin.invoice_id : "not yet"
      }
// console.log(index, "clockin data: ", clockinsToSend.date);

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
      changeStatusModal : false
    });
  }


  receiveNewStatus = (newStatus) => {
    this.setState({
      currentStatus : newStatus,
      updateYN      : true
    });
  }


  backToThePrevious = () => {
    this.state.updateYN ? this.props.updateScreen() : this.props.closeModal();
  }



  render() {
    return (
      <ReactModal
        isOpen  = { this.props.openInvoiceModal }
        style   = { customStyles }
        // base = "ModalSettings"
        // className = "ModalSettings"
        // overlayClassName="ModalSettings"
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
                {/* <Form.Label> Date: { this.formatDate(this.props.invoice.date) } */}
                <Form.Label> Date: { formatDate.show(this.props.invoice.date) }
                </Form.Label>
                </Form.Group>
              </Form.Row>

              <Form.Row>
              <Form.Group as={Col} >
                {/* <Form.Label> From: { this.formatDate(this.props.invoice.date_start) }</Form.Label> */}
                <Form.Label> From: { formatDate.show(this.props.invoice.date_start) }</Form.Label>
              </Form.Group>
              <Form.Group>
                {/* <Form.Label> To: { this.formatDate(this.props.invoice.date_end) } */}
                <Form.Label> To: { formatDate.show(this.props.invoice.date_end) }
                </Form.Label>
              </Form.Group>
              </Form.Row>

              <div className="d-flex flex-column">
                <ButtonGroup className="mt-3">
                  <Button
                    style     = { { width: "50%" }}
                    variant   = "info"
                    disabled  = { this.state.currentStatus === "Received" ? true : false }
                    onClick   = { this.handleChangeInvoiceStatus }
                  >{ this.state.currentStatus }</Button>
                  <Button
                    style     = { { width: "50%" }}
                    variant   = "danger"
                    disabled  = { this.state.currentStatus === "Received" ? true : false }
                    onClick   = { this.handleDeleteInvoice }
                  > Delete </Button>
                </ButtonGroup>
              </div>
            </Form>

          </Card.Body>
        </Card>

        { this.state.changeStatusModal
        ?
          <InvoiceChangeStatusModal
            invoice                 = { this.props.invoice }
            closeChangeModal        = { this.closeChangeModal }
            receiveNewStatus        = { this.receiveNewStatus }
            currentStatus           = { this.state.currentStatus }
            openChangeInvoiceModal  = { this.state.changeStatusModal }
          />
        : "" }

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
                { this.state.message }
              </Card.Title>
            </Card>
        }

        <Button
          variant = "primary"
          onClick = { this.backToThePrevious }
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
