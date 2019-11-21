import React, { Component } from 'react';
import { Card, Form, Col, Row, Button} from 'react-bootstrap';
import { connect } from 'react-redux'
import axios from "axios";


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
      } else  {
        this.setState({
          message: "Please, at least name and email should be filled."
        });

        this.textInput1.focus();
      }

      this.clearMessage();
    }

    // handle submit itself

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
          message     : modUser.data.message,
          disableEdit : true
        });

        this.props.dispatchLogin({ user });

      } else if (modUser.data.error) {
        this.setState({
          disableEdit : true,
          message     : modUser.data.error
        });
      }

      this.clearMessage();
    } catch(error) {
      console.log("catch error: ", error.message);
    }


  }


  updateState = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
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

  render() {
    return (
      <div>
        <h1 className="htitle">User's Home Page</h1>
        <h3>Welcome {this.props.storeEmail} </h3> 
        <br></br>

        <Card>
          <Card.Header className="cardTitle">User Information</Card.Header>

          <Form className="formPosition">
            <Form.Group as={Row} controlId="formId">
              <Form.Label column sm={2} className="card-label">Id</Form.Label>
              <Col >
                <Form.Label column sm={8} >{this.state.userId}</Form.Label>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formName">
              <Form.Label column sm={2} className="card-label">Name</Form.Label>
              <Col sm={8}>
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "name"
                  onChange      = {this.updateState}
                  placeholder   = {this.state.name}
                  value         = {this.state.name}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput1 = input }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formEmail">
              <Form.Label column sm={2} className="card-label">Email</Form.Label>
              <Col sm={8}>
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "email"
                  onChange      = {this.updateState}
                  placeholder   = {this.state.email}
                  value         = {this.state.email}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput2 = input }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formAddress">
              <Form.Label column sm={2} className="card-label">Address</Form.Label>
              <Col sm={8}>
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  placeholder   = {this.state.address}
                  type          = "text"
                  name          = "address"
                  onChange      = {this.updateState}
                  value         = {this.state.address}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput3 = input }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formCity">
              <Form.Label column sm={2} className="card-label">City:</Form.Label>
              <Col sm={8}>
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "city"
                  onChange      = {this.updateState}
                  placeholder   = {this.state.city}
                  value         = {this.state.city}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput4 = input }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPostalCode">
              <Form.Label column sm={2} className="card-label">Postal Code</Form.Label>
              <Col sm={4}>
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "postalCode"
                  onChange      = {this.updateState}
                  value         = {this.state.postalCode}
                  placeholder   = {this.state.postalCode}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput5 = input }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPhone">
              <Form.Label column sm={2} className="card-label">Phone</Form.Label>
              <Col sm={4}>
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "phone"
                  onChange      = {this.updateState}
                  value         = {this.state.phone}
                  placeholder   = {this.state.phone}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput6 = input }
                />
              </Col>
            </Form.Group>
          </Form>

          
          <Card.Header className="cardTitle message">          
            { this.state.message
              ? this.state.message
              : <span className="noMessage">.</span> }
          </Card.Header>

          { !this.state.disableEdit
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
          <br></br>
          <br></br>

        </Card>        
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
