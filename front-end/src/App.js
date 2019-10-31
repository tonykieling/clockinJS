import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// import './App.css';
import { connect } from "react-redux";

import Land       from "./component/Land.js";
import NoPage     from "./component/Error.js";
import SysHeader  from "./component/SysHeader.js";
import Register   from './component/Register.js';
import Login      from "./component/Login.js";
import decodeToken from "./component/aux/decodeToken.js";
import Home       from "./component/Home.js";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <SysHeader />
          <Switch>
            <Route exact path = "/" 
              render = {() => {
                const token = decodeToken(this.props.storeToken);
                if(!token) {
                  return <Land />
                }
                else
                  return <Home />
              }} />

            <Route exact path = "/register" component = { Register } />
            
            <Route exact path = "/login" 
              render = {() => {
                const token = decodeToken(this.props.storeToken);
                if(!token) {
                  return <Login />
                }
                else
                  return <Home />
              }} />
            
            <Route component = { NoPage } />
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = store => {
  return({
    storeToken: store.token
  });
}


export default connect(mapStateToProps, null)(App);
