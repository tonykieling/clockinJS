import React, { useState } from 'react'
import { Navbar, Nav, NavDropdown, Button, Modal, ButtonGroup } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

// import { slide as Menu } from "react-burger-menu";
import Menu from "react-burger-menu/lib/menus/slide";
import "../burguer.css";

// class SysHeader extends Component {
function SysHeader(props) {

  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState();
  

  const logout = (e) => {
    e.preventDefault();
    // if (window.confirm("Are you sure you wanna leave?")) {
    //   props.noUser();
    //   return <Redirect to = "/land" />
    // }
    setShowMenu(!!false);
    setShowModal(true);
  };


  const quiting = () => {
    console.log("inside quiting function");
    setShowModal(false);
    props.noUser();
    return <Redirect to = "/land" />
  };


  const noLeave = e => {
    // e.preventDefault();
console.log("stillllllll", e);
    setShowMenu(true);
    setShowModal(false);
  };


  const leaveModal =         
    <Modal
      show    = { showModal }
      onHide  = { noLeave }
    >
      <Modal.Header closeButton>
        <Modal.Title>Are you sure you wanna leave?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <ButtonGroup 
          className = "mt-3"
          style     = {{ width: "50%" }} >
          <Button 
            variant   = "primary" 
            onClick   = { () => quiting() } 
            style     = {{width: "50%"}} >
            Yes
          </Button>
          <Button 
            variant   = "danger" 
            onClick   = { noLeave } 
            style     = {{ width: "50%"}} >
            No
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>;


  // const isMenuOpen = (state) => {
  //   console.log("Menus state = ", state);
  // }

// example of prevState
  // toggleCollapse = collapseID => () => {
  //   this.setState(prevState => ({
  //     collapseID: prevState.collapseID !== collapseID ? collapseID : ''
  //   }));
  // };


  // when a user is logged
  const loggedHeader = () => {
    return (
      <div>
        <Navbar bg="primary showNormalMenu" >
          <Navbar.Brand>
            <Link to = "/" className="navbar-brand"> ClockinJS </Link>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/user" className="nav-link">{props.storeEmail} is logged</Link>
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
            <Button onClick={logout} className="logoutBtn">Logout</Button>
          </Navbar.Collapse>
        </Navbar>

        <div className="showHamburguer">
          <Navbar bg="info">
            <Link to="/" className="nav-link">ClockinJS</Link>
            <Link to="/user" className="nav-link">{props.storeEmail}</Link>
            <Menu 
              right
              isOpen = { showMenu }
              // onStateChange = { isMenuOpen }
              >

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
                <NavDropdown.Item href="invoicesList">List, Check and Edit</NavDropdown.Item>
              </NavDropdown>            

              <br />
              <a id="about" className="menu-item" href="/about">About</a>
              <br />
              <a onClick={ logout } className="menu-item--small" href="/">Logout</a>
            </Menu>
          </Navbar>
        </div>
   </div>

    );
  }


  const notLoggedHeader = () => {
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


    return(
      <div>
  
        {(props.storeEmail) ?
              loggedHeader() :
              notLoggedHeader()
        }

        {showModal
          ? leaveModal
          : console.log("showModal is OFF")
        }

      </div>
    );
}


/**
 * 
 * Redux methods
 */
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