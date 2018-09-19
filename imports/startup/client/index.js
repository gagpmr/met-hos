// import "bootstrap/dist/css/bootstrap.min.css";

// import ApolloClient from "apollo-client";
// import { ApolloProvider } from "react-apollo";
// import App from "/imports/ui/layouts/app";
// import { Bert } from "meteor/themeteorchef:bert";
// import { Meteor } from "meteor/meteor";
// import React from "react";
// import { meteorClientConfig } from "meteor/apollo";
// import { render } from "react-dom";

// Bert.defaults.style = "growl-bottom-right";
// Bert.defaults.hideDelay = 1500;

// const client = new ApolloClient(meteorClientConfig());

import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { MeteorAccountsLink } from "meteor/apollo";

const client = new ApolloClient({
  link: ApolloLink.from([
    new MeteorAccountsLink(),
    new HttpLink({
      uri: "/graphql"
    })
  ]),
  cache: new InMemoryCache()
});

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById("react-root")
  );
});
