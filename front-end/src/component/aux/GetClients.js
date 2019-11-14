import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import { Dropdown } from "react-bootstrap";


class GetClients extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clients       : undefined,
      // dropDownLabel : "Select the client",
      errorMsg      : undefined
    }
  }

  async componentDidMount() {
    const url = "/client";    // this is dev setting
    try {
      const getClients = await axios.get( 
        url, 
        {  
        headers: { 
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${this.props.storeToken}` }
      });
console.log("getClients", getClients.data.message);
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
          {/* {this.state.dropDownLabel} */}
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

    // this.setState({
    //   dropDownLabel: event.target.name
    // });
    // const client = JSON.parse(event.target.dataset.client);
    // this.props.dispatchSetClient({ client });
    // this.props.populateForm(client);
    this.props.getClientInfo(incommingClient);
  }


  render() {
    console.log("rendering GetList!!");
    console.log("this.state.clients", this.state.clients);
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


// const mapDispatchToProps = dispatch => {
//   return {    
//     dispatchSetClient: client => dispatch({
//       type:"SETCLIENT",
//       data: client })
//   };
// };


export default connect(mapStateToProps, null)(GetClients);
