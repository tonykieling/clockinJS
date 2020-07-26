import React, { useState, useEffect } from 'react';
import axios from "axios";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
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
}, [props.updateButton]);
  
  
  const logout = () => {
    props.noUser();
    setgoLand(true);
    setshowModal(false);
  };


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
          // setclients(getClients.data.message.filter(e => !e.company));
          setclients(getClients.data.message.filter(e => !e.isCompany));
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
          <DropdownButton
            id        = "dropdown-basic"
            disabled  = { props.onlyOneClient}
            variant   = { props.invoiceFlag || props.notKidFlag ? "info" : "success"}
            title     = {(props.companyId && clients.filter(e => (e._id === props.companyId))[0].name)
              || (props.client && (props.client.nickname || props.client.name)) 
              ||  (props.notKidFlag
                      ? "Select Company"
                      : props.invoiceFlag
                        ? "Select Client/Company"
                        : "Select Client"
                  )}
          >
            { props.bringAllClients 
              ?
                <React.Fragment>
                  {clients.map( (client, id) =>
                      <Dropdown.Item 
                      key = { id } 
                      onClick = { e => changes(e, client) }
                      // data-client = { JSON.stringify(client) }
                      name = { client.name }
                      > { client.nickname || client.name } 
                      </Dropdown.Item>
                  )}
                </React.Fragment>
              :
                <React.Fragment>
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
                </React.Fragment>
                }
          </DropdownButton>
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

        { clients.length
          ? populateDropbox()
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
