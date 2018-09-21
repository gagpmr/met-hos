import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const Authenticated = ({
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
        React.createElement(component, {
          ...props,
          ...rest,
          loggingIn,
          authenticated
        })
      ) : (
        <Redirect to="/login" />
      );
    }}
  />
);

Authenticated.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool.isRequired
};

export default Authenticated;
