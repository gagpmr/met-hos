import "bootstrap/dist/css/bootstrap.min.css";

import { ApolloProvider } from "react-apollo";
import App from "../../ui/layouts/app";
import { Meteor } from "meteor/meteor";
import React from "react";
import { client } from "./initiate";
import { render } from "react-dom";

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    // eslint-disable-next-line no-undef
    document.getElementById("react-root")
  );
});
