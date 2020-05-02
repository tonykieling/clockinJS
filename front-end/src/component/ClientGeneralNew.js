import React, { Component } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from "axios";


class ClientGeneralNew extends Component {

  state = {
      name            : "",
      defaultRate     : "",
      message         : "",
      className       : "",
      validForm       : false,
      formValidated   : false,
      saveButtonType  : undefined,
      disableBtn      : false,

      email           : "",
      typeOfService   : "",
      address         : "",
      city            : "",
      province        : "",
      postalCode      : "",
      phone          : ""
    }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  handleSubmit = async e => {
    e.preventDefault();
    if (!this.state.name || !this.state.defaultRate) {
      if (!this.state.name)
        this.textInput1.focus();
      else
        this.textInput9.focus();
    } else {
      this.setState({ disableBtn: true });

      const url = "/client";
      const createClient  = {
        name        : this.state.name,
        defaultRate : this.state.defaultRate,

        email         : this.state.email  || null,
        address       : this.state.address  || null,
        city          : this.state.city  || null,
        province      : this.state.province || null,
        phone         : this.state.phone || null,
        postalCode    : this.state.postalCode || null,
        typeOfService : this.state.typeOfService || null,
      }

      try {
        const addClient = await axios.post( 
          url, 
          createClient,
          {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${this.props.storeToken}` }
        });

        if (addClient.data.message) {

          this.setState({
            message       : <p>Client <b>{this.state.name}</b> has been created.</p>,
            className     : "messageSuccess",
            name          : "",
            email         : "",
            phone         : "",
            address       : "",
            city          : "",
            province      : "",
            postalCode    : "",
            typeOfService : "",
            defaultRate   : "",
            typeKid       : false
          });

        } else if (addClient.data.error) {
          this.setState({
            message   : addClient.data.error,
            className : "messageFailure" });
          }
          
      } catch(err) {
        this.setState({
          message : err.message,
          className : "messageFailure"
        });
        
      }
      this.clearMessage();
    }
  }


  //it clears the error message after 3.5s
  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message     : "",
        disableBtn  : false
      })
      this.textInput1.focus();
    }, 3500);
  }



  render() {
    return (
      <div className="formPosition">
        <br />
        <Card className="card-settings">
          <Card.Header>
            <h2>New General Client</h2>
          </Card.Header>
          <Form
            autoComplete  = {"off"}
            className     = "formPosition"
            style         = {{width: "30rem"}}
            onSubmit      = {this.handleSubmit}
          >

            <Form.Group controlId="formName">
              <br />
              <Form.Label className="cardLabel">Name</Form.Label>
              <Form.Control
                required
                autoFocus   = {true}
                type        = "text"
                placeholder = "Client's name"
                name        = "name"
                onChange    = {this.handleChange}
                value       = {this.state.name}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput1 = input } />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label className="cardLabel">Email</Form.Label>
              <Form.Control
                type        = "email"
                pattern     = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                placeholder = "Client's email"
                name        = "email"
                onChange    = {this.handleChange}
                value       = {this.state.email}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput2 = input } />
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Label className="cardLabel">Phone</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Client's phone"
                name        = "phone"
                onChange    = {this.handleChange}
                value       = {this.state.phone}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput3 = input } />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Label className="cardLabel">Address</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "street, place.."
                name        = "address"
                onChange    = {this.handleChange}
                value       = {this.state.address}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput4 = input } />
            </Form.Group>

            <Form.Group controlId="formCity">
              <Form.Label className="cardLabel">City</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "city"
                name        = "city"
                onChange    = {this.handleChange}
                value       = {this.state.city}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput5 = input } />
            </Form.Group>

            <Form.Group controlId="formProvince">
              <Form.Label className="cardLabel">Province</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "province"
                name        = "province"
                onChange    = {this.handleChange}
                value       = {this.state.province}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput6 = input } />
            </Form.Group>

            <Form.Group controlId="formPostalCode">
              <Form.Label className="cardLabel">Postal Code</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "postal code"
                name        = "postalCode"
                onChange    = {this.handleChange}
                value       = {this.state.postalCode}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput7 = input } />
            </Form.Group>

            <Form.Group controlId="formTypeOfService">
              <Form.Label className="cardLabel">Type of service</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Categorize the service provided by you"
                name        = "typeOfService"
                onChange    = {this.handleChange}
                value       = {this.state.typeOfService}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput8 = input } />
            </Form.Group>

            <Form.Group controlId="formDefaultRate">
              <Form.Label className="cardLabel">Rate</Form.Label>
              <Form.Control
                required
                type        = "number"
                placeholder = "Hourly rate - CAD$"
                name        = "defaultRate"
                onChange    = {this.handleChange}
                value       = {this.state.defaultRate}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput9 = input }  />
            </Form.Group>

          <Card.Footer className={ this.state.className }>          
            { this.state.message
              ? this.state.message
              : <br /> }
          </Card.Footer>

          <div className="d-flex flex-column">
            <Button
              disabled  = { this.state.disableBtn }
              variant   = "primary" 
              type      = "submit"
              ref       = {input => this.buttonSave = input}
            >
            Save
            </Button>
          </div>
          </Form>
        </Card>

        <br></br>
        <br></br>

      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken: store.token
  };
};


export default connect(mapStateToProps, null)(ClientGeneralNew)
