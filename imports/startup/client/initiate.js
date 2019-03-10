import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { Bert } from "meteor/themeteorchef:bert";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { MeteorAccountsLink } from "meteor/apollo";
import defaults from "../../ui/cache/defaults";
import { onError } from "apollo-link-error";
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

const errorLink = onError(({ networkErrors, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => console.log(`Graphql Error from initiate.js: ${message}`));
  }
  if (networkErrors) {
    graphQLErrors.map(({ message }) => console.log(`Network Error from initiate.js: ${message}`));
  }
});

// eslint-disable-next-line import/prefer-default-export
export const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    stateLink,
    new MeteorAccountsLink(),
    new HttpLink({
      uri: "/graphql"
    })
  ]),
  cache,
  connectToDevTools: true
});
