import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { logOut } from "api/modules/auth";
import { isAuthenticated, getDocumentId } from "api/selectors";
import "./styles.scss";

const MenuItem = ({ to, label }) => (
  <Route
    path={to}
    children={({ match }) => (
      <Link to={to} className={match ? "selected" : ""}>
        <span style={{ marginLeft: 10 }}> {label}</span>
      </Link>
    )}
  />
);

class Header extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    logOut: PropTypes.func,
    showBuilder: PropTypes.bool,
    documentId: PropTypes.string
  };

  render() {
    const {
      authenticated,
      logOut,
      showBuilder,
      documentId,
      match
    } = this.props;

    return (
      <div className="app-bar">
        <div className="menu">
          <Link to="/" style={{ padding: "0px" }}>
            <img
              src="https://d1xvn5mjulg4qv.cloudfront.net/3.0.0/images/logo_small.png"
              className="menu-logo"
              alt="logo"
            />
          </Link>
          <div className="right">
            <MenuItem to="/library" label="Library" />
            <MenuItem to="/documents" label="Documents" />
            {showBuilder && (
              <React.Fragment>
                <MenuItem
                  to={`/builder/${documentId || match.params.documentId}`}
                  label="Builder"
                />
                <MenuItem
                  to={`/preview/${documentId || match.params.documentId}`}
                  label="Preview"
                />
              </React.Fragment>
            )}
            <MenuItem to="/support" label="Support" />
            {authenticated && (
              <a onClick={logOut}>
                <span style={{ marginLeft: 10 }}>Log out</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const selectors = createStructuredSelector({
  authenticated: isAuthenticated,
  documentId: getDocumentId
});

const actions = {
  logOut
};

export default connect(selectors, actions)(withRouter(Header));
