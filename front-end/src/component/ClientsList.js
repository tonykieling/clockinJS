import React, { Component } from 'react'
import axios from "axios";
import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
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
      btStyleClass    : "gcbcred",

      client          : "",
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
      defaultRate     : "",
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

      updateButton      : false,
      pcOutsideCanada   : false,
      postalCodeChange  : false,

      inactive          : false,
      showRate          : true,
      showNotes         : true,
      tmp_showRate      : true,
      tmp_showNotes     : true,

      company             : "",
      linkClientToCompany : false,
      rateAsPerCompany    : false,
      disableRate         : false,
      companyRate         : "",
      sureCompany         : false,

      // updateDropDown      : false,
      tmp_linkClientToCompany : "",
      tmp_companyId           : "",
      linkedCompany           : ""
    }
  }


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
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

        birthday      : this.state.birthday || undefined,
        mother        : this.state.mother || (this.state.tmp_mother ? "" : undefined),
        mPhone        : this.state.mPhone || (this.state.tmp_mPhone ? "" : undefined),
        mEmail        : this.state.mEmail || (this.state.tmp_mEmail ? "" : undefined),
        father        : this.state.father || (this.state.tmp_father ? "" : undefined),
        fPhone        : this.state.fPhone || (this.state.tmp_fPhone ? "" : undefined),
        fEmail        : this.state.fEmail || (this.state.tmp_fEmail ? "" : undefined),
        consultant    : this.state.consultant || (this.state.tmp_consultant ? "" : undefined),
        cPhone        : this.state.cPhone || (this.state.tmp_cPhone ? "" : undefined),
        cEmail        : this.state.cEmail || (this.state.tmp_cEmail ? "" : undefined),
        typeKid       : this.state.typeKid || undefined,

        email           : this.state.email || (this.state.tmp_email ? "" : undefined),
        phone           : this.state.phone || (this.state.tmp_phone ? "" : undefined),
        city            : this.state.city || (this.state.tmp_city ? "" : undefined),
        address         : this.state.address || (this.state.tmp_address ? "" : undefined),
        province        : this.state.province || (this.state.tmp_province ? "" : undefined),
        postal_code     : this.state.postalCodeChange && !this.state.pcOutsideCanada
                            ? this.state.postalCode.substr(0, 6).split(" ").join("") 
                            : this.state.postalCode || undefined,
        type_of_service : this.state.typeOfService || (this.state.tmp_typeOfService ? "" : undefined),

        inactive        : this.state.inactive,
        showRate        : this.state.showRate,
        showNotes       : this.state.showNotes,

        // company         : this.state.tmp_linkClientToCompany && !this.state.company ? undefined : this.state.company._id,
        linkedCompany   : this.state.company ? this.state.company._id : undefined,
        rateAsPerCompany: this.state.company ? this.state.rateAsPerCompany : undefined
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
              name          : newClientData.data.newData.name,
              nickname      : newClientData.data.newData.nickname,
              birthday      : (newClientData.data.newData.birthday && handlingDate.receivingDate(newClientData.data.newData.birthday)) || "",
              mother        : newClientData.data.newData.mother || "",
              mPhone        : newClientData.data.newData.mphone || "",
              mEmail        : newClientData.data.newData.memail || "",
              father        : newClientData.data.newData.father || "",
              fPhone        : newClientData.data.newData.fphone || "",
              fEmail        : newClientData.data.newData.femail || "",
              cPhone        : newClientData.data.newData.cphone || "",
              cEmail        : newClientData.data.newData.cemail || "",
              consultant    : newClientData.data.newData.consultant || "",
              defaultRate   : newClientData.data.newData.default_rate || "",
              className     : "messageSuccess",
              email           : newClientData.data.newData.email || "",
              phone           : newClientData.data.newData.phone || "",
              city            : newClientData.data.newData.city || "",
              address         : newClientData.data.newData.address || "",
              province        : newClientData.data.newData.province || "",
              postal_code     : newClientData.data.newData.postalCode || "",
              type_of_service : newClientData.data.newData.typeOfService || "",
              updateButton    : !this.state.updateButton,
              
              inactive        : newClientData.data.newData.inactive || "",
              sureCompany     : false,
              linkClientToCompany : this.state.company || false
            });
          else
            this.setState({
              message   : newClientData.data.message,
              className : "messageSuccess",
              linkClientToCompany : this.state.company || false
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
      disableEditForm : true,
    });

    setTimeout(() => {
      this.setState({
        message: ""
      });
    }, 3000);
  }


  getClientInfo = client => {
    const {
      _id, name, nickname,
    } = client;

    this.setState({
      client,
      clientId        : _id,
      name,
      defaultRate     : client.default_rate,
      pcOutsideCanada : (client.postal_code && client.postal_code.length > 6) ? true : false,
      nickname,

      birthday    : (client.birthday && handlingDate.receivingDate(client.birthday)) || "",
      mother      : client.mother || "",
      mPhone      : client.mphone || "",
      mEmail      : client.memail || "",
      father      : client.father || "",
      fPhone      : client.fphone || "",
      fEmail      : client.femail || "",
      consultant  : client.consultant || "",
      cPhone      : client.cphone || "",
      cEmail      : client.cemail || "",
      typeKid     : client.type_kid || "",

      email         : client.email || "",
      phone         : client.phone || "",
      city          : client.city || "",
      address       : client.address || "",
      province      : client.province || "",
      postalCode    : client.postal_code || "",
      typeOfService : client.type_of_service || "",

      disableEditForm : true,
      // updateButton    : false,

      inactive        : client.inactive || "",
      showRate        : client.showRate || "",
      showNotes       : client.showNotes || "",

      linkClientToCompany   : client.linked_company ? true : false,
      companyId             : client.linked_company || "",
      rateAsPerCompany      : client.rate_as_per_company || ""
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
      tmp_typeOfService : this.state.typeOfService,

      tmp_inactive      : this.state.inactive,
      tmp_showRate      : this.state.showRate,
      tmp_showNotes     : this.state.showNotes,

      // updateDropDown    : true,
      tmp_linkClientToCompany : this.state.linkClientToCompany,
      tmp_companyId     : this.state.companyId
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

      inactive      : this.state.tmp_inactive,
      showRate      : this.state.tmp_showRate,
      showNotes     : this.state.tmp_showNotes,

      // linkClientToCompany : false,
      // company             : "",
      // sureCompany         : false
      // updateDropDown: false,
      linkClientToCompany : this.state.tmp_linkClientToCompany,
      companyId           : this.state.tmp_companyId
    });
  }


  afterChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleCheckPostalCode = () => {
    this.setState({
      pcOutsideCanada   : !this.state.pcOutsideCanada,
      postalCodeChange  : !this.state.postalCodeChange
    });
  }


  /**
   * this method shows the option to link a client to a company
   */
  YNComponent = () => {
    return  <React.Fragment>
              <Form.Group controlId="formLinkClient">
                <Form.Label className="cardLabel form-check-inline"> Link Client to a Company? </Form.Label>
                {/* <Form.Group className = "form-check-inline"> */}
                  <Form.Check
                      // style     = { window.innerWidth <= 700 ? {marginLeft: "1rem"} : {marginLeft: "2rem"}}
                      style     = {{marginLeft: "2rem"}}
                      inline
                      label     = "Yes"
                      checked   = { this.state.linkClientToCompany}
                      type      = "radio"
                      disabled  = { this.state.disableEditForm}
                      onChange  = { () => this.setState({ 
                                      linkClientToCompany : true,
                                      rateAsPerCompany    : this.state.sureCompany ? true : undefined,
                                      disableRate         : true
                                  })}
                    />
                  <Form.Check 
                    inline
                    label     = "No"
                    checked   = { !this.state.linkClientToCompany}
                    type      = "radio"
                    style     = {{marginLeft: "1rem"}}
                    disabled  = { this.state.disableEditForm}
                    onChange  = { () => this.setState({ 
                                    linkClientToCompany : false,
                                    disableRate         : false,
                                    defaultRate         : this.state.tmp_defaultRate,
                                    company             : "",
                                    rateAsPerCompany    : false,
                                    companyId           : ""
                                })}
                  />

                { this.state.linkClientToCompany &&
                    <div className = "gridClientBtContainer">
                      <GetClients
                        companyId       = { this.state.companyId}
                        client          = { this.state.company }
                        notKidFlag      = { true}
                        clientListFlag  = { true}
                        sureCompany     = { this.sureCompany}
                        getCompanyInfo  = { this.getCompanyInfo}
                        onlyOneClient   = { this.state.disableEditForm }
                      />
                    </div>
                }
              </Form.Group>
            </React.Fragment>
  }


  // this method receive the confirmation that there is (are) company (ies)
  sureCompany = company => {
    this.setState({
      sureCompany       : true,
      rateAsPerCompany  : true,
      company
    });
  }


  changeRateCheck = () => {
    this.setState({
      defaultRate       : !this.state.rateAsPerCompany ? this.state.companyRate : this.state.defaultRate,
      rateAsPerCompany  : !this.state.rateAsPerCompany,
      disableRate       : !this.state.disableRate
    }, () => this.textInput13.focus());
  }


  getCompanyInfo = company => {
    this.setState({
      company,
      message     : "",
      companyRate : company.default_rate,
      defaultRate : this.state.rateAsPerCompany ? company.default_rate : this.state.defaultRate,
      companyId   : company._id,
      messageControlDefaultRate : ""
    });
  }


  changeBtStyleClass = nameClass => {
    // console.log("changiong classname: ", nameClass || "tstsss");
    this.setState({
      btStyleClass: nameClass || "gcbcred"
    });
  };


  render() {
    return (
      <div className="formPosition">
        <br />
        <Card className="card-settings">
          <Card.Header>Your Client's list</Card.Header>
        <Card.Body>

          {/* <div className="gridClientBtContainer"> */}
          <div className= { this.state.btStyleClass }>
            <GetClients 
              client          = { this.state.client }
              getClientInfo   = { this.getClientInfo }     /* mount the Dropbox Button with all clients for the user */
              updateButton    = { this.state.updateButton}
              bringAllClients = { true }
              changeClass     = { this.changeBtStyleClass }

            />
          </div>
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
                  <Button 
                    style     = { {width: "50%"}}
                    onClick   = { () => this.setState({inactive: !this.state.inactive})}
                    variant   = { this.state.inactive ? "danger" : "primary"}
                    disabled  = { this.state.disableEditForm}
                    // ref     = { input => this.textInputX = input }
                    >
                    Client is <strong>{this.state.inactive ? "Inactive" : "Active"}</strong>
                  </Button>
                  <br /> <br />

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
                    <React.Fragment>
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
                    </React.Fragment>
                  :
                    <React.Fragment>
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
                          checked   = {this.state.pcOutsideCanada}
                          type      = "checkbox"
                          style     = {{marginLeft: "1rem"}}
                          onChange  = {this.handleCheckPostalCode}
                          disabled  = {this.state.disableEditForm}
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
                              disabled    = {this.state.disableEditForm}
                              />
                          : 
                            <Form.Control
                              type        = "text"
                              placeholder = {"Enter client's postal code"}
                              name        = "postalCode"
                              onChange    = {this.handleChange}
                              value       = {this.state.postalCode}
                              onKeyPress  = {this.handleChange}
                              disabled    = {this.state.disableEditForm}
                            />
                        }
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
                    </React.Fragment>
                }





                { this.state.linkClientToCompany && this.YNComponent() }

                <Form.Group controlId="formDefaultRate">
                  <Form.Label className="cardLabel">Rate</Form.Label>
                  { this.state.linkClientToCompany && this.state.sureCompany &&
                      <Form.Check 
                        inline 
                        label     = "Rate as per company ?"
                        checked   = {this.state.rateAsPerCompany}
                        type      = "checkbox"
                        style     = {{marginLeft: "1rem"}}
                        onChange  = { this.changeRateCheck }
                        disabled  = { this.state.disableEditForm}
                      />
                  }
                  <Form.Control
                    type        = "number"
                    placeholder = {"Type the hourly rate - CAD$"}
                    name        = "defaultRate"
                    onChange    = {this.handleChange}
                    value       = {this.state.defaultRate}
                    onKeyPress  = {this.handleChange}
                    disabled    = {this.state.disableEditForm || this.state.disableRate}
                    ref         = {input => this.textInput13 = input }  
                  />
                  <Form.Text className="messageControl-user">
                    {this.state.messageControlDefaultRate}
                  </Form.Text>
                </Form.Group>

                <br />

                { this.state.typeKid && !this.state.linkClientToCompany && this.YNComponent()}

                { this.state.client && !this.state.client.isCompany 
                  &&
                    <React.Fragment>
                      <Form.Group controlId="formShowRate">
                        <Form.Label className="cardLabel">Show Rate on PunchIn form?</Form.Label>
                        <Form.Check 
                          inline 
                          label     = "Yes"
                          checked   = { this.state.showRate}
                          type      = "radio"
                          // style     = { window.innerWidth <= 700 ? {marginLeft: "1rem"} : {marginLeft: "2rem"}}
                          style     = {{marginLeft: "2rem"}}
                          disabled    = {this.state.disableEditForm}
                          onChange  = { () => this.setState({ showRate: true})}
                        />
                        <Form.Check 
                          inline 
                          label     = "No"
                          checked   = { !this.state.showRate}
                          type      = "radio"
                          style     = {{marginLeft: "1rem"}}
                          disabled    = {this.state.disableEditForm}
                          onChange  = { () => this.setState({ showRate: false})}
                        />
                      </Form.Group>

                      <Form.Group controlId="formShowNotes">
                        <Form.Label className="cardLabel">Show Notes on PunchIn form?</Form.Label>
                        <Form.Check 
                          inline 
                          label     = "Yes"
                          checked   = { this.state.showNotes}
                          type      = "radio"
                          // style     = { window.innerWidth <= 700 ? {marginLeft: "1rem"} : {marginLeft: "2rem"}}
                          style     = {{marginLeft: "2rem"}}
                          disabled    = {this.state.disableEditForm}
                          onChange  = { () => this.setState({ showNotes: true})}
                        />
                        <Form.Check
                          inline 
                          label     = "No"
                          checked   = { !this.state.showNotes}
                          type      = "radio"
                          style     = {{marginLeft: "1rem"}}
                          disabled  = {this.state.disableEditForm}
                          onChange  = { () => this.setState({ showNotes: false})}
                        />
                      </Form.Group>
                    </React.Fragment>
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
