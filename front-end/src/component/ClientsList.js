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
      defaultRate    : "",
      typeKid         : "",

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
      tmp_defaultRate     : "",

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

    event.target.name === "name"        && this.state.messageControlName && this.setState({ messageControlName: ""});
    event.target.name === "nickname"    && this.state.messageControlNickname && this.setState({ messageControlNickname: ""});
    event.target.name === "defaultRate" && this.state.messageControlDefaultRate && this.setState({ messageControlDefaultRate: ""});

  }


  handlePostalCode = event => {
    const newValue = event.target.value;
    this.setState({
      postalCode: isNaN(newValue) ? newValue.toUpperCase() : newValue 
    });
  }


  handleSubmit = async event => {
    event.preventDefault();

    const
      name        = this.state.name ? this.state.name.trim() : false,
      nickname    = this.state.nickname ? this.state.nickname.trim() : false,
      defaultRate = this.state.defaultRate ? this.state.defaultRate.trim() : false;

    if (!name || !defaultRate || (this.state.typeKid ? !nickname : false)) {
      if (!defaultRate) {
        this.setState({ messageControlDefaultRate: "Please inform the default rate($)."})
        this.textInput13.focus();
      }

      if (this.state.typeKid)
        if (!nickname) {
          window.scrollTo(0, 0);
          this.setState({ messageControlNickname: "Please inform Client's nickname."})
          this.textInput2.focus();
        }

      if (!name) {
        window.scrollTo(0, 0);
        this.setState({ messageControlName: "Please inform Client's name."})
        this.textInput1.focus();
      }
    } else {

      const data = { 
        clientId      : this.state.clientId || undefined,
        name,
        default_rate  : defaultRate,

        nickname      : this.state.typeKid ? nickname : undefined,
        birthday      : this.state.birthday || (this.state.tmp_birthday ? " " : undefined),
        mother        : this.state.mother || (this.state.tmp_mother ? " " : undefined),
        mPhone        : this.state.mPhone || (this.state.tmp_mPhone ? " " : undefined),
        mEmail        : this.state.mEmail || (this.state.tmp_mEmail ? " " : undefined),
        father        : this.state.father || (this.state.tmp_father ? " " : undefined),
        fPhone        : this.state.fPhone || (this.state.tmp_fPhone ? " " : undefined),
        fEmail        : this.state.fEmail || (this.state.tmp_fEmail ? " " : undefined),
        consultant    : this.state.consultant || (this.state.tmp_consultant ? " " : undefined),
        cPhone        : this.state.cPhone || (this.state.tmp_cPhone ? " " : undefined),
        cEmail        : this.state.cEmail || (this.state.tmp_cEmail ? " " : undefined),
        typeKid       : this.state.typeKid ? true : false,

        email           : this.state.email,
        phone           : this.state.phone,
        city            : this.state.city,
        address         : this.state.address,
        province        : this.state.province,
        postal_code     : this.state.postalCode,
        type_of_service : this.state.typeOfService  
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
              defaultRate  : newClientData.data.newData.default_rate || "",
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
      _id, name, nickname, birthday, mother, father, consultant
    } = client;

      this.setState({
        clientId: _id,
        name        : name || "",
        defaultRate :  client.default_rate,

        birthday    : birthday ? handlingDate.receivingDate(birthday) : "",
        nickname    : nickname || "",
        mother      : mother || "",
        mPhone      : client.mphone || "",
        mEmail      : client.memail || "",
        father      : father || "",
        fPhone      : client.fphone || "",
        fEmail      : client.femail || "",
        consultant  : consultant || "",
        cPhone      : client.cphone || "",
        cEmail      : client.cemail || "",
        typeKid     : client.type_kid,

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
      tmp_defaultRate     : this.state.defaultRate,

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
      defaultRate     : this.state.tmp_defaultRate,

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


  handleCheckPostalCode = event => {
    console.log("value:", event.target.value);
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
                    ref         = {input => this.textInput1 = input }
                    />
                  <Form.Text className="messageControl-user">
                    {this.state.messageControlName}
                  </Form.Text>
                </Form.Group>
                { this.state.typeKid
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
                          ref         = {input => this.textInput2 = input } 
                          />
                        <Form.Text className="messageControl-user">
                          {this.state.messageControlNickname}
                        </Form.Text>
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
                          pattern     = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
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
                          pattern     = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                          placeholder = {"Type father's email"}
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
                          placeholder = {"Type consultant's name"}
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
                          pattern     = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                          placeholder = {"Type consultant's email"}
                          name        = "cEmail"
                          onChange    = {this.handleChange}
                          value       = {this.state.cEmail}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          // ref         = {input => this.textInput12 = input }  
                        />
                      </Form.Group>
                    </div>
                  :
                    <div>
                      <Form.Group controlId="formEmail">
                        <Form.Label className="cardLabel">Email</Form.Label>
                        <Form.Control
                          type        = "email"
                          pattern     = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                          placeholder = {"Type client's email"}
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
                        <MaskedInput
                          mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                          className   = "form-control"
                          placeholder = "Enter client's phone number"
                          name        = "phone"
                          onBlur      = {e => this.afterChange(e)}
                          value       = {this.state.phone}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                        />
                      </Form.Group>
                      <Form.Group controlId="formCity">
                        <Form.Label className="cardLabel">City</Form.Label>
                        <Form.Control
                          type        = "text"
                          placeholder = {"Type client's city"}
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
                          placeholder = {"Type client's address"}
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
                          placeholder = {"Type client's province"}
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
                        <Form.Check 
                          inline 
                          label     = " outside Canada"
                          type      = "checkbox"
                          style     = {{marginLeft: "1rem"}}
                          onChange  = {this.handleCheckPostalCode}
                        />
                        <MaskedInput
                          mask        = {[/[A-Z]/i, /\d/, /[A-Z]/i, ' ', /\d/, /[A-Z]/i, /\d/]}
                          className   = "form-control"
                          placeholder = "Enter client's postal code"
                          name        = "postalCode"
                          value       = {this.state.postalCode}
                          onChange    = {this.handlePostalCode}
                          disabled    = {this.state.disableEditForm}
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
                      <Form.Group controlId="formDefaultRate">
                        <Form.Label className="cardLabel">Rate</Form.Label>
                        <Form.Control
                          type        = "number"
                          placeholder = {"Type the hourly rate - CAD$"}
                          name        = "defaultRate"
                          onChange    = {this.handleChange}
                          value       = {this.state.defaultRate}
                          onKeyPress  = {this.handleChange}
                          disabled    = {this.state.disableEditForm}
                          ref         = {input => this.textInput13 = input }  
                        />
                        <Form.Text className="messageControl-user">
                          {this.state.messageControlDefaultRate}
                        </Form.Text>
                      </Form.Group>

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
                    type    = "submit"
                  >
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
