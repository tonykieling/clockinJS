import React, { Component } from 'react';
import { Card, Form, Col, Row, Button} from 'react-bootstrap';
import { connect } from 'react-redux'


class Home extends Component {

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
              <Col sm={10}>
                <Form.Label column sm={10} >{this.props.storeId}</Form.Label>
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formName">
              <Form.Label column sm={2} className="card-label">Name:</Form.Label>
              <Col sm={10}>
                <Form.Label column sm={10} >{this.props.storeName}</Form.Label>
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formEmail">
              <Form.Label column sm={2} className="card-label">Email:</Form.Label>
              <Col sm={10}>
                <Form.Label column sm={10} >{this.props.storeEmail}</Form.Label>
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formAddress">
              <Form.Label column sm={2} className="card-label">Address:</Form.Label>
              <Col sm={10}>
                <Form.Label column sm={10} >{this.props.storeAddress}</Form.Label>
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formCity">
              <Form.Label column sm={2} className="card-label">City:</Form.Label>
              <Col sm={10}>
                <Form.Label column sm={10} >{this.props.storeCity}</Form.Label>
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formPostalCode">
              <Form.Label column sm={2} className="card-label">Postal Code:</Form.Label>
              <Col sm={10}>
                <Form.Label column sm={10} >{this.props.storePostalCode}</Form.Label>
              </Col>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group as={Row} controlId="formPhone">
              <Form.Label column sm={2} className="card-label">Phone:</Form.Label>
              <Col sm={10}>
                <Form.Label column sm={10} >{this.props.storePhone}</Form.Label>
              </Col>
            </Form.Group>
          </Form>


          <Button>
            Edit
          </Button>

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
