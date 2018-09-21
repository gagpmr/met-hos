import "./accounts";
import "./fixtures";

import { ApolloServer } from "apollo-server-express";
import { WebApp } from "meteor/webapp";
import { getUser } from "meteor/apollo";
import { resolvers } from "/imports/server/resolvers";
import { typeDefs } from "/imports/server/schema";

// import { createApolloServer } from "meteor/apollo";
// import { makeExecutableSchema } from "graphql-tools";
// import { resolvers } from "/imports/server/resolvers";
// import { typeDefs } from "/imports/server/schema";

// // const cors = require("cors");

// const context = {};

// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers
// });

// createApolloServer({
//   schema,
//   context
// });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization)
  })
});

server.applyMiddleware({
  app: WebApp.connectHandlers,
  path: "/graphql"
});

WebApp.connectHandlers.use("/graphql", (req, res) => {
  if (req.method === "GET") {
    res.end();
  }
});
