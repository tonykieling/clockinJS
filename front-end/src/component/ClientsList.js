import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import {  Card, Button, Form, ButtonGroup } from "react-bootstrap";
import MaskedInput from 'react-text-mask';
import "react-datepicker/dist/react-datepicker.css";
import GetClients from "./aux/GetClients.js";
import * as handlingDate from "./aux/handlingDT.js";


class ClientsList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      message         : "",
      disableEditForm : true,

      clientId        : "",
      name            : "",
      nickname        : "",
      birthday        : "",
      mother          : "",
      mPhone          : "",
      mEmail          : "",
      father          : "",
      fPhone          : "",
      fEmail          : "",
      consultant      : "",
      cPhone          : "",
      cEmail          : "",
      default_rate    : "",
      type_kid        : "",

      tmp_name            : "",
      tmp_nickname        : "",
      tmp_birthday        : "",
      tmp_mother          : "",
      tmp_mPhone          : "",
      tmp_mEmail          : "",
      tmp_father          : "",
      tmp_fPhone          : "",
      tmp_fEmail          : "",
      tmp_consultant      : "",
      tmp_cPhone          : "",
      tmp_cEmail          : "",
      tmp_default_rate    : "",

      className           : "",

      email         : "",
      phone         : "",
      city          : "",
      address       : "",
      province      : "",
      postalCode    : "",
      typeOfService : "",
      tmp_email         : "",
      tmp_phone         : "",
      tmp_city          : "",
      tmp_address       : "",
      tmp_province      : "",
      tmp_postalCode    : "",
      tmp_typeOfService : "",

      updateButton      : true
    }
  }


  handleChange = event => {
      this.setState({
        [event.target.name]: event.target.value || ""
      });
  }


  handleSubmit = async event => {
    event.preventDefault();

    const data = { 
      clientId      : this.state.clientId || undefined,
      name          : this.state.name || undefined,
      nickname      : this.state.nickname || undefined,
      birthday      : this.state.birthday || undefined,
      mother        : this.state.mother || undefined,
      mPhone        : this.state.mPhone || undefined,
      mEmail        : this.state.mEmail || undefined,
      father        : this.state.father || undefined,
      fPhone        : this.state.fPhone || undefined,
      fEmail        : this.state.fEmail || undefined,
      consultant    : this.state.consultant || undefined,
      cPhone        : this.state.cPhone || undefined,
      cEmail        : this.state.cEmail || undefined,
      default_rate  : this.state.default_rate || undefined,

      email           : this.state.email || undefined,
      phone           : this.state.phone || undefined,
      city            : this.state.city || undefined,
      address         : this.state.address || undefined,
      province        : this.state.province || undefined,
      postal_code     : this.state.postalCode || undefined,
      type_of_service : this.state.typeOfService || undefined
    };
    
    const url = `/client/${data.clientId}`;

    try {
      const newClientData = await axios.patch( 
        url,
        data,
        {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${this.props.storeToken}` }
      });
      if (newClientData.data.message) {
        if (newClientData.data.newData)
          this.setState({
            message:      `${newClientData.data.newData.nickname || newClientData.data.newData.name} has been changed`,
            name          : newClientData.data.newData.name || "",
            nickname      : newClientData.data.newData.nickname || "",
            birthday      : newClientData.data.newData.birthday ? handlingDate.receivingDate(newClientData.data.newData.birthday) : "",
            mother        : newClientData.data.newData.mother || "",
            mPhone        : newClientData.data.newData.mphone || "",
            mEmail        : newClientData.data.newData.memail || "",
            father        : newClientData.data.newData.father || "",
            fPhone        : newClientData.data.newData.fphone || "",
            fEmail        : newClientData.data.newData.femail || "",
            cPhone        : newClientData.data.newData.cphone || "",
            cEmail        : newClientData.data.newData.cemail || "",
            consultant    : newClientData.data.newData.consultant || "",
            default_rate  : newClientData.data.newData.default_rate || "",
            className     : "messageSuccess",
            email           : newClientData.data.newData.email || "",
            phone           : newClientData.data.newData.phone || "",
            city            : newClientData.data.newData.city || "",
            address         : newClientData.data.newData.address || "",
            province        : newClientData.data.newData.province || "",
            postal_code     : newClientData.data.newData.postalCode || "",
            type_of_service : newClientData.data.newData.typeOfService || "",
            updateButton    : true
          });
        else
          this.setState({
            message   : newClientData.data.message,
            className : "messageSuccess"
          });        
      } else if (newClientData.data.error)
        this.setState({
          message   : newClientData.data.error,
          className : "messageFailure"
        });
      
    } catch(err) {
      this.setState({
        message   : err.message,
        className : "messageFailure"
      });
    }

    this.clearMessage();
  }


  clearMessage = () => {
    this.setState({
      disableEditForm : true
    });

    setTimeout(() => {
      this.setState({
        message: ""
      });
    }, 3000);
  }


  getClientInfo = client => {
    const {
      _id, name, nickname,  mother, father, consultant, default_rate, type_kid
    } = client;

      this.setState({
        clientId: _id,
        birthday: client.birthday ? handlingDate.receivingDate(client.birthday) : "",
        name      : name || "",
        nickname  : nickname || "",
        mother    : mother || "",
        mPhone    : client.mphone || "",
        mEmail    : client.memail || "",
        father    : father || "",
        fPhone    : client.fphone || "",
        fEmail    : client.femail || "",
        consultant  : consultant || "",
        cPhone    : client.cphone || "",
        cEmail    : client.cemail || "",
        default_rate,
        type_kid,

        email         : client.email || "",
        phone         : client.phone || "",
        city          : client.city || "",
        address       : client.address || "",
        province      : client.province || "",
        postalCode    : client.postal_code || "",
        typeOfService : client.type_of_service || "",

        disableEditForm : true,
        updateButton    : false
      });
  }


  editForm = () => {
    this.setState({
      disableEditForm: false,

      tmp_name            : this.state.name,
      tmp_nickname        : this.state.nickname,
      tmp_birthday        : this.state.birthday,
      tmp_mother          : this.state.mother,
      tmp_mPhone          : this.state.mPhone,
      tmp_mEmail          : this.state.mEmail,
      tmp_father          : this.state.father,
      tmp_fPhone          : this.state.fPhone,
      tmp_fEmail          : this.state.fEmail,
      tmp_consultant      : this.state.consultant,
      tmp_cPhone          : this.state.cPhone,
      tmp_cEmail          : this.state.cEmail,
      tmp_default_rate    : this.state.default_rate,

      tmp_email         : this.state.email,
      tmp_phone         : this.state.phone,
      tmp_city          : this.state.city,
      tmp_address       : this.state.address,
      tmp_province      : this.state.province,
      tmp_postalCode    : this.state.postalCode,
      tmp_typeOfService : this.state.typeOfService
    });
  }


  btnCancel = () => {
    this.setState({
      disableEditForm: true,

      name            : this.state.tmp_name,
      nickname        : this.state.tmp_nickname,
      birthday        : this.state.tmp_birthday,
      mother          : this.state.tmp_mother,
      mPhone          : this.state.tmp_mPhone,
      mEmail          : this.state.tmp_mEmail,
      father          : this.state.tmp_father,
      fPhone          : this.state.tmp_fPhone,
      fEmail          : this.state.tmp_fEmail,
      consultant      : this.state.tmp_consultant,
      cPhone          : this.state.tmp_cPhone,
      cEmail          : this.state.tmp_cEmail,
      default_rate    : this.state.tmp_default_rate,

      email         : this.state.tmp_email,
      phone         : this.state.tmp_phone,
      city          : this.state.tmp_city,
      address       : this.state.tmp_address,
      province      : this.state.tmp_province,
      postalCode    : this.state.tmp_postalCode,
      typeOfService : this.state.tmp_typeOfService,
    });
  }


  afterChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  render() {
    return (
      <div className="formPosition">
        <br />
        <Card className="card-settings">
          <Card.Header>Your Client's list</Card.Header>
        <Card.Body>
          <GetClients 
            getClientInfo = { this.getClientInfo }     /* mount the Dropbox Button with all clients for the user */
            updateButton  = { this.state.updateButton}
          />
        </Card.Body>
      </Card>        

      { this.state.clientId
        ? 
          <div>
            <Card className="card-settings">
              <Form 
                autoComplete  = {"off"}
                onSubmit      = {this.handleSubmit}
                className     = "formPosition"
                style         = {{width: "30rem"}}
              >

                <Form.Group controlId="formName">
                  <Form.Label className="cardLabel">Name</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {"Type the client's name"}
                    name        = "name"
                    onChange    = {this.handleChange}
                    value       = {this.state.name}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    // ref         = {input => this.name = input }
                    />
                </Form.Group>
                { this.state.type_kid
                  ?
                    <div>
                      <Form.Group controlId="formNickname">
                        <Form.Label className="cardLabel">Nickname</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type the client's nickname"}
                          name        = "nickname"
                          onChange    = {this.handleChange}
                          value       = {this.state.nickname}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput2 = input } 
                          />
                      </Form.Group>

                      <Form.Group controlId="formBirthday">
                        <Form.Label className="cardLabel">Birthday</Form.Label>
                        <Form.Control
                          type        = "date"
                          name        = "birthday"
                          onChange    = {this.handleChange}
                          value       = {this.state.birthday}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.birthday = input } 
                        />
                      </Form.Group>

                      <Form.Group controlId="formMother">
                        <Form.Label className="cardLabel">Mother</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = { "Type the client's mother name"}
                          name        = "mother"
                          onChange    = {this.handleChange}
                          value       = {this.state.mother}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput4 = input } 
                        />
                      </Form.Group>

                      <Form.Group controlId="formMPhone">
                        <Form.Label className="cardLabel">Mother's Phone</Form.Label>
                        <MaskedInput
                          mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                          className   = "form-control"
                          placeholder = "Enter mother's phone number"
                          name        = "mPhone"
                          // id          = "mPhone"
                          onBlur      = {e => this.afterChange(e)}
                          value       = {this.state.mPhone}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput5 = input } 
                        />
                      </Form.Group>

                      <Form.Group controlId="formMEmail">
                        <Form.Label className="cardLabel">Mother's Email address</Form.Label>
                        <Form.Control
                          type        = "email"
                          placeholder = {"Type the mother's email"}
                          name        = "mEmail"
                          onChange    = {this.handleChange}
                          value       = {this.state.mEmail}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput6 = input } 
                        />
                      </Form.Group>

                      <Form.Group controlId="formFather">
                        <Form.Label className="cardLabel">Father</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type the client's father name"}
                          name        = "father"
                          onChange    = {this.handleChange}
                          value       = {this.state.father}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput7 = input } 
                        />
                      </Form.Group>

                      <Form.Group controlId="formFPhone">
                        <Form.Label className="cardLabel">Father's Phone</Form.Label>
                        <MaskedInput
                          mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                          className   = "form-control"
                          placeholder = "Enter father's phone number"
                          name        = "fPhone"
                          id          = "fPhone"
                          onBlur      = {e => this.afterChange(e)}
                          value       = {this.state.fPhone}
                          onKeyPress  = {() => this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput8 = input } 
                        />
                      </Form.Group>

                      <Form.Group controlId="formFEmail">
                        <Form.Label className="cardLabel">Father's Email address</Form.Label>
                        <Form.Control
                          type        = "email"
                          placeholder = {"Type the father's email"}
                          name        = "fEmail"
                          onChange    = {this.handleChange}
                          value       = {this.state.fEmail}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput9 = input } 
                        />
                      </Form.Group>

                      <Form.Group controlId="formConsultant">
                        <Form.Label className="cardLabel">Consultant</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type the consultant's name"}
                          name        = "consultant"
                          onChange    = {this.handleChange}
                          value       = {this.state.consultant}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput10 = input }  
                        />
                      </Form.Group>

                      <Form.Group controlId="formCPhone">
                        <Form.Label className="cardLabel">Consultant's Phone</Form.Label>
                        <MaskedInput
                          mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                          className   = "form-control"
                          placeholder = "Enter consultant's phone number"
                          name        = "cPhone"
                          id          = "cPhone"
                          onBlur      = {e => this.afterChange(e)}
                          value       = {this.state.cPhone}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput11 = input } 
                        />
                      </Form.Group>

                      <Form.Group controlId="formCEmail">
                        <Form.Label className="cardLabel">Consultant's Email address</Form.Label>
                        <Form.Control
                          type        = "email"
                          placeholder = {"Type the consultant's email"}
                          name        = "cEmail"
                          onChange    = {this.handleChange}
                          value       = {this.state.cEmail}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput12 = input }  
                        />
                      </Form.Group>

                      <Form.Group controlId="formDefaultRate">
                        <Form.Label className="cardLabel">Rate</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type the hourly rate - CAD$"}
                          name        = "default_rate"
                          onChange    = {this.handleChange}
                          value       = {this.state.default_rate}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput13 = input }  
                        />
                      </Form.Group>
                    </div>
                  :
                    <div>
                      <Form.Group controlId="formEmail">
                        <Form.Label className="cardLabel">Email</Form.Label>
                        <Form.Control
                          type        = "email"
                          placeholder = {"Type the client's email"}
                          name        = "email"
                          onChange    = {this.handleChange}
                          value       = {this.state.email}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.email = input }
                        />
                      </Form.Group>
                      <Form.Group controlId="formPhone">
                        <Form.Label className="cardLabel">Phone</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type the client's phone"}
                          name        = "phone"
                          onChange    = {this.handleChange}
                          value       = {this.state.phone}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.phone = input }
                        />
                      </Form.Group>
                      <Form.Group controlId="formCity">
                        <Form.Label className="cardLabel">City</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type the client's city"}
                          name        = "city"
                          onChange    = {this.handleChange}
                          value       = {this.state.city}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.city = input }
                        />
                      </Form.Group>
                      <Form.Group controlId="formAddress">
                        <Form.Label className="cardLabel">Address</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type the client's address"}
                          name        = "address"
                          onChange    = {this.handleChange}
                          value       = {this.state.address}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.address = input }
                        />
                      </Form.Group>
                      <Form.Group controlId="formProvince">
                        <Form.Label className="cardLabel">Province</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type the client's province"}
                          name        = "province"
                          onChange    = {this.handleChange}
                          value       = {this.state.province}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.province = input }
                        />
                      </Form.Group>
                      <Form.Group controlId="formPostalCode">
                        <Form.Label className="cardLabel">Postal Code</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type the client's postal code"}
                          name        = "postalCode"
                          onChange    = {this.handleChange}
                          value       = {this.state.postalCode}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.postalCode = input }
                        />
                      </Form.Group>
                      <Form.Group controlId="formTypeOfService">
                        <Form.Label className="cardLabel">Type of Service</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type the type of service your are doing"}
                          name        = "typeOfService"
                          onChange    = {this.handleChange}
                          value       = {this.state.typeOfService}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.typeOfService = input }
                        />
                      </Form.Group>
                    </div>
                }

          <Card.Footer className={this.state.className}>
            { this.state.message
              ? this.state.message
              : <br /> }
          </Card.Footer>

          <div className="d-flex flex-column">
            { !this.state.disableEditForm
              ?
                <ButtonGroup>
                  <Button 
                    variant = "success"
                    style   = { {width: "50%"}}
                    onClick = {this.handleSubmit} >
                    Save
                  </Button>

                  <Button 
                    variant="warning"
                    style   = { {width: "50%"}}
                    onClick={ this.btnCancel } >
                    Cancel
                  </Button>
                </ButtonGroup>
              :
                <Button 
                  style   = { {width: "100%"}}
                  onClick = { this.editForm } 
                  ref     = { input => this.textInputX = input }
                  >
                  Edit
                </Button>
            }
          </div>
          </Form>
        </Card>
        <br></br>
        <br></br>

          </div>
        : null
      }
      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken    : store.token
  };
};



export default connect(mapStateToProps, null)(ClientsList);
