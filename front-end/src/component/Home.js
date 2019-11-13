import React, { Component } from 'react';
import { Card, Form, Col, Row, Button} from 'react-bootstrap';
import { connect } from 'react-redux'


class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      disableEdit : true,
      name        : this.props.storeName,
      email       : this.props.storeEmail,
      city        : this.props.storeCity,
      address     : this.props.storeAddress,
      phone       : this.props.storePhone,
      postalCode  : this.props.storePostalCode,
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
  handleSubmit = () => {
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

      this.cleanMessage();
    }

    // handle submit itself
  }


  updateState = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  editForm = () => {
    // const {
    //   name, email, city, address, phone, postalCode } = this.state;

    // console.log("name, email and city: ", name, email, city);
    
    this.setState({
      disableEdit: false,

      tmp_name        : this.state.name,
      tmp_email       : this.state.email,
      tmp_city        : this.state.city,
      tmp_address     : this.state.address,
      tmp_phone       : this.state.phone,
      tmp_postalCode  : this.state.postalCode
      // tmp_name        : name,
      // tmp_email       : email,
      // tmp_city        : city,
      // tmp_address     : address,
      // tmp_phone       : phone,
      // tmp_postalCode  : postalCode
    });
    console.log("editBtn = this.state: ", this.state);

  }


  btnCancel = () => {
    // this.setState({
    //   name            : "",
    //   email           : "",
    //   city            : "",
    //   address         : "",
    //   phone           : "",
    //   postalCode      : ""
    // });

    this.setState({
      disableEdit: true,

      name            : this.state.tmp_name,
      email           : this.state.tmp_email,
      city            : this.state.tmp_city,
      address         : this.state.tmp_address,
      phone           : this.state.tmp_phone,
      postalCode      : this.state.tmp_postalCode
    });
  }


  cleanMessage = () => {
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

          <Form>
            <Form.Group as={Row} controlId="formId">
              <Form.Label column sm={2} className="card-label">Id:</Form.Label>
              <Col sm={10} >
                <Form.Label column sm={10} >{this.props.storeId}</Form.Label>
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formName">
              <Form.Label column sm={2} className="card-label">Name:</Form.Label>
              <Col sm={8}>
                {/* <Form.Label column sm={10} >{this.props.storeName}</Form.Label> */}
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "name"
                  onBlur        = {this.updateState}
                  defaultValue  = {this.state.name}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput1 = input }
                />
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formEmail">
              <Form.Label column sm={2} className="card-label">Email:</Form.Label>
              <Col sm={8}>
                {/* <Form.Label column sm={10} >{this.props.storeEmail}</Form.Label> */}
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "email"
                  onBlur        = {this.updateState}
                  defaultValue  = {this.state.email}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput2 = input }
                />
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formAddress">
              <Form.Label column sm={2} className="card-label">Address:</Form.Label>
              <Col sm={8}>
                {/* <Form.Label column sm={10} >{this.props.storeAddress}</Form.Label> */}
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "address"
                  onBlur        = {this.updateState}
                  defaultValue  = {this.state.address}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput3 = input }
                />
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formCity">
              <Form.Label column sm={2} className="card-label">City:</Form.Label>
              <Col sm={8}>
                {/* <Form.Label column sm={10} >{this.props.storeCity}</Form.Label> */}
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "city"
                  onBlur        = {this.updateState}
                  defaultValue  = {this.state.city}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput4 = input }
                />
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formPostalCode">
              <Form.Label column sm={2} className="card-label">Postal Code:</Form.Label>
              <Col sm={4}>
                {/* <Form.Label column sm={10} >{this.props.storePostalCode}</Form.Label> */}
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "postalCode"
                  onBlur        = {this.updateState}
                  defaultValue  = {this.state.postalCode}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput5 = input }
                />
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formPhone">
              <Form.Label column sm={2} className="card-label">Phone:</Form.Label>
              <Col sm={4}>
                {/* <Form.Label column sm={10} >{this.props.storePhone}</Form.Label> */}
                <Form.Control
                  disabled      = {this.state.disableEdit}
                  type          = "text"
                  name          = "phone"
                  onBlur        = {this.updateState}
                  defaultValue  = {this.state.phone}
                  onKeyPress    = {this.handleChange}
                  ref           = {input => this.textInput6 = input }
                />
              </Col>
            </Form.Group>
          </Form>

          
          <Card.Header className="cardTitle message">          
            {/* <h5 className="message"> */}
            { this.state.message
              ? this.state.message
              : <span className="noMessage">.</span> }
            {/* </h5> */}
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
              <Button className="gridBtnEdit"
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
    storeId     : store.id,
    storeEmail  : store.email,
    storeName   : store.name,

    storeCity       : store.city,
    storeAddress    : store.address,
    storePostalCode : store.postalCode,
    storePhone      : store.phone
  }
}

export default connect(mapStateToProps, null)(Home)
