import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Dropdown } from "react-bootstrap";


class GetClients extends Component {

  state = {
    clients       : null,
    dropDownLabel : "Select the client",
    errorMsg      : null
  }

  async componentDidMount() {
    // const url         = "http://localhost:3333/client";    // this is dev setting
    try {
      const getClients = await axios.get( 
        "/client", 
        {  
        headers: { 
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${this.props.storeToken}` }
      });
      if (getClients.data.message.length > 0) {
        this.setState({
          clients: getClients.data.message
        });
      }
    } catch(err) {
      this.setState({
        errorMsg: err.message });
    }
  }

  populateDropbox = () => {
    return(
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {this.state.dropDownLabel}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {this.state.clients.map( (client, id) =>
            <Dropdown.Item 
              key = { id } 
              // onClick = { () => this.changes(client) } 
              onClick = { this.changes }
              data-client = { JSON.stringify(client) }
              name = { client.nickname }
            > { client.nickname } </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  changes = event => {
    event.preventDefault();

    this.setState({
      dropDownLabel: event.target.name
    });
    const client = JSON.parse(event.target.dataset.client);
    this.props.dispatchSetClient({ client });
  }

  render() {
    return (
      <div>
        { this.state.clients
        ? this.populateDropbox()
        : null }
      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken: store.token
  };
};


const mapDispatchToProps = dispatch => {
  return {    
    dispatchSetClient: client => dispatch({
      type:"SETCLIENT",
      data: client })
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(GetClients);
