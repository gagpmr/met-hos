import "bootstrap/dist/css/bootstrap.min.css";

import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "react-apollo";
import App from "../../ui/layouts/app";
import { Bert } from "meteor/themeteorchef:bert";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Meteor } from "meteor/meteor";
import { MeteorAccountsLink } from "meteor/apollo";
import React from "react";
import defaults from "../../ui/cache/defaults";
import { render } from "react-dom";
import resolvers from "../../ui/cache/resolvers";
import { withClientState } from "apollo-link-state";

Bert.defaults.style = "growl-bottom-right";
Bert.defaults.hideDelay = 1500;

const cache = new InMemoryCache({
  dataIdFromObject: object => object.key || null
});

const stateLink = withClientState({
  cache,
  resolvers,
  defaults
});

const client = new ApolloClient({
  link: ApolloLink.from([
    stateLink,
    new MeteorAccountsLink(),
    new HttpLink({
      uri: "/graphql"
    })
  ]),
  cache
});

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    // eslint-disable-next-line no-undef
    document.getElementById("react-root")
  );
});
