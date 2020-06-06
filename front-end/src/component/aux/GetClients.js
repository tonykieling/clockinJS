import React, { useState, useEffect } from 'react';
import axios from "axios";
import { connect } from "react-redux";
import { Dropdown } from "react-bootstrap";
import MessageModal from "../MessageModal.js";
import { Redirect } from "react-router-dom";


function GetClients(props) {
  const [clients, setclients] = useState("");
  const [errorMsg, seterrorMsg] = useState("");
  const [goLand, setgoLand] = useState("");
  const [showModal, setshowModal] = useState("");

  useEffect(() => {
    getClientsFunction();
    // eslint-disable-next-line
  }, [props.updateButton ? props.updateButton : 1]);
  
  
  const logout = () => {
    props.noUser();
    setgoLand(true);
    setshowModal(false);
  };


  const getClientsFunction = async () => {
    const url = "/client";    // this is dev setting
    const askInvoiceSample = props.askInvoiceSample || false;

    try {
      const getClients = await axios.get( 
        url, 
        {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${props.storeToken}`,
            "askinvoicesample" : askInvoiceSample
          }
        },
      );

      if (getClients.data.count) {
        setclients(getClients.data.message);
      } else if (getClients.data.error) {
        //call message modal to say the user needs to login again and redirect to /land
        setshowModal(true);
      }
    } catch(err) {
      seterrorMsg(err.message);
    }
  }


  const populateDropbox = () => {
    return(
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {/* {(props.client && props.client.nickname) || `Select Client` } */}
          {(props.client && (props.client.nickname || props.client.name)) || `Select Client` }
          {}
        </Dropdown.Toggle>
        
        { props.bringAllClients 
          ?
            <Dropdown.Menu>
              {clients.map( (client, id) =>
                  <Dropdown.Item 
                    key = { id } 
                    onClick = { (e) => changes(e, client) }
                    // data-client = { JSON.stringify(client) }
                    name = { client.name }
                  > { client.nickname || client.name } 
                  </Dropdown.Item>
              )}
            </Dropdown.Menu>
          :
            <Dropdown.Menu>
              {clients.map( (client, id) =>
                  !client.inactive &&
                    <Dropdown.Item 
                      key = { id } 
                      onClick = { (e) => changes(e, client) }
                      // data-client = { JSON.stringify(client) }
                      name = { client.name }
                    > { client.nickname || client.name } 
                    </Dropdown.Item>
              )}
              </Dropdown.Menu>
            }
      </Dropdown>
    );
  }

  const changes = (event, incommingClient) => {
    event.preventDefault();
    props.getClientInfo(incommingClient);
  }


    return (
      <>
        { goLand && <Redirect to = "/land" /> }

        { showModal
            &&
              <MessageModal
                openModal = { showModal }
                message   = "User needs to login again."
                noMethod  = { logout }
              />
        }

        { clients
          ? populateDropbox()
          : errorMsg || "No clients at all" 
        }

      </>
    )
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
