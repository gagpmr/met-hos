import { Alert } from "react-bootstrap";
import React from "react";

export default (NotFound = () => (
  <Alert bsstyle="danger">
    <p>
      <strong>Error [404]</strong>: {window.location.pathname} does not exist.
    </p>
  </Alert>
));
