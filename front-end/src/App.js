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
// import decodeToken from "./component/aux/decodeToken.js";
import Home       from "./component/Home.js";
import ClientNew  from "./component/ClientNew.js";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <SysHeader />
          <Switch>
            <Route exact path = "/" 
              render = {() => {
                // const token = decodeToken(this.props.storeToken);
                if(!this.props.storeEmail) {
                  return <Redirect to = "/land" />
                }
                else
                  return <Home />
              }} />

            <Route exact path = "/land" 
              render = {() => {
                if (!this.props.storeEmail)
                  return <Land />
                else
                  return <Redirect to = "/" />
              }} />

            <Route exact path = "/register" 
              render = {() => {
                if (!this.props.storeEmail)
                  return <Register />
                else
                  return <Redirect to = "/" />
              }} />
            
            <Route exact path = "/login" 
              render = {() => {
                // const token = decodeToken(this.props.storeToken);
                // if(!token) {
                if (!this.props.storeEmail)
                  return <Login />
                else
                  return <Redirect to = "/" />
              }} />
            
            <Route exact path = "/clientNew" 
              render = {() => {
                // const token = decodeToken(this.props.storeToken);
                // if(!token) {
                if (!this.props.storeEmail)
                  return <Login />
                else
                  return <ClientNew />
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
    storeEmail: store.email
  });
}


export default connect(mapStateToProps, null)(App);
