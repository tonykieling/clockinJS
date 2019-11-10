import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { connect } from "react-redux";

import Land         from "./component/Land.js";
import NoPage       from "./component/Error.js";
import SysHeader    from "./component/SysHeader.js";
import Register     from './component/Register.js';
import Login        from "./component/Login.js";
// import decodeToken from "./component/aux/decodeToken.js";
import Home         from "./component/Home.js";
import ClientNew    from "./component/ClientNew.js";
import ClientList   from "./component/ClientsList.js";
import PunchInNew   from "./component/PunchInNew.js";
import PunchInsList from "./component/PunchInsList.js";
import InvoiceNew   from "./component/InvoiceNew.js";
// import InvoicesList from "./component/InvoicesList.js";

import PdfTemplate from "./component/PdfTemplate.js";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <SysHeader />
          <Switch>
            <Route exact path = "/" 
              render = {() => {
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

            <Route exact path = "/clientList" 
              render = {() => {
                if (!this.props.storeEmail)
                  return <Login />
                else
                  return <ClientList />
              }} />

            <Route exact path = "/punchInNew" 
              render = {() => {
                if (!this.props.storeEmail)
                  return <Login />
                else
                  return <PunchInNew />
              }} />

            <Route exact path = "/punchInsList" 
              render = {() => {
                if (!this.props.storeEmail)
                  return <Login />
                else
                  return <PunchInsList />
              }} />
            
            <Route exact path = "/invoiceNew" 
              render = {() => {
                if (!this.props.storeEmail)
                  return <Login />
                else
                  return <InvoiceNew />
              }} />
            
            <Route exact path = "/pdfTemplate" 
              render = {() => {
                if (!this.props.storeEmail)
                  return <Login />
                else
                  return <PdfTemplate />
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
    storeEmail      : store.email
  });
}


export default connect(mapStateToProps, null)(App);
