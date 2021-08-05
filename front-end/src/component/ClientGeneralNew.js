import React, { Component } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from "axios";
import MaskedInput from 'react-text-mask';



class ClientGeneralNew extends Component {

  state = {
      name            : "",
      defaultRate     : "",
      message         : "",
      className       : "",
      disableBtn      : false,

      email           : "",
      typeOfService   : "",
      address         : "",
      city            : "",
      province        : "",
      postalCode      : "",
      phone           : "",
      messageControlName        : "",
      messageControlDefaultRate : "",

      pcOutsideCanada   : false
    }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });

    e.target.name === "name"        && this.state.messageControlName && this.setState({ messageControlName: ""});
    e.target.name === "defaultRate" && this.state.messageControlDefaultRate && this.setState({ messageControlDefaultRate: ""});
  }


  handlePostalCode = event => {
    const newValue = event.target.value;
    this.setState({
      postalCode: isNaN(newValue) ? newValue.toUpperCase() : newValue 
    });
  }


  handleCheckPostalCode = () => {
    this.setState({
      pcOutsideCanada   : !this.state.pcOutsideCanada
    });
  }


  handleSubmit = async e => {
    e.preventDefault();
    window.scrollTo(0, 2000);
    if (!this.state.name || !this.state.defaultRate) {
      if (!this.state.defaultRate) {
        this.setState({ messageControlDefaultRate: "Please inform the default rate($)."})
        this.textInput9.focus();
      }
      
      if (!this.state.name) {
        window.scrollTo(0, 0);
        this.setState({ messageControlName: "Please inform client's name."})
        this.textInput1.focus();
      }

    } else {
      this.setState({ disableBtn: true });

      const url = "/api/client";
      // const url = "https://clockinjs.herokuapp.com/client/";


      const postalCode = this.state.postalCode
        ? !this.state.pcOutsideCanada
          ? this.state.postalCode.substr(0, 7).split(" ").join("")
          : this.state.postalCode
        : undefined;

      const createClient  = {
        name          : this.state.name,
        defaultRate   : this.state.defaultRate,
        email         : this.state.email  || undefined,
        address       : this.state.address  || undefined,
        city          : this.state.city  || undefined,
        province      : this.state.province || undefined,
        phone         : this.state.phone || undefined,
        postalCode,
        typeOfService : this.state.typeOfService || undefined,
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
            defaultRate   : ""
          });

        } else if (addClient.data.error) {
          throw (addClient.data.error);
          }
          
      } catch(err) {
        window.scrollTo(0, 20000);
        this.setState({
          message : err.message || err,
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
        message         : "",
        disableBtn      : false,
        pcOutsideCanada : false
      })
      window.scrollTo(0, 0);
      this.textInput1.focus();
    }, 3500);
  }



  render() {
    return (
      <div className="formPosition">
        <br />
        <Card className="card-settings">
          <Card.Header>
            <h2>New Client</h2>
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
                autoFocus   = {true}
                type        = "text"
                placeholder = "Client's name"
                name        = "name"
                onChange    = {this.handleChange}
                value       = {this.state.name}
                onKeyPress  = {this.handleChange}
                disabled    = {this.state.disableBtn}
                ref         = {input => this.textInput1 = input } />
              <Form.Text className="messageControl-user">
                {this.state.messageControlName}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label className="cardLabel">Email</Form.Label>
              <Form.Control
                type        = "email"
                pattern     = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                placeholder = "Client's email"
                name        = "email"
                onChange    = {this.handleChange}
                value       = {this.state.email}
                onKeyPress  = {this.handleChange}
                disabled    = {this.state.disableBtn}
                ref         = {input => this.textInput2 = input } />
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Label className="cardLabel">Phone</Form.Label>
              <MaskedInput
                mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className   = "form-control"
                placeholder = "Client's phone number"
                name        = "phone"
                value       = {this.state.phone}
                onKeyPress  = {this.handleChange}
                disabled    = {this.state.disableBtn}
                // ref         = {input => this.textInput3 = input } 
              />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Label className="cardLabel">Address</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "street, place.."
                name        = "address"
                onChange    = {this.handleChange}
                value       = {this.state.address}
                disabled    = {this.state.disableBtn}
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
                disabled    = {this.state.disableBtn}
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
                disabled    = {this.state.disableBtn}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput6 = input } />
            </Form.Group>

            <Form.Group controlId="formPostalCode">
              <Form.Label className="cardLabel">Postal Code</Form.Label>
              <Form.Check 
                inline 
                label     = " outside Canada"
                checked   = {this.state.pcOutsideCanada}
                type      = "checkbox"
                style     = {{marginLeft: "1rem"}}
                onChange  = {this.handleCheckPostalCode}
                disabled  = {this.state.disableBtn}
              />
              { !this.state.pcOutsideCanada
                ?
                  <MaskedInput
                    mask        = {[/[A-Z]/i, /\d/, /[A-Z]/i, ' ', /\d/, /[A-Z]/i, /\d/]}
                    className   = "form-control"
                    placeholder = "Enter client's postal code"
                    name        = "postalCode"
                    value       = {this.state.postalCode}
                    onChange    = {this.handlePostalCode}
                    disabled    = {this.state.disableBtn}
                    />
                : 
                  <Form.Control
                    type        = "text"
                    placeholder = {"Enter client's postal code"}
                    name        = "postalCode"
                    onChange    = {this.handleChange}
                    value       = {this.state.postalCode}
                    disabled    = {this.state.disableBtn}
                    onKeyPress  = {this.handleChange}
                    ref         = {input => this.textInput7 = input }
                  />
              }
            </Form.Group>

            <Form.Group controlId="formTypeOfService">
              <Form.Label className="cardLabel">Type of service</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Categorize the service provided by you"
                name        = "typeOfService"
                onChange    = {this.handleChange}
                value       = {this.state.typeOfService}
                disabled    = {this.state.disableBtn}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput8 = input } />
            </Form.Group>

            <Form.Group controlId="formDefaultRate">
              <Form.Label className="cardLabel">Rate</Form.Label>
              <Form.Control
                // required
                type        = "number"
                placeholder = "Hourly rate - CAD$"
                name        = "defaultRate"
                onChange    = {this.handleChange}
                value       = {this.state.defaultRate}
                disabled    = {this.state.disableBtn}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput9 = input }  />
              <Form.Text className="messageControl-user">
                {this.state.messageControlDefaultRate}
              </Form.Text>
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
