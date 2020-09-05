import React, { useState } from 'react'
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Menu from "react-burger-menu/lib/menus/slide";
import "../burguer.css";
import MessageModal from "./MessageModal.js";

const smallDevice = window.innerWidth < 800 ? true : false;

function SysHeader(props) {

  // const hh = useRef(null);

  //     useEffect( () => {
  // console.log("hhhh", hh.current);
  //       // The 'current' property contains info of the reference:
  //       // align, title, ... , width, height, etc.
  //       if(hh.current){
  //           const height = hh.current.offsetHeight;
  //           const width  = hh.current.offsetWidth;
  //           console.log("***header", height, width);
  //       }
  
  //     }, [hh]);


  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu]   = useState(false);
  const [goLand, setGoLand]       = useState(false);
  

  const logout = (e) => {
    e.preventDefault();

    setShowMenu(false);
    setShowModal(true);
  };


  const menuStateChange = state => {
    setShowMenu(state.isOpen);
  }


  const yesLeave = () => {
    setShowModal(false);
    props.noUser();
    setGoLand(true);
  };


  const noLeave = e => {
    // e.preventDefault();
    setShowMenu(false);
    setShowModal(false);
  };


// example of prevState for class components
  // toggleCollapse = collapseID => () => {
  //   this.setState(prevState => ({
  //     collapseID: prevState.collapseID !== collapseID ? collapseID : ''
  //   }));
  // };


  // when a user is logged
  const loggedHeader = () => {
    return (
      !smallDevice
        ?
          <div style={{all: "unset"}}>
            <Navbar
              bg="info"
              className="showNormalMenu"
              sticky  = {"top"}
            >
              <Navbar.Brand>
                <Link to = "/" className="navbar-brand"> Clockin.js </Link>
              </Navbar.Brand>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Link to="/user" className="nav-link">{props.storeEmail}</Link>
                  <NavDropdown title="Clients" id="basic-nav-dropdown1">
                    <NavDropdown title="Add a New One" id="basic-nav-submenu" drop="right" style={{paddingLeft: "1rem"}}>
                        <NavDropdown.Item href="clientNew">Kids</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="clientGeneralNew">General / Company</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/clientList"> List & Edit</NavDropdown.Item>
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
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="invoiceIssue">Issue an Invoice</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title="Reports" id="basic-nav-dropdown4">
                    <NavDropdown.Item href="clockins">Clockins</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="invoices">Invoices</NavDropdown.Item>
                  </NavDropdown>

                  <Link to="/guidance" className="nav-link">Guidance</Link>
                  <Link to="/about" className="nav-link">About</Link>
                  <Link to="/contact" className="nav-link">Contact</Link>

                </Nav>
                <Button onClick={logout} className="logoutBtn">Logout</Button>
              </Navbar.Collapse>
            </Navbar>
          </div>
        :
          <Navbar bg="info" 
            sticky={"top"}
            role="navigation"
          >
            <Link to="/" className="nav-link">Clockin.js</Link>
            <Link to="/user" className="nav-link">{props.storeEmail}</Link>

          <div className="showHamburguer">
            <Menu 
              right
              isOpen        = { showMenu }
              onStateChange = { state => menuStateChange(state) }
            >

              <NavDropdown title="Clients" id="basic-nav-dropdown1" className="menu-item">

                <NavDropdown title="Add a New One" id="basic-nav-submenu" drop="down">
                  <NavDropdown.Item href="clientNew">Kids</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="clientGeneralNew">General / Company</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown.Divider />
                <NavDropdown.Item href="/clientList"> List & Edit</NavDropdown.Item>

                {/* <NavDropdown.Item href="clientNew" className="menu-item">Add New One</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="clientList"> List & Edit</NavDropdown.Item> */}
              </NavDropdown>

              {/* <NavDropdown title="Clients" id="basic-nav-dropdown1">
                <NavDropdown title="Add a New One" id="basic-nav-submenu" id="submenu-item" drop="right">
                    <NavDropdown.Item href="clientNew">Kids</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="clientNew">General</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown.Divider />
                <NavDropdown.Item href="/clientList"> List & Edit</NavDropdown.Item>
              </NavDropdown> */}


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
                <NavDropdown.Divider />
                <NavDropdown.Item href="invoiceIssue">Issue an Invoice</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Reports" id="basic-nav-dropdown4">
                <NavDropdown.Item href="clockins">Clockins</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="invoices">Invoices</NavDropdown.Item>
              </NavDropdown>  

              <br />
              <a id="guidance" className="menu-item" href="/guidance">Guide</a>
              <br />
              <a id="about" className="menu-item" href="/about">About</a>
              <br />
              <a id="contact" className="menu-item" href="/contact">Contact</a>
              <br />
              <a onClick={ logout } className="menu-item--small" href="/">Logout</a>
            </Menu>
          </div>

        </Navbar>
    );
  }


  const notLoggedHeader = () => {
    return (
      <div style={{all: "unset"}}>
        <Navbar 
          bg="dark" variant="dark"
          sticky  = {"top"}
        >
          <Navbar.Brand href="/">Clockin.js</Navbar.Brand>
          <Nav>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
            <Link to="/guidance" className="nav-link">Guide</Link>
            <Link to="/about" className="nav-link">About</Link>
            { !smallDevice
                ? <Link to="/contact" className="nav-link">Contact</Link>
                 : ""
             }
          </Nav>
        </Navbar>
      </div>
    );
  }


    return(
      <div style={{all: "unset"}}>
  
        {(props.storeEmail) 
          ? loggedHeader() 
          : notLoggedHeader()
        }

        {showModal
          ? <MessageModal 
              openModal = { showModal}
              message   = { "Are you sure you want to leave?" }
              yesMethod = { yesLeave }
              noMethod  = { noLeave }
            />
          : ""
        }

        { goLand
          ? <Redirect to = "/land" />
          : ""
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