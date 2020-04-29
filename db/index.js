const express = require("express");
const mongoose = require("mongoose");
const merge = require("lodash.merge");

const { ApolloServer, gql } = require("apollo-server-express");

const authFunc = require("./config/auth");
const { courseTypeDefs, userTypeDefs } = require("./types");
const { courseResolvers, userResolvers } = require("./resolvers");

mongoose.connect("mongodb://localhost/graphql_db_course", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Alert {
    message: String
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

// Provide resolver functions for your schema fields
const resolver = {};

const server = new ApolloServer({
  typeDefs: [typeDefs, courseTypeDefs, userTypeDefs],
  resolvers: merge(resolver, courseResolvers, userResolvers),
  context: authFunc,
});

const app = express();
server.applyMiddleware({ app });

app.listen(5000, () => {
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
});
