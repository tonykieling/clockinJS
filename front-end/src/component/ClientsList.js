import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import {  Card, Button, Form } from "react-bootstrap";
import MaskedInput from 'react-text-mask';

// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import moment from "moment";

import GetClients from "./aux/GetClients.js";


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
    }
  }


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value || ""
    });
  }


  handleChangeDate = incomingDate => {
    // Im not able to grab e.targe.name and e.target.value
    // console.log("e",e)
    // console.log("e", e.target.name, e.target.selected);
    // console.log("date", date);
    this.setState({
      birthday: incomingDate
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    const data = { 
      clientId      : this.state.clientId,
      name          : this.state.name,
      nickname      : this.state.nickname,
      birthday      : this.state.birthday,
      mother        : this.state.mother,
      mPhone        : this.state.mPhone,
      mEmail        : this.state.mEmail,
      father        : this.state.father,
      fPhone        : this.state.fPhone,
      fEmail        : this.state.fEmail,
      consultant    : this.state.consultant,
      cPhone        : this.state.cPhone,
      cEmail        : this.state.cEmail,
      default_rate  : this.state.default_rate
    };
console.log("sending to save: ", data.birthday);
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
        this.setState({
          message:      `${newClientData.data.newData.nickname} has been changed`,
          name          : newClientData.data.newData.name,
          nickname      : newClientData.data.newData.nickname,
          birthday      : new Date(newClientData.data.newData.birthday.toLocaleString('en-US', { timeZone: "UTC" })),
          mother        : newClientData.data.newData.mother,
          mPhone        : newClientData.data.newData.mPhone,
          mEmail        : newClientData.data.newData.mEmail,
          father        : newClientData.data.newData.father,
          fPhone        : newClientData.data.newData.fPhone,
          fEmail        : newClientData.data.newData.fEmail,
          cPhone        : newClientData.data.newData.cPhone,
          cEmail        : newClientData.data.newData.cEmail,
          consultant    : newClientData.data.newData.consultant,
          default_rate  : newClientData.data.newData.default_rate
        });
      } else if (newClientData.data.error)
        this.setState({
          message: newClientData.data.error
        });

      this.cleanForm();
      
    } catch(err) {
      this.setState({
        message: err.message });
      
    }
  }


  cleanForm = () => {
    this.setState({
      disableEditForm: true
    });

    setTimeout(() => {
      this.setState({
        message: ""
      });
    }, 3000);
  }


  getClientInfo = client => {
    this.populateForm(client);
  }


  populateForm = client => {
    const {
      _id, name, nickname,  mother, mPhone, mEmail, father, fPhone, fEmail, 
      consultant, cPhone, cEmail, default_rate } = client;
    // const birthday = new Date(client.birthday);
    // let utcDate = new Date(birthday.toLocaleString('en-US', { timeZone: "UTC" }));
    const birthday = new Date(client.birthday.toLocaleString('en-US', { timeZone: "UTC" }));
    this.setState({
      clientId: _id,
      name,
      nickname,
      // birthday: utcDate,
      birthday,
      mother,
      mPhone,
      mEmail,
      father,
      fPhone,
      fEmail,
      consultant,
      cPhone,
      cEmail,
      default_rate,

      disableEditForm: true
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
      tmp_default_rate    : this.state.default_rate
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
      default_rate    : this.state.tmp_default_rate      
    });
  }


  afterChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }


  render() {
// console.log("this.state", this.state);
// console.log("moment:", moment(this.state.birthday).format("D/M/YYYY"));

    return (
      <div className="formPosition">
        <h3> Your clients' list </h3>
        <p>Select the client to check or modify their data.</p>

        <Card className="card-settings">
        <Card.Body>
          <Card.Title>Clients:</Card.Title>

         <GetClients getClientInfo = { this.getClientInfo } />     { /* mount the Dropbox Button with all clients for the user */ }

        </Card.Body>
      </Card>        

      { this.state.clientId
        ? 
          <div>
            <Card className="card-settings">
              <Form autoComplete="off"
                onSubmit  = {this.handleSubmit}
                className = "formPosition" >

                <Form.Group controlId="formName">
                  <Form.Label className="cardLabel">Name</Form.Label>
                  <Form.Control
                    // autoFocus   = {true}
                    type        = "text"
                    placeholder = {this.state.name || "Type the client's name"}
                    name        = "name"
                    onChange    = {this.handleChange}
                    value       = {this.state.name}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    // ref         = {input => this.textInput1 = input }
                    />
                </Form.Group>

                <Form.Group controlId="formNickname">
                  <Form.Label className="cardLabel">Nickname</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.nickname || "Type the client's nickname"}
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
                    placeholder = "Type the client's birthday"
                    name        = "birthday"
                    onChange    = {this.handleChange}
                    value       = {this.state.birthday}
                    onKeyPress  = {this.handleChange}
                    disabled  = {this.state.disableEditForm}
                    ref         = {input => this.textInput3 = input } />                  
                  {/* <br />
                  <DatePicker
                    selected  = {this.state.birthday}
                    onSelect  ={this.handleChangeDate}
                    // dateFormat="dd/MM/yyyy"
                    // dateFormat = "MMMM eeee d, yyyy h:mm aa"
                    dateFormat = "MMMM d, yyyy"
                    // onChange = {this.handleChangeDate}
                    className = "form-control"
                    disabled  = {this.state.disableEditForm}
                  />
                  <br /> */}
                </Form.Group>

                <Form.Group controlId="formMother">
                  <Form.Label className="cardLabel">Mother</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = { this.state.mother || "Type the client's mother name"}
                    name        = "mother"
                    onChange    = {this.handleChange}
                    value       = {this.state.mother}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput4 = input } />
                </Form.Group>

                <Form.Group controlId="formMPhone">
                  <Form.Label className="cardLabel">Mother's Phone</Form.Label>
                  <MaskedInput
                    mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    className   = "form-control"
                    placeholder = "Enter mother's phone number"
                    name        = "mPhone"
                    id          = "mPhone"
                    onBlur      = {e => this.afterChange(e)}
                    value       = {this.state.mPhone}
                    onKeyPress  = {() => this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput5 = input } />
                </Form.Group>

                <Form.Group controlId="formMEmail">
                  <Form.Label className="cardLabel">Mother's Email address</Form.Label>
                  <Form.Control
                    type        = "email"
                    placeholder = {this.state.mEmail || "Type the mother's email"}
                    name        = "mEmail"
                    onChange    = {this.handleChange}
                    value       = {this.state.mEmail}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput6 = input } />
                </Form.Group>

                <Form.Group controlId="formFather">
                  <Form.Label className="cardLabel">Father</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.father || "Type the client's father name"}
                    name        = "father"
                    onChange    = {this.handleChange}
                    value       = {this.state.father}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput7 = input } />
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
                    ref         = {input => this.textInput8 = input } />
                </Form.Group>

                <Form.Group controlId="formFEmail">
                  <Form.Label className="cardLabel">Father's Email address</Form.Label>
                  <Form.Control
                    type        = "email"
                    placeholder = {this.state.fEmail || "Type the father's email"}
                    name        = "fEmail"
                    onChange    = {this.handleChange}
                    value       = {this.state.fEmail}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput9 = input } />
                </Form.Group>

                <Form.Group controlId="formConsultant">
                  <Form.Label className="cardLabel">Consultant</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.consultant || "Type the consultant's name"}
                    name        = "consultant"
                    onChange    = {this.handleChange}
                    value       = {this.state.consultant}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput10 = input }  />
                </Form.Group>

                <Form.Group controlId="formCPhone">
                  <Form.Label className="cardLabel">Consultant's Phone</Form.Label>
                  <MaskedInput
                    mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    className   = "form-control"
                    placeholder = "Enter consultant's phone number"
                    name        = "cPhone"
                    // guide={false}
                    id          = "cPhone"
                    onBlur      = {e => this.afterChange(e)}
                    value       = {this.state.cPhone}
                    onKeyPress  = {() => this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput11 = input } />
                </Form.Group>

                <Form.Group controlId="formCEmail">
                  <Form.Label className="cardLabel">Consultant's Email address</Form.Label>
                  <Form.Control
                    type        = "email"
                    placeholder = {this.state.cEmail || "Type the consultant's email"}
                    name        = "cEmail"
                    onChange    = {this.handleChange}
                    value       = {this.state.cEmail}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput12 = input }  />
                </Form.Group>

                <Form.Group controlId="formDefaultRate">
                  <Form.Label className="cardLabel">Rate</Form.Label>
                  <Form.Control
                    type        = "text"
                    placeholder = {this.state.default_rate || "Type the hourly rate - CAD$"}
                    name        = "default_rate"
                    onChange    = {this.handleChange}
                    value       = {this.state.default_rate}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm}
                    ref         = {input => this.textInput13 = input }  />
                </Form.Group>





          <Card.Header className="cardTitle message">          
            { this.state.message
              ? this.state.message
              : <span className="noMessage">.</span> }
          </Card.Header>

          { !this.state.disableEditForm
            ?
              <div className="gridBtnSC">
                <Button 
                  variant = "success" 
                  onClick = {this.handleSubmit} >
                  Save
                </Button>

                <Button 
                  variant="warning" 
                  onClick={ this.btnCancel } >
                  Cancel
                </Button>
              </div>
            :
              <Button 
                className="gridBtnEdit"
                onClick = { this.editForm } >
                Edit
              </Button>
          }
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
