import React, { Component } from 'react';
import { Button, Form, Card, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from "axios";

class ClientNew extends Component {

  state = {
      name            : "",
      nickName        : "",
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
      redirectFlag    : false,
      errorMsg        : "",
      btnType         : undefined
    }

  handleChange = e => {
    // if (e.key === "Enter")
    //   switch(e.target.name) {
    //     case "name":
    //       if (this.state.name !== "")
    //         this.textInput2.focus();
    //       break;
    //     case "email":
    //       if (this.state.email !== "")
    //         this.textInput4.focus();
    //       break;
    //     case "password":
    //       if (this.state.password !== "")
    //         this.textInput5.focus();
    //       break;
    //     case "confirmPassword":
    //       if (this.state.confirmPassword !== "")
    //         this.setState({ btnType: "submit" });
    //       break;
    //     default:                     
    //   }

      this.setState({
        [e.target.name]: e.target.value,

        btnType: "Submit"
      });
  }

  handleSubmit = async e => {
    e.preventDefault();

    // if (this.state.name.length > 60) {
    //   alert("Name's maximun length is 60 characters.");
    //   this.textInput1.focus();
    // } else if (this.state.email.length > 60) {
    //   alert("Email's maximun length is 60 characters.");
    //   this.textInput2.focus();
    // } else if (this.state.email !== "" && this.state.name !== "" && this.state.password !== "" && this.state.confirmPassword !== "") {
    //   if (this.state.password !== this.state.confirmPassword) {
    //     alert("Password and \nConfirm Password fields\n\nMUST be the same.");
    //     this.setState({
    //       password        : "",
    //       confirmPassword : ""
    //     })
    //     this.textInput4.focus();
      // } else {
        // const url = "/user/signup";
        const url         = "http://localhost:3333/client";    // this is dev setting
        const createClient  = {
          name        : this.state.name,
          nickName    : this.state.nickName,
          mother      : this.state.mother,
          mPhone      : this.state.mPhone,
          mEmail      : this.state.mEmail,
          father      : this.state.father,
          fPhone      : this.state.fPhone,
          fEmail      : this.state.fEmail,
          consultant  : this.state.consultant,
          cPhone      : this.state.cPhone,
          cEmail      : this.state.cEmail,
          defaultRate : this.state.defaultRate
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
            const {
              name,
              nickName,
              mother
            } = addClient.data.client; 

            const id = addClient.data.client._id;
            const client = { id, name, nickName, mother };
console.log("NEWclient", addClient);
            this.props.dispatchLogin({ client });
            this.setState({
              redirectFlag: true
            });
          } else if (addClient.data.error) {
            this.setState({
              errorMsg: addClient.data.error });
            this.clearMessage();
          }

        } catch(err) {
          this.setState({
            errorMsg: err.message });
          this.clearMessage();
        }
      // }
    }
  // }


  //it clears the error message after 3.5s
  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        errorMsg        : "",
        password        : "",
        confirmPassword : ""
      })
      this.textInput1.focus();
    }, 3500);

  }

  render() {

    if (this.state.redirectFlag)
      return(<Redirect to="/" />);

    return (
      <div>
        <h2>Add New Client Page</h2>
        <Card>
          <Form onSubmit={this.handleSubmit}>

            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                autoFocus   = {true}
                type        = "text"
                placeholder = "Type the client's name"
                name        = "name"
                onChange    = {this.handleChange}
                value       = {this.state.name}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput1 = input }
              />
            </Form.Group>

            <Form.Group controlId="formNickName">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Type the client's nickname"
                name        = "nickName"
                onChange    = {this.handleChange}
                value       = {this.state.nickName}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput2 = input }
              />
            </Form.Group>

            <Form.Group controlId="formBirthday">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Type the client's birthday"
                name        = "birthday"
                onChange    = {this.handleChange}
                value       = {this.state.birthday}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput3 = input }
              />
            </Form.Group>

            <Form.Group controlId="formMother">
              <Form.Label>Mother</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Type the client's mother name"
                name        = "mother"
                onChange    = {this.handleChange}
                value       = {this.state.mother}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput4 = input }
              />
            </Form.Group>

            <Form.Group controlId="formMPhone">
              <Form.Label>Mother's Phone</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Type the mother's phone number"
                name        = "mPhone"
                onChange    = {this.handleChange}
                value       = {this.state.mPhone}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput5 = input }
              />
            </Form.Group>

            <Form.Group controlId="formMEmail">
              <Form.Label>Mother's Email address</Form.Label>
              <Form.Control
                type        = "email"
                placeholder = "Type the mother's email"
                name        = "mEmail"
                onChange    = {this.handleChange}
                value       = {this.state.mEmail}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput6 = input }
              />
            </Form.Group>

            <Form.Group controlId="formFather">
              <Form.Label>Father</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Type the client's father name"
                name        = "father"
                onChange    = {this.handleChange}
                value       = {this.state.father}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput7 = input }
              />
            </Form.Group>

            <Form.Group controlId="formFPhone">
              <Form.Label>Father's Phone</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Type the father's phone number"
                name        = "fPhone"
                onChange    = {this.handleChange}
                value       = {this.state.fPhone}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput8 = input }
              />
            </Form.Group>

            <Form.Group controlId="formFEmail">
              <Form.Label>Father's Email address</Form.Label>
              <Form.Control
                type        = "email"
                placeholder = "Type the father's email"
                name        = "fEmail"
                onChange    = {this.handleChange}
                value       = {this.state.fEmail}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput9 = input }
              />
            </Form.Group>

            <Form.Group controlId="formConsultant">
              <Form.Label>Consultant</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Type the consultant's name"
                name        = "consultant"
                onChange    = {this.handleChange}
                value       = {this.state.consultant}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput10 = input }
              />
            </Form.Group>

            <Form.Group controlId="formCPhone">
              <Form.Label>Consultant's Phone</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Type the consultant's phone number"
                name        = "cPhone"
                onChange    = {this.handleChange}
                value       = {this.state.cPhone}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput11 = input }
              />
            </Form.Group>

            <Form.Group controlId="formCEmail">
              <Form.Label>Consultant's Email address</Form.Label>
              <Form.Control
                type        = "email"
                placeholder = "Type the consultant's email"
                name        = "cEmail"
                onChange    = {this.handleChange}
                value       = {this.state.cEmail}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput12 = input }
              />
            </Form.Group>

            <Form.Group controlId="formDefaultRate">
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type        = "text"
                placeholder = "Type the hourly rate"
                name        = "defaultRate"
                onChange    = {this.handleChange}
                value       = {this.state.defaultRate}
                onKeyPress  = {this.handleChange}
                ref         = {input => this.textInput13 = input }
              />
            </Form.Group>


            <Button variant="primary" type={this.state.btnType}>
              Save
            </Button>
            <Container className="msgcolor">
              {this.state.errorMsg}
            </Container>
          </Form>
          </Card>
      </div>
    )
  }
}


const mapStateToProps = store => {
  return {
    storeToken: store.token
  };
};


const mapDispatchToProps = dispatch => {
  return {
    dispatchLogin: user => dispatch({
      type:"LOGIN",
      data: user })
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(ClientNew)
