import React, { Component } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from "axios";

import MaskedInput from 'react-text-mask';


class KidClientNew extends Component {

  state = {
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
      message         : "",
      className       : "",
      disableBtn      : false,

      messageControlName        : "",
      messageControlNickname    : "",
      messageControlDefaultRate : "",
    }

  handleChange = e => {
    if (e.key === "Enter")
      switch(e.target.name) {
        case "name":
          if (this.state.name !== "")
            this.textInput2.focus();
            // this.setState({ messageControlName: ""});
          break;
        case "nickname":
          if (this.state.nickname !== "")
            this.textInput3.focus();
          break;
        case "birthday":
          if (this.state.birthday !== "")
            this.textInput4.focus();
          break;
        // case "mother":
        //   if (this.state.mother !== "")
        //     this.textInput5.focus(); /////// need to fix ref - react-text-mask
        //     this.setState({ btnType: "submit" });
        //   break;
        case "mPhone":
          if (this.state.mPhone !== "")
            this.textInput6.focus();
          break;
        case "mEmail":
          if (this.state.mEmail !== "")
            this.textInput7.focus();
          break;
        // case "father":
        //   if (this.state.father !== "")
        //     this.textInput8.focus(); /////// need to fix ref - react-text-mask
        //   break;
        case "fPhone":
          if (this.state.fPhone !== "")
            this.textInput9.focus();
          break;
        case "fEmail":
          if (this.state.fEmail !== "")
            this.textInput10.focus();
          break;
        // case "consultant":
        //   if (this.state.consultant !== "")
        //     this.textInput11.focus(); /////// need to fix ref - react-text-mask
        //     this.setState({ btnType: "submit" });
        //   break;
        case "cPhone":
          if (this.state.cPhone !== "")
            this.textInput12.focus();
          break;
        case "cEmail":
          if (this.state.cEmail !== "")
            this.textInput13.focus();
          break;
        case "defaultRate":
          if (this.state.defaultRate !== "") {
            this.buttonSave.click();
          }
          break;
        default:
      }
      
      this.setState({
        [e.target.name]: e.target.value,
      });

      e.target.name === "name"        && this.state.messageControlName && this.setState({ messageControlName: ""});
      e.target.name === "nickname"    && this.state.messageControlNickname && this.setState({ messageControlNickname: ""});
      e.target.name === "defaultRate" && this.state.messageControlDefaultRate && this.setState({ messageControlDefaultRate: ""});
  }


