import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import {  Card, Button, Form, Row, Col, Table } from "react-bootstrap";
// import moment from "moment";

import GetClients from "./aux/GetClients.js";


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
    client            : {},
    cleanButton       : false
  }
}


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleSubmit = async event => {
    // event.preventDefault();

    const
      dateStart = this.state.dateStart,
      dateEnd   = this.state.dateEnd,
      clientId  = this.state.clientId;

    const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;
console.log("URL=== ", url);
    if (clientId) {
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
            message: getClockins.data.message
          });

          setTimeout(() => {
            this.cleanMessage();
          }, 3000);
        }
      } catch(err) {
        this.setState({
          message: err.message
        });
        
      }
    } else
      this.messageValidationMethod();
  }


  handleDelete = async (clockinId, key) => {
    if (window.confirm("Are you sure you wanna delete this clockin?")) {
      const url = `/clockin`;

      try {
        const deleteClockin = await axios.delete( 
          url,
          {
            data: {
              clockinId
            },
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${this.props.storeToken}` }
        });

        if (deleteClockin.data.error) {
          this.setState({
            message: deleteClockin.data.error
          });
        } else {
          const array = this.state.clockInListTable;
          const newList = array.filter(row => Number(row.key) !== Number(key));

          this.setState({
            clockInListTable: newList,
            message: deleteClockin.data.message
          });
        }

        this.handleSubmit();
        setTimeout(() => {
          this.cleanMessage();
        }, 3000);

      } catch(err) {
        console.log(err.message);
        this.setState({
          message: err.message
        });

        setTimeout(() => {
          this.cleanMessage();
        }, 2000);
      }
    }
  }


  renderDataTable = (clockins) => {
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
        date        : (date.getUTCDate() > 10 
                        ? date.getUTCDate()
                        : "0" + date.getUTCDate()) + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear(),
        // date,
        timeStart   : ts.getUTCHours() + ":" + (ts.getUTCMinutes() < 10 ? ("0" + ts.getUTCMinutes()) : ts.getUTCMinutes()),
        timeEnd     : te.getUTCHours() + ":" + (te.getUTCMinutes() < 10 ? ("0" + te.getUTCMinutes()) : te.getUTCMinutes()),
        rate        : clockin.rate,
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
          <td>{clockinsToSend.rate}</td>
          <td>{clockinsToSend.total}</td>
          <td>{clockinsToSend.invoice}</td>
          <td>
            <Button
              variant   = "danger"
              onClick   = {() => this.handleDelete(clockin._id, clockinsToSend.num)}
              // variant   = "info"
              // onClick   = {() => this.handleCallEdit(userToSend)}    // call modal to edit the clockin without invoice related to
              // data-user = {JSON.stringify(userToSend)}
            > Delete</Button>
          </td>
        </tr>
      )
    })
  }  


  cleanForm = () => {
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
      message: "Please, select client."
    });

    setTimeout(() => {
      this.cleanMessage();
    }, 3000);
  }


  cleanMessage = () => {
      this.setState({
        message: ""
      });
  }


  getClientInfo = client => {
    this.setState({
      client  : client,
      clientId : client._id
    });
  }

  render() {
    return (
      <div className="formPosition">
        <h3>List of Punch ins</h3>

        {/* <Card style={{ width: '40rem' }}> */}
        <Card className="card-settings">
          <Card.Body>

          { /* mount the Dropbox Button with all clients for the user */ }
          <div className="gridClientBtContainer">
            <GetClients
              client        = { this.state.client }
              getClientInfo = { this.getClientInfo } />

            <span>
              { this.state.message || "" }
            </span>
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

              <Button 
                variant="primary" 
                onClick = { this.handleSubmit } >
                Get List
              </Button>        

              { this.state.cleanButton
                ? 
                  <Button variant="info" onClick = { this.cleanForm }>
                    Clean
                  </Button>
                : null }
            </Form>
          </Card.Body>
        </Card>


        { this.state.tableVisibility
          ?
            <Card id="clockinListResult" >
              <Form.Label className="cardLabel">Client: {this.state.client.nickname}</Form.Label>
{console.log("this.state", this.state)}              
              {(this.state.clockinList.length > 0) 
                ? <Table striped bordered hover size="sm" responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        {/* <th>Client</th> */}
                        <th>Date</th>
                        <th>Time Start</th>
                        <th>Time End</th>
                        <th>Total Time</th>
                        <th>Rate</th>
                        <th>Total CAD$</th>
                        <th>Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.clockInListTable}
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
    storeToken    : store.token
  };
};


export default connect(mapStateToProps, null)(PunchInsList);
