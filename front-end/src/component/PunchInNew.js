import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Dropdown, Card, Button, Form } from "react-bootstrap";
// import PunchInsList from './PunchInsList';

class PunchInNew extends Component {

  state = {
    clients       : null,
    dropDownLabel : "Select the client"
  }

  async componentDidMount() {
    const url         = "http://localhost:3333/client";    // this is dev setting
    try {
      const getClients = await axios.get( 
        url, 
        {  
        headers: { 
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${this.props.storeToken}` }
      });
console.log("getClients", getClients);
      if (getClients.data.message.length > 0) {
        this.setState({
          clients: getClients.data.message
        });
      }
//         const id = addClient.data.client._id;
//         const client = { id, name, nickName, mother };
// console.log("NEWclient", addClient);
//         this.props.dispatchLogin({ client });
//         this.setState({
//           redirectFlag: true
//         });
//       } else if (addClient.data.error) {
//         this.setState({
//           errorMsg: addClient.data.error });
//         this.clearMessage();
//       }

    } catch(err) {
      this.setState({
        errorMsg: err.message });
      // this.clearMessage();
    }
  }

  populateDropbox = () => {
    // const clients = this.state.clients;

    return(
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {this.state.dropDownLabel}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {this.state.clients.map( (client, id) => 
            <Dropdown.Item key = { id } onClick = { this.changes } name = {client.name}> { client.name }</Dropdown.Item>            
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  changes = e => {
    this.setState({
      dropDownLabel: e.target.name
    });
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
          { this.state.clients
         ? this.populateDropbox()
         : null }
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
    <Form.Control type="text" placeholder="Rate" />
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
    storeToken: store.token
  };
};


// const mapDispatchToProps = dispatch => {
//   return {
//     dispatchLogin: user => dispatch({
//       type:"LOGIN",
//       data: user })
//   };
// };


export default connect(mapStateToProps, null)(PunchInNew)
