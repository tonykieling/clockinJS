import React, { Component } from 'react'
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { slide as Menu } from "react-burger-menu";
import "../burguer.css";

class SysHeader extends Component {


  // function to set no user thus closing the user's session
  logout = () => {
    if (window.confirm("Are you sure you wanna leave?")) {
      this.props.noUser();
      return <Redirect to = "/land" />
    }
  }

// example of prevState
  // toggleCollapse = collapseID => () => {
  //   this.setState(prevState => ({
  //     collapseID: prevState.collapseID !== collapseID ? collapseID : ''
  //   }));
  // };


  // when a user is logged
  loggedHeader = () => {
    return (
      <div>
        <Navbar bg="primary showNormalMenu" >
          {/* <Navbar.Brand href="/">ClockinJS</Navbar.Brand> */}
          <Navbar.Brand>
            <Link to = "/" className="navbar-brand"> ClockinJS </Link>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/user" className="nav-link">{this.props.storeEmail} is logged</Link>
              <NavDropdown title="Clients" id="basic-nav-dropdown1">
                <NavDropdown.Item href="clientNew">Add New One</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/clientList"> List </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Clockins" id="basic-nav-dropdown2">
                <NavDropdown.Item href="punchInNew"> Punch in </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="punchInsList">List them all</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Invoices" id="basic-nav-dropdown3">
                <NavDropdown.Item href="invoiceNew">Generate a brand new one</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="invoicesList">List, Check and Edit</NavDropdown.Item>
              </NavDropdown>            

              <Link to="/about" className="nav-link">About</Link>
            </Nav>
            <Button onClick={this.logout} className="logoutBtn">Logout</Button>
          </Navbar.Collapse>
        </Navbar>

        <div className="showHamburguer">
          <Navbar bg="primary">
            {/* <Navbar.Brand href="/">ClockinJSburguer</Navbar.Brand> */}
            <Link to="/" className="nav-link">ClockinJS</Link>
            <Link to="/user" className="nav-link">{this.props.storeEmail} is logged</Link>
            <Menu right>
              {/* <NavDropdown.Item href="/user" className="nav-link">User's HomePage</NavDropdown.Item> */}
              {/* <Link to="/user" className="nav-link menu-item">User's Home</Link> */}
              {/* <Link to="/user" className="menu-item">User</Link> */}
              {/* <a id="home" className="menu-item" href="/user">User's Home</a>
              <Link to="/user" className="nav-link">{this.props.storeEmail} is logged</Link> */}
              {/* it's broken */}

              <NavDropdown title="Clients" id="basic-nav-dropdown1" className="menu-item">
                <NavDropdown.Item href="clientNew" className="menu-item">Add New One</NavDropdown.Item>
                {/* <Link to = "/clientNew" className="dropdown-item"> Add New Client</Link> */}
                <NavDropdown.Divider />
                <NavDropdown.Item href="clientList"> List </NavDropdown.Item>
              </NavDropdown>
              <br />
              <NavDropdown title="Clockins" id="basic-nav-dropdown2">
                <NavDropdown.Item href="punchInNew"> Punch in </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="punchInsList">List them all</NavDropdown.Item>
              </NavDropdown>
              <br />
              <NavDropdown title="Invoices" id="basic-nav-dropdown3" className="font-color">
                <NavDropdown.Item href="invoiceNew">Generate a brand new one</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="pdfTemplate">List them all</NavDropdown.Item>
              </NavDropdown>            

              {/* <NavDropdown.Item className="font-color menu-item" href="about">About</NavDropdown.Item> */}
              {/* <Link to="/about" className="nav-link menu-item">About</Link> */}
              <br />
              <a id="about" className="menu-item" href="/about">About</a>
              <br />
              <a onClick={ this.logout } className="menu-item--small" href="/">Logout</a>
            </Menu>
          </Navbar>
        </div>
   </div>

    );
  }


  notLoggedHeader = () => {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">ClockinJS</Navbar.Brand>
        <Nav>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/about" className="nav-link">About</Link>
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
    storeEmail      : store.email
  }
};

const mapDispatchToProps = dispatch => {
  return {
    noUser: () => dispatch({type:"LOGOUT"})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SysHeader);