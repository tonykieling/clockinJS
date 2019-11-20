import React, { Component, Fragment } from 'react'
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
    event.preventDefault();

    const
      dateStart = this.state.dateStart,
      dateEnd   = this.state.dateEnd,
      clientId  = this.state.clientId;

    const url = `/clockin?dateStart=${dateStart}&dateEnd=${dateEnd}&clientId=${clientId}`;

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
            clockInListTable  : this.renderDataTable(getClockins.data.allClockins, getClockins.data.client),
            tableVisibility   : true,
            cleanButton       : true
          });
        } else {
          this.setState({
            message: getClockins.data.message
          });

          this.cleanMessage();
        }
      } catch(err) {
        this.setState({
          message: err.message
        });
        
      }
    } else
      this.messageValidationMethod();
  }


  renderDataTable = (clockins, client) => {
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
          <td>{client}</td>
          <td>{clockinsToSend.date}</td>
          <td>{clockinsToSend.timeStart}</td>
          <td>{clockinsToSend.timeEnd}</td>
          <td>{clockinsToSend.totalTime}</td>
          <td>{clockinsToSend.rate}</td>
          <td>{clockinsToSend.total}</td>
          <td>{clockinsToSend.invoice}</td>
          <td>
            <Button
              variant   = "info"
              // onClick   = {() => this.handleCallEdit(userToSend)}    // call modal to edit the clockin without invoice related to
              // data-user = {JSON.stringify(userToSend)}
            > Edit</Button>
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
      <Fragment>
        <h1>
          List of Punch ins
        </h1>
        <p>some random text</p>

        <Card style={{ width: '40rem' }}>
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
                <Form.Label column sm="3" >Date Start:</Form.Label>
                <Col sm="5">
                  <Form.Control
                    type        = "date"
                    name        = "dateStart"
                    onChange    = {this.handleChange}
                    value       = {this.state.dateStart}
                    // onKeyPress  = {this.handleChange}
                    // ref         = {input => this.textInput2 = input } 
                    />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formET">
                <Col sm="3">
                  <Form.Label>Date End:</Form.Label>
                </Col>
                <Col sm="5">
                  <Form.Control                
                    type        = "date"
                    name        = "dateEnd"
                    onChange    = {this.handleChange}
                    value       = {this.state.dateEnd}
                    // onKeyPress  = {this.handleChange}
                    // ref         = {input => this.textInput3 = input } 
                    />
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
              {(this.state.clockinList.length > 0) 
                ? <Table striped bordered hover size="sm" responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Client</th>
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

        </Fragment>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token,
    // storeClientId : store.client_id
  };
};


// const mapDispatchToProps = dispatch => {
//   return {
//     dispatchLogin: user => dispatch({
//       type:"LOGIN",
//       data: user })
//   };
// };


export default connect(mapStateToProps, null)(PunchInsList);
