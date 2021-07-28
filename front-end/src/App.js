import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import './App.css';
import { connect } from "react-redux";

import Land           from "./component/Land.js";
import SysHeader      from "./component/SysHeader.js";
import SignUp         from './component/SignUp.js';
import Login          from "./component/Login.js";
import Home           from "./component/Home.js";
import User           from "./component/User.js";
import ClientNew      from "./component/ClientNew.js";
import ClientList     from "./component/ClientsList.js";
import PunchInNew     from "./component/PunchInNew.js";
import PunchInsList   from "./component/PunchInsList.js";
import InvoiceNew     from "./component/InvoiceNew.js";
import About          from "./component/About.js";
import InvoicesList   from "./component/InvoicesList.js";
import ResetPassword  from "./component/ResetPassword.js";
import Guidance       from "./component/Guidance.js";
import Contact        from "./component/Contact.js";
import InvoiceIssue   from "./component/InvoiceIssue.js";
import ClientGeneralNew from "./component/ClientGeneralNew.js";
import PunchinsReport from "./component/PunchInsReport.js";
import InvoicesReport from "./component/InvoicesReport.js";


class App extends Component {

  render() {
    return (
      <Router>
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

        <Route exact path = "/user" 
            render = {() => {
              if(!this.props.storeEmail) {
                return <Redirect to = "/land" />
              }
              else
                return <User />
            }} />

          <Route exact path = "/land" 
            render = {() => {
              if (!this.props.storeEmail)
                return <Land />
              else
                return <Redirect to = "/" />
            }} />

          <Route exact path = "/signup" 
            render = {() => {
              if (!this.props.storeEmail)
                return <SignUp />
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
              if (!this.props.storeEmail)
                return <Login />
              else
                return <ClientNew />
            }} />

          <Route exact path = "/clientGeneralNew" 
            render = {() => {
              if (!this.props.storeEmail)
                return <Login />
              else
                return <ClientGeneralNew />
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
          
          <Route exact path = "/invoicesList" 
            render = {() => {
              if (!this.props.storeEmail)
                return <Login />
              else
                return <InvoicesList />
            }} />

          <Route exact path = "/invoiceIssue" 
            render = {() => {
              if (!this.props.storeEmail)
                return <Login />
              else
                return <InvoiceIssue />
            }} />

          <Route exact path = "/reset_password/:code" >
            <ResetPassword />
          </Route>

          <Route exact path = "/about" >
            <About />
          </Route>

          <Route exact path = "/guidance" >
            <Guidance />
          </Route>

          <Route exact path = "/contact" >
            <Contact />
          </Route>

          <Route exact path = "/reports/clockins" >
            <PunchinsReport />
          </Route>

          <Route exact path = "/reports/invoices" >
            <InvoicesReport />
          </Route>

          <Route component = { Land } />

        </Switch>
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
