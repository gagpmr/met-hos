import "./accounts";
import "./fixtures";

import { ApolloServer } from "apollo-server-express";
import { WebApp } from "meteor/webapp";
import { getUser } from "meteor/apollo";
import { mergeSchemas } from "graphql-tools";
import resolvers from "../../server/resolvers";
import schemas from "../../server/schema";

const schema = mergeSchemas({
  schemas,
  resolvers
});

const server = new ApolloServer({
  schema,
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
