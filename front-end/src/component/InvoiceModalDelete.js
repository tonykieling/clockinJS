import React, { useState} from "react";
import { Modal, Button, ButtonGroup } from "react-bootstrap";
import { connect } from 'react-redux'
import axios from "axios";

/**
 * 
 * using Hook + Modal from boostrap, instead of react-modal
 */

function InvoiceModalDelete(props) {
  const [showModalDeleteInvoice, setShowModalDeleteInvoice] = useState(props.initialState);

  const initialMessage = `Deleting the invoice will set all its clockins to no invoice. Are you sure you want to delete it?`
  const [message, setMessage] = useState(initialMessage);

  const [done, setDone] = useState(false);
  const [deleted, setDeleted] = useState(false);


  const handleClose = () => {
    if (deleted) props.confirmDeletion();
    setShowModalDeleteInvoice(false);
    props.closeDeleteModal();
  }


  const handleDelete = async () => {
    const url = `/invoice/${props.invoiceId}`;

    try {
      const deleteInvoice = await axios.delete( 
        url,
        {
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${props.storeToken}` }
      });

      if (deleteInvoice.data.message) {
        setMessage(`Invoice ${props.invoiceCode} has been delete`);
        setDeleted(true);
      } else {
        console.log("ERROR is present")
        setMessage(deleteInvoice.data.error + "!!!");
      }
    } catch(err) {
      console.log(err.message);
      setMessage(err.message);
    }
    setDone(true);
  }


  return (
    <div>
        <Modal
          show    = { showModalDeleteInvoice }
          onHide  = { handleClose } >

          <Modal.Header closeButton>
            <Modal.Title>Delete Invoice</Modal.Title>
          </Modal.Header>
          <Modal.Body> { message } </Modal.Body>
          <Modal.Footer>
            { done
              ? <Button 
                  variant   = "primary" 
                  onClick   = { handleClose } 
                  style     = {{ width: "50%"}}
                >
                  Close
                </Button>
              : <ButtonGroup 
                  className = "mt-3"
                  style     = {{ width: "50%" }}
                >
                  <Button 
                    variant   = "primary" 
                    onClick   = { handleDelete } 
                    style     = {{width: "50%"}}
                  >
                    Yes
                  </Button>
                  <Button 
                    variant   = "danger" 
                    onClick   = { handleClose } 
                    style     = {{ width: "50%"}}
                  >
                    No
                  </Button>
                </ButtonGroup>
            }
          </Modal.Footer>

        </Modal>      
    </div>
  )
}

const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};


export default connect(mapStateToProps, null)(InvoiceModalDelete);
