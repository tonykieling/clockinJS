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


  // useeffect is not working when props.updateDropDown change. It is suppose to run useeffect again and get the data by getClientsFunction
  useEffect(() => {
    if (props.clientId) {
      getClientName(props.clientId);
    } else {
      getClientsFunction();
    }
    // }, [props.updateButton ? props.updateButton : 1]);
    // eslint-disable-next-line
}, []);
  
  
  const logout = () => {
    props.noUser();
    setgoLand(true);
    setshowModal(false);
  };


  // it runs when need client name
  const getClientName = async(clientId) => {
    const url = `/client/${clientId}`;

    try {
      const getClients = await axios.get( 
        url, 
        {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${props.storeToken}`
          }
        },
      );

      if (getClients.data.message) {
        // const company = getClients.data.message[0];
        const company = getClients.data.message;
        props.sureCompany(company[0]);
        setclients(company);
      } else
        seterrorMsg(getClients.data.error)
    } catch(err) {
      seterrorMsg(err.message);
    }
  }


  const getClientsFunction = async () => {
    const url = "/client";
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
        if (props.invoiceFlag) {
          setclients(getClients.data.message.filter(e => !e.linked_company));
        } else if (props.punchinFlag) {
          setclients(getClients.data.message.filter(e => !e.company));
        } else if (props.notKidFlag) {
          //it checks whether there is(are) company and inform to the parent component
          props.sureCompany && props.sureCompany();

          setclients(getClients.data.message.filter(e => !e.type_kid));
        } else {
          setclients(getClients.data.message);
        }
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
      // props.clientId && props.onlyOneClient
      //   ?
      //     <Dropdown>
      //       <Dropdown.Toggle 
      //         variant="info"
      //         id="dropdown-basic"
      //       >
      //         {clients.name}
      //       </Dropdown.Toggle>
      //     </Dropdown>
      //   : 
          <Dropdown>
            <Dropdown.Toggle variant={ props.invoiceFlag || props.notKidFlag ? "info" : "success"} id="dropdown-basic">
              {(props.companyName || (props.client && (props.client.nickname || props.client.name))) 
                || (props.notKidFlag ? "Select Company" : (props.invoiceFlag ? "Select Client/Company" : "Select Client")) }
            </Dropdown.Toggle>
            
            { props.bringAllClients 
              ?
                <Dropdown.Menu>
                  {clients.map( (client, id) =>
                      <Dropdown.Item 
                        key = { id } 
                        onClick = { e => changes(e, client) }
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
                          onClick = { e => changes(e, client) }
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
    props.clientListFlag ? props.getCompanyInfo(incommingClient) : props.getClientInfo(incommingClient);
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

        { clients.length || clients.name 
          ? props.updateDropDown && !clients.length
            ? getClientsFunction()
            : populateDropbox()
          : errorMsg || props.notKidFlag ? "No company at this time" : "No clients at all" 
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
