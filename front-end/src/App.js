import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './App.css';

import Land from "./component/Land.js";
import NoPage from "./component/Error.js";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path = "/" component = { Land } />

          <Route component = { NoPage } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
