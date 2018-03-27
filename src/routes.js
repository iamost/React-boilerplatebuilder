import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Library from "containers/Library";
import Documents from "containers/Documents";
import Builder from "containers/Builder";
import Preview from "containers/Preview";
import Dashboard from "containers/Dashboard";
import LogIn from "containers/LogIn";
import SignUp from "containers/SignUp";
import RecoverPassword from "containers/RecoverPassword";
import NewPassword from "containers/NewPassword";
import Homepage from "containers/Homepage/index.js";
import { userIsAuthenticatedRedir } from "utils/authHelper";

const rootRoute = () => (
  <div>
    {window.location.href.indexOf("token") > -1 && (
      <Route exact path="/" component={NewPassword} />
    )}

    {window.location.href.indexOf("token") === -1 && (
      <Route exact path="/" component={Homepage} />
    )}
  </div>
);

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={rootRoute} />
      <Route
        exact
        path="/builder/:documentId"
        component={userIsAuthenticatedRedir(Builder)}
      />
      <Route
        exact
        path="/library"
        component={userIsAuthenticatedRedir(Library)}
      />
      <Route
        exact
        path="/documents"
        component={userIsAuthenticatedRedir(Documents)}
      />
      <Route
        exact
        path="/preview/:documentId"
        component={userIsAuthenticatedRedir(Preview)}
      />
      <Route
        exact
        path="/support"
        component={userIsAuthenticatedRedir(Dashboard)}
      />
      <Route exact path="/login" component={LogIn} />
      <Route exact path="/sign-up" component={SignUp} />
      <Route exact path="/recover/password" component={RecoverPassword} />
    </Switch>
  </Router>
);

export default Routes;
