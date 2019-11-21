import React, { Component } from 'react'
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBContainer
} from 'mdbreact';

class SysHeader extends Component {

  state = {
    collapseID: ""
  };

  // function to set no user thus closing the user's session
  logout = () => {
    if (window.confirm("Are you sure you wanna leave?")) {
      this.props.noUser();
      return <Redirect to = "/land" />
    }
  }


  toggleCollapse = collapseID => () => {
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ''
    }));
  };


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
                {/* <Link to = "/clientNew" className="dropdown-item"> Add New Client</Link> */}
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
                <NavDropdown.Item href="pdfTemplate">List them all</NavDropdown.Item>
              </NavDropdown>            

              <Link to="/about" className="nav-link">About</Link>

            </Nav>

            <Button onClick={this.logout} className="logoutBtn">Logout</Button>

          </Navbar.Collapse>

        </Navbar>


        <MDBContainer className="showHamburguer">
          <MDBNavbar
            color='light-blue lighten-4'
            style={{ marginTop: '20px'}}
            light
          >
            <MDBContainer>
              <MDBNavbarBrand>
                <Link to = "/" className="navbar-brand"> ClockinJS </Link>
              </MDBNavbarBrand>

              <MDBNavbarToggler
                onClick={this.toggleCollapse('navbarCollapse1')}
              />
              <MDBCollapse
                id='navbarCollapse1'
                isOpen={this.state.collapseID}
                navbar
              >
                {/* https://mdbootstrap.com/docs/react/navigation/hamburger-menu/ */}

                <MDBNavbarNav left>
                    <MDBNavLink to='/user'>User's Home</MDBNavLink>
                </MDBNavbarNav>

                <MDBNavbarNav left>
                  <MDBNavItem active>
                    <NavDropdown title="Clients" id="basic-nav-dropdown1">
                      <NavDropdown.Item href="clientNew">Add New One</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/clientList"> List </NavDropdown.Item>
                    </NavDropdown>
                  </MDBNavItem>

                  <MDBNavItem active>
                    <NavDropdown title="Clockins" id="basic-nav-dropdown2">
                      <NavDropdown.Item href="punchInNew"> Punch in </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="punchInsList">List them all</NavDropdown.Item>
                    </NavDropdown>
                  </MDBNavItem>
                  <MDBNavItem>
                    <NavDropdown title="Invoices" id="basic-nav-dropdown3">
                      <NavDropdown.Item href="invoiceNew">Generate a brand new one</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="pdfTemplate">List them all</NavDropdown.Item>
                    </NavDropdown>    
                  </MDBNavItem>

                  <MDBNavItem>
                    <MDBNavLink to='about'>About</MDBNavLink>
                    {/* <Link to="/about" className="nav-link">About</Link> */}
                  </MDBNavItem>
                </MDBNavbarNav>
              </MDBCollapse>
            </MDBContainer>
          </MDBNavbar>
        </MDBContainer>


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