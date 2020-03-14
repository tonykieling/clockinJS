import React, { useState } from 'react';
// import axios from "axios";
import { connect } from "react-redux";
import { Modal, Card, Button, ButtonGroup, Form, Row, Col } from "react-bootstrap";
import { show } from "./aux/formatDate.js";


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

/**
 * how to use tooltips (TIPS)
 * https://www.w3schools.com/howto/howto_css_tooltip.asp
 */


function InvoiceEditModal(props) {
  const [showEditInvoice, setShowEditInvoice] = useState(props.showEditInvoiceModal);

  const handleClose = () => {
    setShowEditInvoice(false);
    props.closeInvoiceEditModal();
  }

  return (
    <Modal
      show    = { showEditInvoice}
      onHide  = { handleClose }
    >
      <Form>
        { console.log("invoice:", props.invoice)}
        <Form.Label style={{left: "2rem"}}> 
          <b>Total: $</b>{ props.invoice.total_cad.toFixed(2) }
        </Form.Label>
        <br />
        <Form.Label style={{left: "2rem"}}> 
          <b>Date Start: </b> { show(props.invoice.date_start) }
        </Form.Label>
        <br />
        <Form.Label> 
          <b>Date End: </b> { show(props.invoice.date_end) }
        </Form.Label>
        <br />
        <Form.Label style={{left: "2rem"}}> 
          <b>Date Generated:</b> { show(props.invoice.date) }
        </Form.Label>

        { (props.invoice.date_delivered || "this.state.dateDelivered") &&
            <div>
              <Form.Label style={{left: "2rem"}}> 
                <b>Date Delivered:</b> { show(props.invoice.date_delivered || "this.state.dateDelivered") }
              </Form.Label>
            </div>
        }
        { (props.invoice.date_received || this.state.dateReceived) &&
            <div>
              <Form.Label style={{left: "2rem"}}> 
                <b>Date Received:</b> { show(props.invoice.date_received || "this.state.dateReceived") }
              </Form.Label>
            </div>
        }
      </Form> 
      <Button 
        onClick = { handleClose }
      >
        Close
      </Button>     
    </Modal>
  )
}




const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};



export default connect(mapStateToProps, null)(InvoiceEditModal);
