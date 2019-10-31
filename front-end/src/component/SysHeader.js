import React from 'react'
import { }

export default function Land() {

  // function to set no user thus closing the user's session
  logout = () => {

  }

  // when a user is logged
  loggedHeader = () => {
    return (
      <Navbar bg="primary" >
        <Navbar.Brand href="/">KcodingT</Navbar.Brand>
        <Nav>
          <Link to="/" className="nav-link">{this.props.storeEmail} is logged</Link>
          <Link to="/user/logged" className="nav-link">Check all users</Link>
          <Button onClick={this.logout} className="logoutBtn">Logout</Button>
        </Nav>
      </Navbar>
    )
  }


  notLoggedHeader = () => {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">KCodingT</Navbar.Brand>
        <Nav>
          <Link to="/login" className="nav-link">Login</Link>
          {/* <Link to="/user/logged" className="nav-link">Check all users</Link> */}
          <Link to="/register" className="nav-link">Register</Link>
        </Nav>
      </Navbar>
    )
  }


  render() {
    return(this.props.storeEmail ?
            this.loggedHeader() :
            this.notLoggedHeader()
          );
  }
  }
}
