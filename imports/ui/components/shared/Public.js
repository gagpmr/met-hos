import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const Public = ({
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
    render={props => {
      return !authenticated ? (
        React.createElement(component, {
          ...props,
          ...rest,
          loggingIn,
          authenticated
        })
      ) : (
        <Redirect to="/" />
      );
    }}
  />
);

Public.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
};

export default Public;
