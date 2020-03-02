import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, ButtonGroup, Form, Table } from "react-bootstrap";
import InvoiceChangeStatusModal from "./InvoiceChangeStatusModal.js";
import ReactModal from "react-modal";
import { show } from "./aux/formatDate.js";
import InvoiceModalDelete from "./InvoiceModalDelete.js";
import { renderClockinDataTable } from "./aux/renderClockinDataTable.js";
import PunchInModal from "./PunchInModal.js";


const thinScreen = window.innerWidth < 800 ? true : false;
const customStyles = window.innerWidth < 800 
  ? { 
      content : {
        width: "95%",
        height: "85%",
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
        width: "70%",
        maxWidth: "650px",
        height: "75%",
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
    // invoiceList       : [],
    client            : "",
    // invoiceListTable  : "",
    
    clockInListTable  : "",
    tableVisibility   : false,
    message           : "",
    changeStatusModal : false,
    currentStatus     : this.props.invoice.status,
    updateYN          : false,
    showModalDeleteInvoice: false,
    invoiceDeleted    : false,

    dateDelivered     : "",
    dateReceived      : "",
    showClockinModal  : ""
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


  updateInvoice = (status, date) => {
    if (status === "Delivered")
      this.setState({
        currentStatus :  status,
        dateDelivered : status === "Delivered" ? date : "",
        updateYN      : true
      });
    else if (status === "Received")
      this.setState({
        currentStatus :  status,
        dateReceived  : status === "Received" ? date : "",
        updateYN      : true
      });
  }


  componentDidMount = () => {
    this.takeClockinData();
  }


  takeClockinData = async() => {
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
          //////////////////just in case
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


  editClockin = data => {
    this.setState({
      showClockinModal: true,
      clockinToModal  : data
    });
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
      const clockinsToSend = renderClockinDataTable(clockin, index);

      return (
        <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
          <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
          <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
          {/* <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
          <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeEnd}</td> */}
          <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
          <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalCad}</td>
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


  backToThePrevious = () => {
    (this.state.updateYN || this.state.invoiceDeleted)
      ? this.props.updateScreen(this.state.updateYN ? this.state.currentStatus : null)
      : this.props.closeModal();
  }


  setShowModalDeleteInvoice = () => {
    this.setState({
      showModalDeleteInvoice: true
    })
  }


  closeShowModalDeleteInvoice = () => {
    this.setState({
      showModalDeleteInvoice: false
    });
  }


  confirmDeletion = () => {
    this.setState({
      invoiceDeleted: true
    });
  }


  closeClockinModal = () => {
    this.setState({
      showClockinModal: false
    });
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

        {this.state.showClockinModal
          ? <PunchInModal 
              showModal     = { this.state.showClockinModal}
              clockinData   = { this.state.clockinToModal}
              client        = { this.props.client.nickname}
              // deleteClockin = { (clockinId) => console.log("clockin got deleted", clockinId)}
              // deleteClockin = { (clockinId) => this.updateClockins(clockinId)}
              deleteClockin = { false}
              closeModal    = { this.closeClockinModal}
              thinScreen    = { thinScreen}
            />
          : ""}

        <Card>
          <Card.Header as="h3">Invoice: { this.props.invoice.code }</Card.Header>
          <Card.Body>
            <Card.Title style={{fontWeight: "bold", fontSize: "large"}}> Client: { this.props.client.nickname }</Card.Title>
            {/* <Card.Footer style={{fontWeight: "bold", fontSize: "large"}}>
              Client: {this.props.client.nickname}
            </Card.Footer> */}

            <Form>
              <Form.Label style={{left: "2rem"}}> 
                <b>Total: $</b>{ this.props.invoice.total_cad.toFixed(2) }
              </Form.Label>
              <br />
              <Form.Label style={{left: "2rem"}}> 
                {/* <b>Date Start: </b> { formatDate.show(this.props.invoice.date_start) } */}
                <b>Date Start: </b> { show(this.props.invoice.date_start) }
              </Form.Label>
              <br />
              <Form.Label> 
                {/* <b>Date End: </b> { formatDate.show(this.props.invoice.date_end) } */}
                <b>Date End: </b> { show(this.props.invoice.date_end) }
              </Form.Label>
              <br />
              <Form.Label style={{left: "2rem"}}> 
                {/* <b>Date Generated:</b> { formatDate.show(this.props.invoice.date) } */}
                <b>Date Generated:</b> { show(this.props.invoice.date) }
              </Form.Label>

              { (this.props.invoice.date_delivered || this.state.dateDelivered) &&
                  <div>
                    <Form.Label style={{left: "2rem"}}> 
                      {/* <b>Date Delivered:</b> { formatDate.show(this.props.invoice.date_delivered || this.state.dateDelivered) } */}
                      <b>Date Delivered:</b> { show(this.props.invoice.date_delivered || this.state.dateDelivered) }
                    </Form.Label>
                  </div>
              }
              { (this.props.invoice.date_received || this.state.dateReceived) &&
                  <div>
                    <Form.Label style={{left: "2rem"}}> 
                      {/* <b>Date Received:</b> { formatDate.show(this.props.invoice.date_received || this.state.dateReceived) } */}
                      <b>Date Received:</b> { show(this.props.invoice.date_received || this.state.dateReceived) }
                    </Form.Label>
                  </div>
              }

              <div className="d-flex flex-column">
                {this.state.invoiceDeleted
                  ?
                    <Button
                      style     = { { width: "100%" }}
                      variant   = "warning"
                      disabled  = {true}
                    >
                      Invoice has already been deleted.
                    </Button>
                  :
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
                        onClick   = { this.setShowModalDeleteInvoice }
                      > Delete </Button>
                    </ButtonGroup>
                }
              </div>
            </Form>

          </Card.Body>
        </Card>

        { this.state.changeStatusModal
          ?
            <InvoiceChangeStatusModal
              invoice                 = { this.props.invoice }
              closeChangeModal        = { this.closeChangeModal }
              currentStatus           = { this.state.currentStatus }
              openChangeInvoiceModal  = { this.state.changeStatusModal }
              updateInvoice           = { this.updateInvoice}
              dateDelivered           = { this.state.dateDelivered}
              dateReceived            = { this.state.dateReceived}
            />
          : "" 
        }

        {this.state.tableVisibility 
          ?
            <Card className="cardInvoiceGenListofClockinsModal card">
            <Card.Footer style={{fontSize: "x-large", textAlign: "center", fontWeight: "bold"}}>
              Invoice's Clockins List
            </Card.Footer>
              <Table striped bordered hover size="sm" responsive>
                <thead>
                  <tr style={{textAlign: "center"}}>
                    <th style={{verticalAlign: "middle"}}>#</th>
                    <th style={{verticalAlign: "middle"}}>Date</th>
                    {/* <th style={{verticalAlign: "middle"}}>Time Start</th>
                    <th style={{verticalAlign: "middle"}}>Time End</th> */}
                    <th style={{verticalAlign: "middle"}}>Total Time</th>
                    <th style={{verticalAlign: "middle"}}>CAD$</th>
                  </tr>
                </thead>
                <tbody style={{textAlign: "center"}}>
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


        {this.state.showModalDeleteInvoice
          ? <InvoiceModalDelete
              initialState      = { this.state.showModalDeleteInvoice }
              closeDeleteModal  = { this.closeShowModalDeleteInvoice }
              invoiceCode       = { this.props.invoice.code }
              invoiceId         = { this.props.invoice._id }
              confirmDeletion   = { this.confirmDeletion }
            />
          : ""
        }

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
