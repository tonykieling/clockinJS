import React, { Component } from 'react';
// import { connect } from "react-redux";
import { Card, Button, ButtonGroup, Form, Table, Col, Row } from "react-bootstrap";
import InvoiceChangeStatusModal from "./InvoiceChangeStatusModal.js";
import ReactModal from "react-modal";
import { show } from "./aux/formatDate.js";
import InvoiceModalDelete from "./InvoiceModalDelete.js";
import { renderClockinDataTable } from "./aux/renderClockinDataTable.js";
import PunchInModal from "./PunchInModal.js";
import InvoiceEditModal from "./InvoiceEditModal.js";
import { getClockins } from "./aux/getClockins.js";


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
    showClockinModal  : "",
    showEditInvoiceModal : ""
  };



  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
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
      // dateStart = this.props.invoice.date_start,
      // dateEnd   = this.props.invoice.date_end,
      // clientId  = this.props.client._id;
      invoiceId       = this.props.invoice._id,
      userToken       = this.props.storeToken,
      typeOfQuestion  = "invoiceClockins";
      
      try {
        this.setState({

        });
        const pastClockins = await getClockins(userToken, typeOfQuestion, invoiceId);

        if (pastClockins.error)
          throw(pastClockins.error);

        this.setState({
          clockinList       : pastClockins,
          clockInListTable  : this.renderDataTable(pastClockins),
          tableVisibility   : true
        });

      } catch(err) {
        this.setState({
          message         : err || err.message,
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
      clockinToModal  : data,
      client          : data.client
    });
  }


  renderDataTable = clockins => {
    let 
      totalTime = 0,
      totalCad  = 0;
    const firstResult = clockins.map((clockin, index) => {
      const clockinsToSend = renderClockinDataTable(clockin, index);
      totalTime += Number(clockinsToSend.totalTime);
      totalCad  += Number(clockinsToSend.totalCad);
      return (
        <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
          <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
          <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
          <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
          <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalCad}</td>
        </tr>
      )
    });

    const addTotals = (
      <tr key={firstResult.length + 1}>
        <td></td>
        <td style={{verticalAlign: "middle"}}><b>Totals</b></td>
        <td style={{verticalAlign: "middle"}}><b>{totalTime.toFixed(2)} {totalTime > 1 ? "hours" : "hour"}</b></td>
        <td style={{verticalAlign: "middle"}}><b>${totalCad.toFixed(2)}</b></td>
      </tr>
    );
    const result = [...firstResult, addTotals];
    return result;
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


  closeEditModal = changes => {
    this.props.changeInvoiceData(changes);
    this.setState({showEditInvoiceModal: false});
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

        {
          this.state.showEditInvoiceModal
            ?
              <InvoiceEditModal
                invoice               = { this.props.invoice}
                showEditInvoiceModal  = { this.state.showEditInvoiceModal}
                closeInvoiceEditModal = { (changes) => {
                    changes 
                      ?
                        this.closeEditModal(changes)
                      :
                        this.setState({showEditInvoiceModal: false})
                  }
                }
              />
            : ""
        }

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


        {this.state.showClockinModal
          ? <PunchInModal 
              showModal     = { this.state.showClockinModal}
              clockinData   = { this.state.clockinToModal}
              client        = { this.state.client }
              deleteClockin = { false}
              closeModal    = { this.closeClockinModal}
              thinScreen    = { thinScreen}
            />
          : ""}

        <Card>
          <Card.Header as="h3">Invoice: { this.props.invoice.code }</Card.Header>
          <Card.Body>

            <Card.Title style={{fontWeight: "bold", fontSize: "large"}}> Client: { this.props.client.nickname || this.props.client.name }</Card.Title>


            { thinScreen
              ? 
                <div>
                  <Form.Label style={{left: "2rem"}}> 
                    <b>Total: $</b>{ this.props.invoice.total_cad.toFixed(2) }
                  </Form.Label>
                  <br />
                  <Form.Label style={{left: "2rem"}}> 
                    <b>Date Start: </b> { show(this.props.invoice.date_start) }
                  </Form.Label>
                  <br />
                  <Form.Label> 
                    <b>Date End: </b> { show(this.props.invoice.date_end) }
                  </Form.Label>
                  <br />
                  <Form.Label style={{left: "2rem"}}> 
                    <b>Date Generated:</b> { show(this.props.invoice.date) }
                  </Form.Label>

                  { (this.props.invoice.date_delivered || this.state.dateDelivered) &&
                      <div>
                        <Form.Label style={{left: "2rem"}}> 
                          <b>Date Delivered:</b> { show(this.props.invoice.date_delivered || this.state.dateDelivered) }
                        </Form.Label>
                      </div>
                  }
                  { (this.props.invoice.date_received || this.state.dateReceived) &&
                      <div>
                        <Form.Label style={{left: "2rem"}}> 
                          <b>Date Received:</b> { show(this.props.invoice.date_received || this.state.dateReceived) }
                        </Form.Label>
                      </div>
                  }

                  { this.props.invoice.cad_adjustment &&
                    <div>
                      <Form.Label style={{left: "2rem"}}> 
                        <b>Received $:</b> { this.props.invoice.cad_adjustment }
                      </Form.Label>
                      <br />
                      <Form.Label style={{left: "2rem"}}> 
                        <b>Reason:</b> { this.props.invoice.reason_adjustment }
                      </Form.Label>
                    </div>
                  }
                </div>
              : 
                <div>
                  <Row>
                    <Col style={{width: "50%"}}>
                      <Form.Label style={{left: "2rem"}}> 
                        <b>Total: $</b>{ this.props.invoice.total_cad.toFixed(2) }
                      </Form.Label>
                      <br />
                      <Form.Label style={{left: "2rem"}}> 
                        <b>Date Start: </b> { show(this.props.invoice.date_start) }
                      </Form.Label>
                      <br />
                      <Form.Label> 
                        <b>Date End: </b> { show(this.props.invoice.date_end) }
                      </Form.Label>
                      <br />
                      <Form.Label style={{left: "2rem"}}> 
                        <b>Date Generated:</b> { show(this.props.invoice.date) }
                      </Form.Label>

                      { (this.props.invoice.date_delivered || this.state.dateDelivered) &&
                          <div>
                            <Form.Label style={{left: "2rem"}}> 
                              <b>Date Delivered:</b> { show(this.props.invoice.date_delivered || this.state.dateDelivered) }
                            </Form.Label>
                          </div>
                      }
                      { (this.props.invoice.date_received || this.state.dateReceived) &&
                          <div>
                            <Form.Label style={{left: "2rem"}}> 
                              <b>Date Received:</b> { show(this.props.invoice.date_received || this.state.dateReceived) }
                            </Form.Label>
                          </div>
                      }
                    </Col>

                    { this.props.invoice.cad_adjustment &&
                        <Col style={{width: "50%"}}>
                          <Form.Label style={{left: "2rem"}}> 
                            <b>Received $:</b> { this.props.invoice.cad_adjustment }
                          </Form.Label>
                          <br />
                          <Form.Label style={{left: "2rem"}}> 
                            <b>Reason:</b> { this.props.invoice.reason_adjustment }
                          </Form.Label>
                        </Col>
                    }
                  </Row>
                </div>
            }

            { this.state.currentStatus === "Received"
                ?
                  <Button
                    onClick = { () => this.setState({ showEditInvoiceModal: true})}
                  >
                    Edit Invoice
                  </Button>
                : 
                  <Button
                    onClick = { () => this.setState({ showEditInvoiceModal: true})}
                  >
                    Edit Invoice's Code
                  </Button>
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
                      >
                        { this.state.currentStatus }
                      </Button>
                      <Button
                        style     = { { width: "50%" }}
                        variant   = "danger"
                        disabled  = { this.state.currentStatus === "Received" ? true : false }
                        onClick   = { this.setShowModalDeleteInvoice }
                      > 
                        Delete 
                      </Button>
                    </ButtonGroup>
                }
              </div>

          </Card.Body>
        </Card>

        
        {!this.state.tableVisibility &&
          <Card>
            <Card.Footer className= "messageSuccess">
              Processing...
            </Card.Footer>
          </Card>
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
              <Card.Footer>
                { this.state.message }
              </Card.Footer>
            </Card>
        }

        { (this.state.tableVisibility || this.state.message) &&
          <Button
            variant = "primary"
            onClick = { this.backToThePrevious }
          >
            Close Window
          </Button>
        }




      </ReactModal>
    );
  }
}


// const mapStateToProps = store => {
//   return {
//     AstoreToken    : store.token
//   };
// };



// export default connect(mapStateToProps, null)(InvoiceModal);
export default InvoiceModal;
