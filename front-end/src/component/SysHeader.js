import React, { Component } from 'react'
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class SysHeader extends Component {

  // function to set no user thus closing the user's session
  logout = () => {
    if (window.confirm("Are you sure you wanna leave?"))
      this.props.noUser()
  }

  // when a user is logged
  loggedHeader = () => {
    return (
      <Navbar bg="primary" >
        <Navbar.Brand href="/">ClockinJS</Navbar.Brand>
        <Nav>
          <Link to="/" className="nav-link">{this.props.storeEmail} is logged</Link>
          <Link to="/user/logged" className="nav-link">Clients</Link>
          <Link to="/user/logged" className="nav-link">Clockins</Link>
          <Link to="/user/logged" className="nav-link">Invoices</Link>
          <Button onClick={this.logout} className="logoutBtn">Logout</Button>
        </Nav>
      </Navbar>
    );
  }


  notLoggedHeader = () => {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">ClockinJS</Navbar.Brand>
        <Nav>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </Nav>
      </Navbar>
    );
  }

  render() {
    return(this.props.storeEmail ?
            this.loggedHeader() :
            this.notLoggedHeader()
          );
  }
}

const mapStateToProps = store => {
  return {
    storeEmail: store.email
  }
};

const mapDispatchToProps = dispatch => {
  return {
    noUser: () => dispatch({type:"LOGOUT"})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SysHeader);