import { Link, Redirect, Route } from "react-router-dom";

import Logout from "../shared/Logout";
import PropTypes from "prop-types";
import React from "react";

const AuthWithNav = ({
  loggingIn,
  authenticated,
  component,
  path,
  exact,
  ...rest
}) => (
  <Route
    path={path}
    exact={exact}
    {...rest}
    render={props => {
      return authenticated ? (
        React.createElement(
          "div",
          { style: { overflowY: "auto", overflowX: "hidden" } },
          [
            React.createElement(
              "div",
              {
                style: {
                  width: "95%",
                  float: "left"
                },
                key: "1"
              },
              React.createElement(component, {
                ...props,
                ...rest,
                loggingIn,
                authenticated
              })
            ),
            React.createElement(
              "div",
              {
                style: {
                  width: "5%",
                  float: "right",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  margin: "0",
                  height: "100vh"
                },
                className: "h1 text-center",
                key: "2"
              },
              <span>
                <Link target="_blank" to={"/"}>
                  <i className="fa fa-home" aria-hidden="true" />
                </Link>
                <hr />
                <Logout />
                <hr />
                <Link target="_blank" to={"/profile"}>
                  <i className="fa fa-address-card-o" aria-hidden="true" />
                </Link>
                <hr />
                <Link target="_blank" to={"/effective-date"}>
                  <i className="fa fa-clock-o" aria-hidden="true" />
                </Link>
              </span>
            )
          ]
        )
      ) : (
        <Redirect to="/login" />
      );
    }}
  />
);

AuthWithNav.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool.isRequired
};

export default AuthWithNav;
