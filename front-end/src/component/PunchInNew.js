import React, { Component } from 'react'
// import axios from "axios";
import { connect } from "react-redux";
import {  Card, Button, Form } from "react-bootstrap";

import GetClients from "./aux/GetClients.js";


class PunchInNew extends Component {

  state = {
    clients       : null
  }

  render() {
    return (
      <div>
        <h1>
          PunchIn New over here CLASS
        </h1>
        <p>changing state after componentDidMount and working on looping of a list of items</p>

        <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Punch in</Card.Title>

         <GetClients />     { /* mount the Dropbox Button with all clients for the user */ }

          <Form>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Date</Form.Label>
    <Form.Control type="text" placeholder="Enter date" />
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Time Start</Form.Label>
    <Form.Control type="text" placeholder="Time Start" />
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Time End</Form.Label>
    <Form.Control type="text" placeholder="Time End" />
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Rate</Form.Label>
    <Form.Control type="text" placeholder={ this.props.storeRate ? this.props.storeRate : "Default Rate"} />
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Notes</Form.Label>
    <Form.Control type="text" placeholder="Notes" />
  </Form.Group>

  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>
        </Card.Body>
      </Card>
      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken: store.token,
    storeRate : store.client_dr
  };
};


// const mapDispatchToProps = dispatch => {
//   return {
//     dispatchLogin: user => dispatch({
//       type:"LOGIN",
//       data: user })
//   };
// };


export default connect(mapStateToProps, null)(PunchInNew);