  handleSubmit = async e => {
    e.preventDefault();
    window.scrollTo(0, 2000);

    if (!this.state.name || !this.state.nickname || !this.state.defaultRate) {
      
      if (!this.state.defaultRate) {
        this.setState({ messageControlDefaultRate: "Please inform the default rate($)."})
        this.textInput13.focus();
      }

      if (!this.state.nickname) {
        window.scrollTo(0, 0);
        this.setState({ messageControlNickname: "Please inform Client's nickname."})
        this.textInput2.focus();
      }

      if (!this.state.name) {
        window.scrollTo(0, 0);
        this.setState({ messageControlName: "Please inform Client's name."})
        this.textInput1.focus();
      }

    } else {
      this.setState({ disableBtn: true });

      // const url = "https://clockinjs.herokuapp.com/client";
      const url = "/api/client";


      const createClient  = {
        name        : this.state.name,
        nickname    : this.state.nickname,
        birthday    : this.state.birthday || undefined,
        mother      : this.state.mother || undefined,
        mPhone      : this.state.mPhone || undefined,
        mEmail      : this.state.mEmail || undefined,
        father      : this.state.father || undefined,
        fPhone      : this.state.fPhone || undefined,
        fEmail      : this.state.fEmail || undefined,
        consultant  : this.state.consultant || undefined,
        cPhone      : this.state.cPhone || undefined,
        cEmail      : this.state.cEmail || undefined,
        defaultRate : this.state.defaultRate,
        typeKid     : true,
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
            message     : <p>Client <b>{this.state.nickname}</b> has been created.</p>,
            className   : "messageSuccess"
          });
          this.clearMessage();

        } else {
          // (addClient.data.error) 
          throw new Error(addClient.data.error);
        }
          
      } catch(error) {
        this.setState({
          message     : error.message || error,
          className   : "messageFailure",
          disableBtn  : false
        });

        // this.clearMessage();
      }
    }
  }


  //it clears the error message after 3.5s
  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        name        : "",
        nickname    : "",
        birthday    : "",
        mother      : "",
        mPhone      : "",
        mEmail      : "",
        father      : "",
        fPhone      : "",
        fEmail      : "",
        consultant  : "",
        cPhone      : "",
        cEmail      : "",
        defaultRate : "",
        disableRate : false,
        message     : "",
        disableBtn  : false,
        // linkClientToCompany : false,
        // company     : "",
        // companyRate : "",
        // rateAsPerCompany : false,
        // companyFree : true
      });

      window.scrollTo(0, 0);
      this.textInput1.focus();
    }, 3500);
  }


  afterChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }


  render() {
    return (
      <div className="formPosition">
        <br />
        <Card className="card-settings">
          <Card.Header>
            <h2>New Kid Client</h2>
          </Card.Header>
          <Form
            autoComplete  = {"off"}
            onSubmit      = {this.handleSubmit}
            className     = "formPosition"
            style         = {{width: "30rem"}}
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
                ref         = {input => this.textInput1 = input } />
              <Form.Text className="messageControl-user">
                {this.state.messageControlName}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formNickname">
              <Form.Label className="cardLabel">Nickname</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Client's nickname"
                name        = "nickname"
                onChange    = {this.handleChange}
                value       = {this.state.nickname}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput2 = input } />
              <Form.Text className="messageControl-user">
                {this.state.messageControlNickname}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBirthday">
              <Form.Label className="cardLabel">Birthday</Form.Label>
              <Form.Control
                type        = "date"
                placeholder = "Client's birthday"
                name        = "birthday"
                onChange    = {this.handleChange}
                value       = {this.state.birthday}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput3 = input } />
            </Form.Group>

            <Form.Group controlId="formMother">
              <Form.Label className="cardLabel">Mother</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Client's mother name"
                name        = "mother"
                onChange    = {this.handleChange}
                value       = {this.state.mother}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput4 = input } />
            </Form.Group>

            <Form.Group controlId="formMPhone">
              <Form.Label className="cardLabel">Mother's Phone</Form.Label>
              <MaskedInput
                mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className   = "form-control"
                placeholder = "Mother's phone number"
                name        = "mPhone"
                id          = "mPhone"
                onBlur      = { e => this.afterChange(e)}
                value       = { this.state.mPhone}
                onKeyPress  = { this.handleChange}
                ref         = { input => this.textInput5 = input } />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label className="cardLabel">Mother's Email address</Form.Label>
              <Form.Control
                type        = "email"
                // pattern     = "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/" 
                pattern     = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                placeholder = "Mother's email"
                name        = "mEmail"
                onChange    = {this.handleChange}
                value       = {this.state.mEmail}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput6 = input } 
                />
            </Form.Group>

            <Form.Group controlId="formFather">
              <Form.Label className="cardLabel">Father</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Client's father name"
                name        = "father"
                onChange    = {this.handleChange}
                value       = {this.state.father}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput7 = input }  />
            </Form.Group>

            <Form.Group controlId="formFPhone">
              <Form.Label className="cardLabel">Father's Phone</Form.Label>
              <MaskedInput
                mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className   = "form-control"
                placeholder = "Father's phone number"
                name        = "fPhone"
                id          = "fPhone"
                onBlur      = {e => this.afterChange(e)}
                value       = {this.state.fPhone}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput8 = input } />
            </Form.Group>

            <Form.Group controlId="formFEmail">
              <Form.Label className="cardLabel">Father's Email address</Form.Label>
              <Form.Control
                type        = "email"
                // pattern     = "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/" 
                pattern     = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                placeholder = "Father's email"
                name        = "fEmail"
                onChange    = {this.handleChange}
                value       = {this.state.fEmail}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput9 = input } />
            </Form.Group>

            <Form.Group controlId="formConsultant">
              <Form.Label className="cardLabel">Consultant</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Consultant's name"
                name        = "consultant"
                onChange    = {this.handleChange}
                value       = {this.state.consultant}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput10 = input }  />
            </Form.Group>

            <Form.Group controlId="formCPhone">
              <Form.Label className="cardLabel">Consultant's Phone</Form.Label>
              <MaskedInput
                mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                className   = "form-control"
                placeholder = "Consultant's phone number"
                name        = "cPhone"
                id          = "cPhone"
                onBlur      = {e => this.afterChange(e)}
                value       = {this.state.cPhone}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput11 = input } />
            </Form.Group>

            <Form.Group controlId="formCEmail">
              <Form.Label className="cardLabel">Consultant's Email address</Form.Label>
              <Form.Control
                type        = "email"
                // pattern     = "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
                pattern     = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                placeholder = "Consultant's email"
                name        = "cEmail"
                onChange    = {this.handleChange}
                value       = {this.state.cEmail}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput12 = input }  />
            </Form.Group>

            <Form.Group controlId="formDefaultRate">
              <Form.Label className="cardLabel">Rate</Form.Label>
              <Form.Control
                type        = "number"
                placeholder = "Hourly rate - CAD$"
                name        = "defaultRate"
                onChange    = {this.handleChange}
                value       = { this.state.defaultRate}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput13 = input }
              />
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


export default connect(mapStateToProps, null)(KidClientNew)
