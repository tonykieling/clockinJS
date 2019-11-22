import React, { Component } from 'react';
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
import { BrowserRouter as Router } from 'react-router-dom';

class hamburgerMenuPage extends Component {
  state = {
    collapseID: ''
  };

  toggleCollapse = collapseID => () => {
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ''
    }));
  };

  render() {
    return (
      <Router>
        <MDBContainer>
          <MDBNavbar
            color='light-blue lighten-4'
            style={{ marginTop: '20px' }}
            light
          >
            <MDBContainer>
              <MDBNavbarBrand>Navbar</MDBNavbarBrand>
              <MDBNavbarToggler
                onClick={this.toggleCollapse('navbarCollapse1')}
              />
              <MDBCollapse
                id='navbarCollapse1'
                isOpen={this.state.collapseID}
                navbar
              >
                <MDBNavbarNav left>
                  <MDBNavItem active>
                    <MDBNavLink to='#!'>Home</MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink to='#!'>Link</MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink to='#!'>Profile</MDBNavLink>
                  </MDBNavItem>
                </MDBNavbarNav>
              </MDBCollapse>
            </MDBContainer>
          </MDBNavbar>
        </MDBContainer>
      </Router>
    );
  }
}

export default hamburgerMenuPage;



{/* <MDBContainer >
<MDBNavbar
  color="indigo"
  style={{ marginTop: '1px'}}
  light
>
  <MDBContainer>
    <MDBNavbarBrand>
      <Link to = "/" className="navbar-brand"> ClockinJS </Link>
    </MDBNavbarBrand>

    <MDBNavbarToggler
      right
      onClick={this.toggleCollapse('navbarCollapse1')}
    />
    <MDBCollapse
      id='navbarCollapse1'
      isOpen={this.state.collapseID}
      navbar
    >

      <MDBNavbarNav>
          {/* <MDBNavLink to='/user'>User's Home</MDBNavLink>
          <NavDropdown.Item href="/user">User's Home</NavDropdown.Item>
      </MDBNavbarNav>

      <MDBNavbarNav>
        <MDBNavItem active>
          <NavDropdown title="Clients" id="basic-nav-dropdown1">
            <NavDropdown.Item href="/clientNew">Add New One</NavDropdown.Item>
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
          {/* <Link to="/about" className="nav-link">About</Link>
        </MDBNavItem>
      </MDBNavbarNav>
    </MDBCollapse>
  </MDBContainer>
</MDBNavbar>
</MDBContainer> */}
