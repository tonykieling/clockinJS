import React, { Component } from 'react';
import { Card, Form, Col, Row, Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux'
import axios from "axios";
import MaskedInput from "react-text-mask";

const btnStyle = {
  width : "50%",
  paddingLeft: "0px",
  paddingRight: "0px"
};

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      disableEdit : true,
      userId      : this.props.storeId,
      name        : this.props.storeName,
      email       : this.props.storeEmail,
      city        : (this.props.storeCity === "undefined") ? "-" : this.props.storeCity,
      address     : (this.props.storeAddress === "undefined") ? "-" : this.props.storeAddress,
      phone       : (this.props.storePhone === "undefined") ? "-" : this.props.storePhone,
      postalCode  : (this.props.storePostalCode === "undefined") ? "-" : this.props.storePostalCode,
      message     : "",
      tmp_name        : "",
      tmp_email       : "",
      tmp_city        : "",
      tmp_address     : "",
      tmp_phone       : "",
      tmp_postalCode  : ""
    }
  }



  // need to implement it
  handleSubmit = async () => {
    if (this.state.name && this.state.email) {
      // asd
    } else {
      if (!this.state.name && this.state.email) {
        this.setState({
          message: "Please, name should be filled."
        });

        this.textInput1.focus();
      } else if (!this.state.email && this.state.name) {
        this.setState({
          message: "Please, email should be filled."
        });

        this.textInput2.focus();
      } else if (!this.state.name && !this.state.email) {
        this.setState({
          message: "Please, at least name and email should be filled."
        });

        this.textInput1.focus();
      }

      this.clearMessage();
    }

    // const url         = `http://localhost:3333/user/${this.state.userId}`;    // this is dev setting
    const url         = `user/${this.state.userId}`;    // this is dev setting
    const changeUser  = {
      name        : this.state.name,
      email       : this.state.email,
      address     : this.state.address,
      city        : this.state.city,
      postalCode  : this.state.postalCode,
      phone       : this.state.phone
    }

    try {
      const modUser = await axios.patch( 
        url,
        changeUser,
        {  
          headers: { 
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${this.props.storeToken}` }
      });

      if (modUser.data.message) {
        const user = {
          id          : this.props.storeId,
          name        : modUser.data.data.name,
          email       : modUser.data.data.email,
          city        : modUser.data.data.city,
          address     : modUser.data.data.address,
          postalCode  : modUser.data.data.postalCode,
          phone       : modUser.data.data.phone,
          token       : modUser.data.data.token
        };

        this.setState({
          message           : "Info has been updated.",
          classNameMessage  : "messageSuccess",
          disableEdit       : true
        });

        this.props.dispatchLogin({ user });

      } else if (modUser.data.error) {
        this.setState({
          disableEdit       : true,
          message           : modUser.data.error,
          classNameMessage  : "messageFailure"
        });
      }

    } catch(error) {
      console.log("catch error: ", error.message);
      this.setState({
        disableEdit       : true,
        message           : error.message,
        classNameMessage  : "messageFailure"
      });
    }

    this.clearMessage();
  }



  editForm = () => {
    this.setState({
      disableEdit: false,
    });
  }



  btnCancel = () => {
    this.setState({
      disableEdit: true,

      name            : this.props.storeName,
      email           : this.props.storeEmail,
      city            : this.props.storeCity,
      address         : this.props.storeAddress,
      phone           : this.props.storePhone,
      postalCode      : this.props.storePostalCode
    });
  }



  clearMessage = () => {
    setTimeout(() => {
      this.setState({
        message: ""
      });
    }, 3000);
  }



  handleChangePassword = async () => {
    const confirmCP = window.confirm("Are you sure you want to change your password?");
    if (confirmCP) {
      const secondConfirm = window.confirm("You are receive an email with the instructions to modify your password.");
        if (secondConfirm) {
          //call the method to send an email with change password instructions

          const url = `/user/forgetPassword`;

          try {
            const changePassword = await axios.post( 
              url,
              {
                data: {
                  email: this.state.email
                }
            });
            
            if (changePassword.data.message){
              this.setState({
                message           : `Your email <${this.state.email}> is going to receive an email with instructions to change your password.`,
                classNameMessage  : "messageSuccess"
              });
            } else {
              this.setState({
                message           : changePassword.data.error,
                classNameMessage  : "messageFailure",
              });
    
              this.clearMessage();
            }
    
          } catch(err) {
            this.setState({
              message: err.message 
            });
          }

          setTimeout(() => {
            this.clearMessage();
          }, 2000);
        }
    }
  }


  // afterChange = event => {
  //   this.handleChange(event);
  // }

  handleChange = e => {
    if (e.target.name !== "postalCode") {
      this.setState({
        [e.target.name]: e.target.value
      });
    } else if (e.target.value.length < 7)  {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }

  
  // not doing this now
  // handleChangeEmail = () => {
  // }



  render() {
    return (
      <div className="formPosition">
        <br />
        <h3 className="htitle">User's Home Page</h3>
        {/* <h4>Welcome {this.props.storeName.split(" ")[0]} </h4>  */}
        <br />

        <Card className="card-settings">
          <Card.Header className="cardTitle">User Information</Card.Header>

          <Form className="formPosition">
            <Form.Group as={Row} controlId="formId">
              <Form.Label column sm={2} className="cardLabel">Id</Form.Label>
              <Col >
                <Form.Label column sm={8} >{this.state.userId}</Form.Label>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formName">
              <Form.Label column sm={2} className="cardLabel">Name</Form.Label>
              <Col sm={8}>
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "name"
                  onChange      = {this.handleChange}
                  placeholder   = {this.state.name}
                  value         = {this.state.name}
                  // onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput1 = input }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formEmail">
              <Form.Label column sm={2} className="cardLabel">Email</Form.Label>
              <Col sm={8}>
                <Form.Control
                  // disabled      = {this.state.disableEdit}
                  disabled      = { true }
                  type          = "text"
                  name          = "email"
                  onChange      = {this.handleChange}
                  placeholder   = {this.state.email}
                  value         = {this.state.email}
                  // onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput2 = input }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formAddress">
              <Form.Label column sm={2} className="cardLabel">Address</Form.Label>
              <Col sm={8}>
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  placeholder   = {this.state.address}
                  type          = "text"
                  name          = "address"
                  onChange      = {this.handleChange}
                  value         = {this.state.address}
                  // onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput3 = input }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formCity">
              <Form.Label column sm={2} className="cardLabel">City:</Form.Label>
              <Col sm={8}>
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "city"
                  onChange      = {this.handleChange}
                  placeholder   = {this.state.city}
                  value         = {this.state.city}
                  // onKeyDown    = {this.handleK}
                  ref           = {input => this.textInput4 = input }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPostalCode">
              <Form.Label column sm={2} className="cardLabel">Postal Code</Form.Label>
              <Col sm={4}>
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "postalCode"
                  onChange      = {this.handleChange}
                  value         = {this.state.postalCode}
                  placeholder   = {this.state.postalCode}
                  // onKeyDown    = {this.handleK}
                  ref           = {input => this.textInput5 = input }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPhone">
              <Form.Label column sm={2} className="cardLabel">Phone</Form.Label>
              <Col sm={4}>
                {/* <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "phone"
                  onChange      = {this.handleChange}
                  value         = {this.state.phone}
                  placeholder   = {this.state.phone}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput6 = input }
                /> */}
                <MaskedInput
                  mask        = {['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                  className   = "form-control"
                  placeholder = "Enter your phone number"
                  name        = "phone"
                  // guide={false}
                  // id          = "fPhone"
                  onBlur      = { e => this.handleChange(e)}
                  value       = { this.state.phone}
                  onKeyPress  = { this.handleChange}
                  disabled    = { this.state.disableEdit}
                  ref         = { input => this.textInput6 = input }
                  // alwaysShowMask = {true}
                />
              </Col>
            </Form.Group>
          </Form>

          
          {/* <Card.Header className="cardTitle message">           */}
          <Card.Header className= { this.state.classNameMessage}>          
            { this.state.message
              ? this.state.message
              : <br /> }
          </Card.Header>

          <div className="d-flex flex-column">
            { !this.state.disableEdit
              ?
                <ButtonGroup className="mt-3">
                  <Button
                    variant   = "success"
                    style   = { btnStyle }
                    onClick   = { this.handleSubmit }
                  >Save </Button>
                  <Button 
                    variant = "danger"
                    style   = { btnStyle }
                    onClick = { this.btnCancel }
                  > Cancel </Button>
                </ButtonGroup>
              :
                <ButtonGroup className="mt-3">
                  <Button 
                    variant = "info"
                    style   = { btnStyle }
                    onClick = { this.handleChangePassword } >
                    Change Password
                  </Button>
                  <Button 
                    variant = "primary"
                    style   = { btnStyle }
                    onClick = { this.editForm } >
                    Edit data
                  </Button>
                </ButtonGroup>
            }
          </div>
        </Card>        
        <br></br>
        <br></br>
      </div>
    )
  }
}

const mapStateToProps = store => {
  return {
    storeToken  : store.token,
    storeId     : store.id,
    storeEmail  : store.email,
    storeName   : store.name,

    storeCity       : store.city,
    storeAddress    : store.address,
    storePostalCode : store.postalCode,
    storePhone      : store.phone
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchLogin: user => dispatch({
      type:"LOGIN",
      data: user })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)
