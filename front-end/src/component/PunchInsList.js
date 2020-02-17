import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import Card   from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form   from "react-bootstrap/Form";
import Row    from "react-bootstrap/Row";
import Col    from "react-bootstrap/Col";
import Table  from "react-bootstrap/Table";

// , Button, Form, Row, Col, Table } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
// import moment from "moment";

import GetClients from "./aux/GetClients.js";
import * as formatDate from "./aux/formatDate.js";
import PunchInModal from "./PunchInModal.js";


const thinScreen = window.innerWidth < 800 ? true : false;

class PunchInsList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dateStart         : "",
      dateEnd           : "",
      clientId          : "",
      clockinList       : [],
      clockInListTable  : "",
      tableVisibility   : false,
      message           : "",
      classNameMessage  : "",
      client            : {},
      cleanButton       : false,

      showModal         : false,
      clockinToModal    : {}
    };
}


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleSubmit = async event => {
    event.preventDefault();

    const
      dateStart = this.state.dateStart,
      dateEnd   = this.state.dateEnd,
      clientId  = this.state.clientId;

    const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;

    if (clientId) {
      const a = new Date(dateStart).getTime();
      const b = new Date(dateEnd).getTime();

      if (a > b)
        this.setState({
          message   : "Check your dates",
          classNameMessage  : "messageFailure"
        });
      else
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
              // client            : getClockins.data.client,
              clockInListTable  : this.renderDataTable(getClockins.data.allClockins),
              tableVisibility   : true,
              cleanButton       : true
            });
          } else {
            this.setState({
              message         : getClockins.data.message,
              classNameMessage: "messageFailure",
              tableVisibility : false
            });

            // setTimeout(() => {
            //   this.clearMessage();
            // }, 3000);
          }
        } catch(err) {
          this.setState({
            message           : err.message,
            classNameMessage  : "messageFailure"
          });
        
      }
    } else
      this.messageValidationMethod();

    this.clearMessage();
  }


  editClockin = data => {
    this.setState({
      showModal       : true,
      clockinToModal  : data
    });
  }


  closeClockinModal = () => {
    this.setState({
      showModal: false
    });
  }


  renderDataTable = (clockins) => {
    return clockins.map((clockin, index) => {
      const 
        ts = new Date(clockin.time_start),
        te = new Date(clockin.time_end),
        bs = clockin.break_start ? new Date(clockin.break_start) : "",
        be = clockin.break_end ? new Date(clockin.break_end) : "";

      const clockinsToSend = {
        id          : clockin._id,
        num         : index + 1,
        date        : formatDate.show(clockin.date),
        timeStart   : (ts.getUTCHours() < 10 ? ("0" + ts.getUTCHours()) : ts.getUTCHours()) + ":" 
                      + (ts.getUTCMinutes() < 10 ? ("0" + ts.getUTCMinutes()) : ts.getUTCMinutes()),
        timeEnd     : (te.getUTCHours() < 10 ? ("0" + te.getUTCHours()) : te.getUTCHours()) + ":" 
                      + (te.getUTCMinutes() < 10 ? ("0" + te.getUTCMinutes()) : te.getUTCMinutes()),
        breakStart  : bs
                        ?
                          (bs.getUTCHours() < 10 ? ("0" + bs.getUTCHours()) : bs.getUTCHours()) + ":" 
                            + (bs.getUTCMinutes() < 10 ? ("0" + bs.getUTCMinutes()) : bs.getUTCMinutes())
                        : "",
        breakEnd    : be
                        ?
                          (be.getUTCHours() < 10 ? ("0" + be.getUTCHours()) : be.getUTCHours()) + ":" 
                            + (be.getUTCMinutes() < 10 ? ("0" + be.getUTCMinutes()) : be.getUTCMinutes())
                        : "",
        rate        : clockin.rate,
        totalTime   : ((te - ts) / ( 60 * 60 * 1000)).toFixed(2),
        totalCad    : (((te - ts) / ( 60 * 60 * 1000)) * (Number(clockin.rate))).toFixed(2),
        invoice     : clockin.invoice_id ? clockin.invoice.code : "not yet",
        workedHours : (clockin.worked_hours ? (clockin.worked_hours / (1000 * 60 * 60)).toFixed(2) : "")
      };

      if (thinScreen) {   // small devices
        return (
          <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalCad}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
          </tr>
        );

      } else {
        return (
          <tr key={clockinsToSend.num} onClick={() => this.editClockin(clockinsToSend)}>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.num}</td>
            {/* <td>{client}</td> */}
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.date}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.timeStart}</td>
            {/* <td>{clockinsToSend.timeEnd}</td> */}
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.totalTime}</td>
            {/* <td>{clockinsToSend.rate}</td> */}
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.total}</td>
            <td style={{verticalAlign: "middle"}}>{clockinsToSend.invoice}</td>
          </tr>
        );
      }
    });
  }  


  clearForm = () => {
    this.setState({
      date            : "",
      timeStart       : "",
      timeEnd         : "",
      rate            : "",
      clientId        : "",
      message         : "",
      client          : {},
      tableVisibility : false,
      cleanButton     : false
    });
  }


  messageValidationMethod = () => {
    this.setState({
      message           : "Please, select client.",
      classNameMessage  : "messageFailure"
    });

    // setTimeout(() => {
    //   this.clearMessage();
    // }, 3000);
  }


  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message: ""
      });
    }, 3000);
  }


  getClientInfo = client => {
    this.setState({
      client          : client,
      clientId        : client._id,
      tableVisibility : false
    });
  }


  updateClockins = (clockinToRemove) => {
    const tempClockins      = this.state.clockinList.filter( clockin => clockin._id !== clockinToRemove);
    const tempClockinsTable = this.renderDataTable(tempClockins);

    this.setState({
      clockinList       : tempClockins,
      clockInListTable  : tempClockinsTable
    });
  }


  render() {
// console.log("this.state.clockinList", this.state.clockinList)
    return (
      <div className="formPosition">
        <br />

        {/* <Card style={{ width: '40rem' }}> */}
        <Card className="card-settings">
          <Card.Header>List of PunchIns</Card.Header>
          <Card.Body>
            
          { /* mount the Dropbox Button with all clients for the user */ }
          <div className="gridClientBtContainer">
            <GetClients
              client        = { this.state.client }
              getClientInfo = { this.getClientInfo } />

          </div>


            <br></br>
            <Form >

              <Form.Group as={Row} controlId="formST">
                <Form.Label column sm="3" className="cardLabel">Date Start:</Form.Label>
                <Col sm="5">
                  <Form.Control
                    type        = "date"
                    name        = "dateStart"
                    onChange    = {this.handleChange}
                    value       = {this.state.dateStart}
                    disabled    = {( this.state.clientId === "" ) ? true : false } />
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
                    disabled    = {( this.state.clientId === "" ) ? true : false } />
                </Col>
              </Form.Group>

              <Card.Footer className= { this.state.classNameMessage}>          
                { this.state.message
                  ? this.state.message
                  : <br /> }
              </Card.Footer>
              <br />

              <div className="d-flex flex-column">
                { this.state.cleanButton
                  ? 
                    <ButtonGroup className="mt-3">
                      <Button 
                        variant="primary" 
                        onClick = { this.handleSubmit } >
                        Get List
                      </Button>
                      <Button variant="info" onClick = { this.clearForm }>
                        Clean
                      </Button>
                    </ButtonGroup>
                  :
                    <Button 
                      variant="primary" 
                      onClick = { this.handleSubmit } >
                      Get List
                    </Button>
                }
              </div>
            </Form>
          </Card.Body>
        </Card>


        { this.state.tableVisibility
          ?
            <Card className="cardInvoiceGenListofClockins card">
              <Card.Header style={{textAlign: "center"}}>
                Client: <b>{this.state.client.nickname}</b>, {`  `} 
                <b>{this.state.clockinList.length}</b> {this.state.clockinList.length > 1 ? "Clockins" : "Clockin"}
              </Card.Header>

{/* {console.log("this.state", this.state)} */}
              {(this.state.clockinList.length > 0)
                ? thinScreen 
                ? <Table striped bordered hover size="sm" responsive>
                    <thead style={{textAlign: "center"}}>
                      <tr>
                        <th style={{verticalAlign: "middle"}}>#</th>
                        <th style={{verticalAlign: "middle"}}>Date</th>
                        <th style={{verticalAlign: "middle"}}>Time Start</th>
                        <th style={{verticalAlign: "middle"}}>CAD$</th>
                        <th style={{verticalAlign: "middle"}}>Invoice</th>
                      </tr>
                    </thead>
                    <tbody style={{textAlign: "center"}}>
                      {this.state.clockInListTable}
                    </tbody>
                  </Table> 
                : <Table striped bordered hover size="sm" responsive>
                    <thead style={{textAlign: "center"}}>
                      <tr>
                        <th style={{verticalAlign: "middle"}}>#</th>
                        {/* <th>Client</th> */}
                        <th style={{verticalAlign: "middle"}}>Date</th>
                        <th style={{verticalAlign: "middle"}}>Time Start</th>
                        {/* <th>Time End</th> */}
                        <th style={{verticalAlign: "middle"}}>Total Time</th>
                        {/* <th>Rate</th> */}
                        <th style={{verticalAlign: "middle"}}>CAD$</th>
                        <th style={{verticalAlign: "middle"}}>Invoice</th>
                      </tr>
                    </thead>
                    <tbody style={{textAlign: "center"}}>
                      {this.state.clockInListTable}
                    </tbody>
                  </Table> 
                : null }
            </Card>
          : null }

        {this.state.showModal
          ? <PunchInModal 
              showModal     = { this.state.showModal}
              clockinData   = { this.state.clockinToModal}
              client        = { this.state.client.nickname}
              // deleteClockin = { (clockinId) => console.log("clockin got deleted", clockinId)}
              deleteClockin = { (clockinId) => this.updateClockins(clockinId)}
              closeModal    = { this.closeClockinModal}
              thinScreen    = { thinScreen}
            />
          : ""}

        </div>

    );
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};


export default connect(mapStateToProps, null)(PunchInsList);
