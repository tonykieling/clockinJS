import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Dropdown } from "react-bootstrap";
import MessageModal from "../MessageModal.js";
import { Redirect } from "react-router-dom";


class GetClients extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clients       : undefined,
      errorMsg      : undefined,
      goLand        : false,
      showModal     : false
    }
  }

  logout = () => {
    this.props.noUser();
    this.setState({
      goLand    : true,
      showModal : false
    });
  };


  async componentDidMount() {
    const url = "/client";    // this is dev setting
    const askInvoiceSample = this.props.askInvoiceSample || false;

    try {
      const getClients = await axios.get( 
        url, 
        {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${this.props.storeToken}`,
            "askinvoicesample" : askInvoiceSample
          }
        },
      );

      if (getClients.data.count) {
        this.setState({
          clients: getClients.data.message
        });
      } else if (getClients.data.error) {
        //call message modal to say the user needs to login again and redirect to /land
        this.setState({
          showModal: true
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
          {(this.props.client && this.props.client.nickname) || `Select Client` }
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {this.state.clients.map( (client, id) =>
            <Dropdown.Item 
              key = { id } 
              // onClick = { () => this.changes(client) } 
              onClick = { (e) => this.changes(e, client) }
              // data-client = { JSON.stringify(client) }
              name = { client.nickname }
            > { client.nickname } </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  changes = (event, incommingClient) => {
    event.preventDefault();
    this.props.getClientInfo(incommingClient);
  }


  render() {
    return (
      <div>
        { this.state.goLand && <Redirect to = "/land" /> }

        { this.state.showModal
            &&
              <MessageModal
                openModal = { this.state.showModal }
                message   = "User needs to login again."
                noMethod  = { this.logout }
              />
        }

        { this.state.clients
          ? this.populateDropbox()
          : "No clients at all" 
        }

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
    noUser: () => dispatch({type:"LOGOUT"})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GetClients);
