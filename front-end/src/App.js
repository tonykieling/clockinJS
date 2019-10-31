import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// import './App.css';

import Land       from "./component/Land.js";
import NoPage     from "./component/Error.js";
import SysHeader  from "./component/SysHeader.js";
import Register from './component/Register.js';

function App() {
  return (
    <Router>
      <div>
        <SysHeader />
        <Switch>
          <Route exact path = "/" component = { Land } />
          <Route exact path = "/register" component = { Register } />
          <Route component = { NoPage } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
